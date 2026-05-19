import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getAdminClient } from "@/lib/db";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CRON_SECRET = process.env.CRON_SECRET;

const HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

function parseTurkishPrice(text: string): number | null {
  const match = text.replace(/ /g, " ").match(/([\d.]+,\d{2}|[\d.]+)/);
  if (!match) return null;
  const cleaned = match[1].replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

type Extractor = ($: cheerio.CheerioAPI) => number | null;

const siteExtractors: { domain: string; extract: Extractor }[] = [
  {
    domain: "ravzakitap.com",
    extract: ($) => parseTurkishPrice($("span.product-price").first().text()),
  },
  {
    domain: "kitapyurdu.com",
    extract: ($) => parseTurkishPrice($(".pr_sell-price .price__item").first().text()),
  },
  {
    domain: "trendyol.com",
    extract: ($) => {
      const discounted = $("span.discounted").first().text();
      if (discounted) return parseTurkishPrice(discounted);
      const priceLine = $('[data-testid="normal-price"] span').first().text();
      return parseTurkishPrice(priceLine);
    },
  },
  {
    domain: "hepsiburada.com",
    extract: ($) => {
      const el = $('[data-test-id="default-price"] span').first().text();
      if (el) return parseTurkishPrice(el);
      return parseTurkishPrice($('[data-test-id="price-current-price"] span').first().text());
    },
  },
  {
    domain: "amazon.com.tr",
    extract: ($) => {
      const candidates: number[] = [];
      // Core price (buybox / main listing)
      const corePrice = $("#corePrice_feature_div .a-offscreen").first().text();
      if (corePrice) { const p = parseTurkishPrice(corePrice); if (p) candidates.push(p); }
      // Standard a-price (usually the displayed price)
      const aPrice = $("#price .a-offscreen, .a-price[data-a-size='xl'] .a-offscreen").first().text();
      if (aPrice) { const p = parseTurkishPrice(aPrice); if (p) candidates.push(p); }
      // slot-price with aria-label
      const label = $("span.slot-price span[aria-label]").first().attr("aria-label") ?? "";
      if (label) { const p = parseTurkishPrice(label); if (p) candidates.push(p); }
      // Split price elements
      const priceWhole = $("span.a-price-whole").first().text();
      const priceFrac = $("span.a-price-fraction").first().text();
      if (priceWhole) { const p = parseTurkishPrice(`${priceWhole}${priceFrac}`); if (p) candidates.push(p); }
      // Return the lowest price found (most likely the real price, not a seller markup)
      return candidates.length ? Math.min(...candidates) : null;
    },
  },
];

function isSearchUrl(url: string): boolean {
  return url.includes("/sr?q=") || url.includes("/ara?q=") || url.includes("/s?k=");
}

function findExtractor(url: string): Extractor | null {
  if (isSearchUrl(url)) return null;
  for (const { domain, extract } of siteExtractors) {
    if (url.includes(domain)) return extract;
  }
  return null;
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getAdminClient();
  const { data: links, error } = await supabase
    .from("sales_links")
    .select("id, url, name, price, book_id")
    .neq("url", "")
    .order("book_id");

  if (error || !links?.length) {
    return NextResponse.json({ error: error?.message ?? "Güncellenecek link yok", total: 0 }, { status: error ? 500 : 200 });
  }

  const results: { id: string; name: string; book_id: string; old: number; new_price: number | null; status: string }[] = [];

  for (const link of links) {
    const extract = findExtractor(link.url);
    if (!extract) {
      results.push({ id: link.id, name: link.name, book_id: link.book_id, old: link.price, new_price: null, status: "desteklenmeyen_site" });
      continue;
    }

    try {
      const res = await fetch(link.url, {
        headers: HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        cache: "no-store",
      });

      if (!res.ok) {
        results.push({ id: link.id, name: link.name, book_id: link.book_id, old: link.price, new_price: null, status: `http_${res.status}` });
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);
      const newPrice = extract($);

      if (newPrice === null) {
        results.push({ id: link.id, name: link.name, book_id: link.book_id, old: link.price, new_price: null, status: "fiyat_bulunamadi" });
        continue;
      }

      await supabase.from("sales_links").update({ price: newPrice }).eq("id", link.id);
      results.push({ id: link.id, name: link.name, book_id: link.book_id, old: link.price, new_price: newPrice, status: "guncellendi" });
    } catch (err: any) {
      results.push({ id: link.id, name: link.name, book_id: link.book_id, old: link.price, new_price: null, status: `hata: ${err.message?.slice(0, 100)}` });
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  return NextResponse.json({
    tarih: new Date().toISOString(),
    toplam: links.length,
    guncellenen: results.filter((r) => r.status === "guncellendi").length,
    basarisiz: results.filter((r) => r.status !== "guncellendi").length,
    sonuclar: results,
  });
}

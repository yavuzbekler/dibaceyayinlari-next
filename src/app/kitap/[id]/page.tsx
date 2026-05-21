import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site-chrome";
import { getBook } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();
  const links = [...(book.sales_links ?? [])].sort((a, b) => {
    if (a.price === 0 && b.price > 0) return 1;
    if (b.price === 0 && a.price > 0) return -1;
    return a.price - b.price;
  });
  const cheapestPrice = links.length > 0 && links[0].price > 0 ? links[0].price : null;

  return (
    <PublicShell>
      <main className="page container">
        <div className="detail-grid">
          <aside className="detail-cover">
            <img src={book.cover ?? "/logo.jpg"} alt={book.title} />
          </aside>
          <section className="detail-body">
            <Link className="eyebrow" href="/kitaplar">← Kitaplar</Link>
            <h1>{book.title}</h1>
            <p style={{ color: "var(--brand-accent)", fontStyle: "italic", fontSize: 20 }}>{book.author?.name}</p>
            <p style={{ fontSize: 18 }}>{book.summary}</p>
            <div className="info-list">
              <div><b>Tür</b>{book.genre}</div>
              <div><b>Yayın</b>{book.published_date}</div>
              <div><b>ISBN</b>{book.isbn}</div>
            </div>
            {links.length > 0 && (
              <>
                <h2>Satış Kanalları</h2>
                <div className="sales-list">
                  {links.map((link) => {
                    const isCheapest = cheapestPrice !== null && link.price === cheapestPrice;
                    return (
                      <a key={`${link.name}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className={isCheapest ? "sales-cheapest" : ""}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong>{link.name}</strong>
                          {isCheapest && <span className="sales-badge">En Uygun</span>}
                        </div>
                        <span>{Number(link.price) > 0 ? `${Number(link.price).toFixed(2)} TL` : "—"} →</span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </PublicShell>
  );
}

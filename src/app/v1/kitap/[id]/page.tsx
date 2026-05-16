import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site-chrome";
import { getBook } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function V1BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) notFound();
  return (
    <PublicShell v1>
      <main className="page container">
        <div className="detail-grid">
          <aside className="detail-cover"><img src={book.cover ?? "/logo.jpg"} alt={book.title} /></aside>
          <section className="detail-body">
            <Link className="eyebrow" href="/v1/kitaplar">← Katalog</Link>
            <h1>{book.title}</h1>
            <p style={{ color: "var(--brand-accent)", fontSize: 20 }}>{book.author?.name}</p>
            <p style={{ fontSize: 18 }}>{book.summary}</p>
            <div className="info-list">
              <div><b>Tür</b>{book.genre}</div><div><b>Yayın</b>{book.published_date}</div><div><b>ISBN</b>{book.isbn}</div>
            </div>
            {(book.sales_links ?? []).length > 0 && (
              <>
                <h2>Satış Kanalları</h2>
                <div className="sales-list">
                  {[...(book.sales_links ?? [])].sort((a, b) => a.price - b.price).map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                      <strong>{link.name}</strong>
                      <span>{Number(link.price) > 0 ? `${Number(link.price).toFixed(2)} TL` : "—"} →</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </PublicShell>
  );
}

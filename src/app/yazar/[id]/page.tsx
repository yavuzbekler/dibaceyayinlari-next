import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { PublicShell } from "@/components/site-chrome";
import { getAuthor } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) notFound();

  return (
    <PublicShell>
      <main className="page container">
        <div className="detail-grid">
          <aside>
            <div className="detail-cover"><img src={author.photo ?? "/logo.jpg"} alt={author.name} /></div>
          </aside>
          <section className="detail-body">
            <Link className="eyebrow" href="/yazarlar">← Yazarlar Listesi</Link>
            <h1>{author.name}</h1>
            <p style={{ color: "var(--brand-accent)", letterSpacing: ".2em", textTransform: "uppercase", fontSize: 12 }}>Yazar / Çevirmen</p>
            {(author.full_bio ?? "").split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p>Dibace Yayınları ailesi olarak, {author.name} gibi kıymetli isimlerin eserlerini okurla buluşturmaktan gurur duyuyoruz. Her bir eser, yazarımızın entelektüel derinliğini ve sanatsal ustalığını yansıtmaktadır.</p>
          </section>
        </div>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>Yayınevimizden Çıkan Kitapları</h2>
          </div>
          <div className="book-grid">
            {author.books.map((book) => <BookCard key={book.id} book={{ ...book, author }} />)}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

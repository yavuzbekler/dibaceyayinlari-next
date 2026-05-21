import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { PublicShell } from "@/components/site-chrome";
import { getAuthor } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function V1AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) notFound();
  return (
    <PublicShell v1>
      <main className="page container">
        <div className="detail-grid">
          <aside className="detail-cover"><img src={author.photo ?? "/logo.jpg"} alt={author.name} /></aside>
          <section className="detail-body">
            <span className="eyebrow">Yazar / Çevirmen</span>
            <h1>{author.name}</h1>
            {(author.full_bio ?? "").split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        </div>
        <section className="section" style={{ paddingTop: 0 }}>
          <h2>Yayınevimizden Çıkan Kitapları</h2>
          <div className="book-grid">
            {author.books.map((book) => <BookCard key={book.id} book={{ ...book, author }} prefix="/v1" />)}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

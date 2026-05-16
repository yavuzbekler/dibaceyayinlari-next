import { BookCard } from "@/components/book-card";
import { PublicShell } from "@/components/site-chrome";
import { getBooks } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function V1BooksPage() {
  const books = await getBooks();
  return (
    <PublicShell v1>
      <main className="page container">
        <section className="page-title">
          <span className="eyebrow">Katalog</span>
          <h1>Kitaplarımız</h1>
          <p>Dibace Yayınları tarafından yayımlanan, geçmişin mirasını bugüne taşıyan seçkin eserler kataloğu.</p>
        </section>
        <section className="book-grid" style={{ paddingBottom: 92 }}>
          {books.map((book) => <BookCard key={book.id} book={book} prefix="/v1" />)}
        </section>
      </main>
    </PublicShell>
  );
}

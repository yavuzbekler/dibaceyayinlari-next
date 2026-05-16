import { BookCard } from "@/components/book-card";
import { PublicShell } from "@/components/site-chrome";
import { getBooks } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <PublicShell>
      <main className="page container">
        <section className="page-title">
          <h1>Kitaplarımız</h1>
          <p>Dibace Yayınları tarafından yayımlanan, geçmişin mirasını bugüne taşıyan seçkin eserler kataloğu.</p>
        </section>
        <section className="book-grid" style={{ paddingBottom: 92 }}>
          {books.map((book) => <BookCard key={book.id} book={book} />)}
        </section>
      </main>
    </PublicShell>
  );
}

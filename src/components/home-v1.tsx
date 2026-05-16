import Link from "next/link";
import type { Book } from "@/lib/types";
import { BookCard } from "./book-card";

export function HomeV1({ books }: { books: Book[] }) {
  const featureBooks = books.slice(0, 3);
  return (
    <main className="page">
      <section className="wide-container v1-hero">
        <div>
          <span className="eyebrow">DİBACE YAYINLARI</span>
          <h1>Hakikate açılan ilk sayfa.</h1>
          <p style={{ fontSize: 19, color: "var(--brand-body)", maxWidth: 620 }}>
            Tasavvuf, ahlak, siyaset ve hikmet klasiklerini bugünün okuruna temiz, sakin ve kalıcı bir yayın diliyle taşıyoruz.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Link className="btn" href="/v1/kitaplar">Kataloğu İncele</Link>
            <Link className="btn ghost" href="/v1/hakkimizda">Yayın Felsefesi</Link>
          </div>
        </div>
        <div className="v1-stack">
          {featureBooks.map((book) => <img key={book.id} src={book.cover ?? "/logo.jpg"} alt={book.title} />)}
        </div>
      </section>
      <section className="v1-band">
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <h2>İlim, irfan ve hikmet aynı rafta.</h2>
          <p style={{ color: "rgba(251,250,244,.72)", maxWidth: 520 }}>
            İçerik birebir aynı, arayüz daha editorial, daha ritimli ve katalog odaklı.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Katalog</span>
              <h2>Seçkin Eserler</h2>
            </div>
            <Link className="btn ghost" href="/v1/kitaplar">Tümünü Gör</Link>
          </div>
          <div className="book-grid">
            {books.slice(0, 6).map((book) => <BookCard key={book.id} book={book} prefix="/v1" />)}
          </div>
        </div>
      </section>
    </main>
  );
}

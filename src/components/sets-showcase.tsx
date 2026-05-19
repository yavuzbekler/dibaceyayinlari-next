"use client";

import Link from "next/link";
import { Package } from "lucide-react";

type SetBook = {
  id: string;
  title: string;
  cover: string | null;
  author: { name: string } | null;
};

type SetWithBooks = {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  book_set_items: { book_id: string; book: SetBook | null }[];
  set_sales_links: { name: string; url: string; price: number }[];
};

export function SetsShowcase({ sets, grid = false }: { sets: SetWithBooks[]; grid?: boolean }) {
  if (sets.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: 60, opacity: 0.4, fontSize: 16 }}>
        Henüz set oluşturulmamış.
      </p>
    );
  }

  return (
    <div className={grid ? "sets-showcase sets-showcase-grid" : "sets-showcase"}>
      {sets.map((set) => {
        const setBooks = set.book_set_items
          .map((i) => i.book)
          .filter(Boolean) as SetBook[];
        const minPrice =
          set.set_sales_links.length > 0
            ? Math.min(...set.set_sales_links.map((l) => l.price))
            : null;
        return (
          <div key={set.id} className="set-showcase-card">
            <div className="set-showcase-covers">
              {setBooks.map((b, i) => (
                <div
                  key={b.id}
                  className="set-showcase-cover"
                  style={{ zIndex: setBooks.length - i }}
                >
                  <img src={b.cover ?? "/logo.jpg"} alt={b.title} />
                </div>
              ))}
            </div>
            <div className="set-showcase-info">
              <div className="set-showcase-badge">
                <Package size={14} /> {setBooks.length} Kitap Seti
              </div>
              <h3 className="serif">{set.name}</h3>
              {set.description && (
                <p className="set-showcase-desc">{set.description}</p>
              )}
              <div className="set-showcase-books-list">
                {setBooks.map((b) => (
                  <Link
                    key={b.id}
                    href={`/kitap/${b.id}`}
                    className="set-showcase-book-name"
                  >
                    {b.title}
                    {b.author && <span> — {b.author.name}</span>}
                  </Link>
                ))}
              </div>
              {minPrice !== null && (
                <div className="set-showcase-price">
                  {minPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ₺
                </div>
              )}
              {set.set_sales_links.length > 0 && (
                <div className="set-showcase-links">
                  {set.set_sales_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn ghost"
                      style={{ fontSize: 10, padding: "10px 18px" }}
                    >
                      {link.name}
                      <span style={{ fontWeight: 400, opacity: 0.7 }}>
                        {link.price.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

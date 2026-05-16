import Link from "next/link";
import type { Book } from "@/lib/types";

export function BookCard({ book, prefix = "" }: { book: Book; prefix?: string }) {
  return (
    <article className="book-card">
      <Link href={`${prefix}/kitap/${book.id}`}>
        <div className="book-cover">
          <img src={book.cover ?? "/logo.jpg"} alt={book.title} />
        </div>
        <h3>{book.title}</h3>
        <p>{book.author?.name}</p>
        <div className="card-meta">
          <span>{book.genre}</span>
          <span>İncele →</span>
        </div>
      </Link>
    </article>
  );
}

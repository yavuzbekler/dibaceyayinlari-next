import { BookManager } from "@/components/book-manager";
import { AdminShell } from "@/components/admin-shell";
import { getAuthors, getBooks } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const [books, authors] = await Promise.all([getBooks(), getAuthors()]);
  return (
    <AdminShell>
      <BookManager books={books} authors={authors} />
    </AdminShell>
  );
}

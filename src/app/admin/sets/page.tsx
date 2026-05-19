import { AdminShell } from "@/components/admin-shell";
import { SetManager } from "@/components/set-manager";
import { getBooks, getAuthors, getBookSets } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSetsPage() {
  const [books, authors, sets] = await Promise.all([getBooks(), getAuthors(), getBookSets()]);
  return (
    <AdminShell>
      <SetManager sets={sets} books={books} authors={authors} />
    </AdminShell>
  );
}

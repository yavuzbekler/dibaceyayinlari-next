import { AdminManager } from "@/components/admin-manager";
import { AdminShell } from "@/components/admin-shell";
import { getAuthors } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  return (
    <AdminShell>
      <AdminManager mode="authors" rows={await getAuthors()} />
    </AdminShell>
  );
}

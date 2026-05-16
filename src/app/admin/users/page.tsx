import { AdminShell } from "@/components/admin-shell";
import { UsersManager } from "@/components/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  return (
    <AdminShell>
      <UsersManager />
    </AdminShell>
  );
}

import { AdminManager } from "@/components/admin-manager";
import { AdminShell } from "@/components/admin-shell";
import { getContents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  return (
    <AdminShell>
      <AdminManager mode="contents" rows={await getContents()} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin-shell";
import { PriceManager } from "@/components/price-manager";

export const dynamic = "force-dynamic";

export default function AdminPriceManagementPage() {
  return (
    <AdminShell>
      <PriceManager />
    </AdminShell>
  );
}

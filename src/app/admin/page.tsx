import { BookOpen, Link as LinkIcon, Users } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getAdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const stats = await getAdminStats();
  return (
    <AdminShell>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Genel bakış ve istatistikler</p>
        </div>
      </div>
      <section className="admin-grid">
        <div className="admin-stat"><Users color="#4ade80" /><span>Yazar</span><b>{stats.authorCount}</b></div>
        <div className="admin-stat"><BookOpen color="#4ade80" /><span>Kitap</span><b>{stats.bookCount}</b></div>
        <div className="admin-stat"><LinkIcon color="#4ade80" /><span>Satış Linki</span><b>{stats.salesLinkCount}</b></div>
      </section>
    </AdminShell>
  );
}

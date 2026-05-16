import { BookOpen, FileText, LayoutDashboard, LogOut, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Dibace Admin</div>
        <nav className="admin-nav">
          <a href="/admin"><LayoutDashboard size={18} /> Dashboard</a>
          <a href="/admin/books"><BookOpen size={18} /> Kitaplar</a>
          <a href="/admin/authors"><Users size={18} /> Yazarlar</a>
          <a href="/admin/site-settings"><FileText size={18} /> Site Metinleri</a>
          <a href="/api/admin/logout"><LogOut size={18} /> Çıkış</a>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

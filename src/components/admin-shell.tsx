import Link from "next/link";
import { BookOpen, FileText, LayoutDashboard, LogOut, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Dibace Admin</div>
        <nav className="admin-nav">
          <Link href="/admin"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link href="/admin/books"><BookOpen size={18} /> Kitaplar</Link>
          <Link href="/admin/authors"><Users size={18} /> Yazarlar</Link>
          <Link href="/admin/site-settings"><FileText size={18} /> Site Metinleri</Link>
          <Link href="/api/admin/logout"><LogOut size={18} /> Çıkış</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

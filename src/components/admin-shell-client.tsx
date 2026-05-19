"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, FileText, LayoutDashboard, LogOut, Users,
  ChevronDown, Sun, Moon, Monitor, Lock, UserPlus, DollarSign, Package
} from "lucide-react";

type Theme = "light" | "dark" | "system";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Kitaplar", icon: BookOpen },
  { href: "/admin/authors", label: "Yazarlar", icon: Users },
  { href: "/admin/sets", label: "Setler", icon: Package },
  { href: "/admin/price-management", label: "Fiyat Yönetimi", icon: DollarSign },
  { href: "/admin/site-settings", label: "Site Metinleri", icon: FileText },
  { href: "/admin/users", label: "Kullanıcılar", icon: UserPlus },
];

export function AdminShellClient({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dibace-theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme(document.documentElement.classList.contains("dark") ? "system" : "light");
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyTheme(t: Theme) {
    setTheme(t);
    localStorage.setItem("dibace-theme", t);
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }

  async function changePassword() {
    setPwError("");
    setPwSuccess(false);
    if (newPw !== confirmPw) { setPwError("Şifreler eşleşmiyor."); return; }
    if (newPw.length < 6) { setPwError("Şifre en az 6 karakter olmalı."); return; }
    setPwSaving(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (!res.ok) { setPwError(data.error ?? "Bir hata oluştu."); return; }
    setPwSuccess(true);
    setTimeout(() => {
      setPasswordModal(false);
      setOldPw(""); setNewPw(""); setConfirmPw("");
      setPwSuccess(false); setPwError("");
    }, 1500);
  }

  function closePasswordModal() {
    setPasswordModal(false);
    setOldPw(""); setNewPw(""); setConfirmPw("");
    setPwError(""); setPwSuccess(false);
  }

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Dibace Admin <span className="admin-by">BY MTY</span></div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-header-bar">
          <div className="admin-user-area" ref={dropdownRef}>
            <button className="admin-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="admin-avatar">{initials}</span>
              <span>{username}</span>
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="admin-dropdown">
                <div className="admin-dropdown-header">
                  <div><strong>{username}</strong></div>
                  <small>Yönetici</small>
                </div>
                <div className="admin-dropdown-sep" />
                <div className="admin-theme-label">Tema</div>
                <div className="admin-theme-row">
                  <button className={`admin-theme-btn${theme === "light" ? " active" : ""}`} onClick={() => applyTheme("light")}>
                    <Sun size={14} /> Açık
                  </button>
                  <button className={`admin-theme-btn${theme === "dark" ? " active" : ""}`} onClick={() => applyTheme("dark")}>
                    <Moon size={14} /> Koyu
                  </button>
                  <button className={`admin-theme-btn${theme === "system" ? " active" : ""}`} onClick={() => applyTheme("system")}>
                    <Monitor size={14} /> Sistem
                  </button>
                </div>
                <div className="admin-dropdown-sep" />
                <button className="admin-dropdown-item" onClick={() => { setPasswordModal(true); setDropdownOpen(false); }}>
                  <Lock size={16} /> Şifre Değiştir
                </button>
                <a href="/api/admin/logout" className="admin-dropdown-item danger">
                  <LogOut size={16} /> Çıkış
                </a>
              </div>
            )}
          </div>
        </div>
        {children}
      </main>

      {passwordModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closePasswordModal(); }}>
          <div className="admin-modal">
            <h2>Şifre Değiştir</h2>
            <div className="admin-form">
              <input type="password" placeholder="Mevcut şifre" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
              <input type="password" placeholder="Yeni şifre" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
              <input type="password" placeholder="Yeni şifre (tekrar)" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
              {pwError && <p style={{ color: "var(--admin-danger)", margin: 0, fontSize: 14 }}>{pwError}</p>}
              {pwSuccess && <p style={{ color: "var(--admin-green)", margin: 0, fontSize: 14 }}>Şifre başarıyla değiştirildi!</p>}
              <div className="admin-actions">
                <button className="admin-btn" disabled={pwSaving} onClick={changePassword}>
                  {pwSaving ? "Kaydediliyor..." : "Değiştir"}
                </button>
                <button className="admin-btn secondary" onClick={closePasswordModal}>Vazgeç</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  ["Anasayfa", "/"],
  ["Hakkımızda", "/hakkimizda"],
  ["Kitaplar", "/kitaplar"],
  ["Yazarlar", "/yazarlar"],
  ["İletişim", "/iletisim"],
] as const;

export function SiteHeader({ v1 = false }: { v1?: boolean }) {
  const prefix = v1 ? "/v1" : "";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="brand" href={`${prefix}/`} onClick={() => setIsOpen(false)}>
            <img src="/dibace_logo_siyah.png" alt="Dibace Yayınları" />
          </Link>
          <nav className="nav" aria-label="Ana menü">
            {navItems.map(([label, href]) => (
              <Link key={href} href={`${prefix}${href}`}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menü"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <div className={`mobile-overlay ${isOpen ? "open" : ""}`}>
        <div className="mobile-overlay-header">
          <span className="serif mobile-menu-title">MENÜ</span>
          <button
            className="menu-toggle visible"
            onClick={() => setIsOpen(false)}
            aria-label="Kapat"
          >
            <X size={28} />
          </button>
        </div>
        <div className="mobile-overlay-body">
          {navItems.map(([label, href], i) => (
            <Link
              key={href}
              href={`${prefix}${href}`}
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mobile-overlay-footer">
          <p className="serif mobile-footer-title">Dibace Yayınları</p>
          <p className="mobile-address">
            Dervişali Mahallesi. Draman Caddesi. 3/A Fatih / İstanbul
          </p>
        </div>
      </div>
    </>
  );
}

export function SiteFooter({ v1 = false }: { v1?: boolean }) {
  const prefix = v1 ? "/v1" : "";
  return (
    <footer className="site-footer">
      <div className="container footer-center">
        <div className="footer-brand">
          <h2 className="footer-title serif">DİBACE</h2>
          <p className="footer-tagline">Yayınları</p>
        </div>
        <nav className="footer-nav">
          <Link href={`${prefix}/`}>Anasayfa</Link>
          <Link href={`${prefix}/hakkimizda`}>Hakkımızda</Link>
          <Link href={`${prefix}/kitaplar`}>Kitaplar</Link>
          <Link href={`${prefix}/iletisim`}>İletişim</Link>
        </nav>
        <div className="footer-divider" />
        <div className="footer-info">
          <p className="footer-address">
            Dervişali Mahallesi. Draman Caddesi. 3/A Fatih / İstanbul
          </p>
          <div className="footer-copyright-row">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Dibace Yayınları. Tüm hakları
              saklıdır.
            </p>
            <p className="footer-by">By MTY</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({
  children,
  v1 = false,
}: {
  children: React.ReactNode;
  v1?: boolean;
}) {
  return (
    <div className={v1 ? "v1" : undefined}>
      <SiteHeader v1={v1} />
      {children}
      <SiteFooter v1={v1} />
    </div>
  );
}

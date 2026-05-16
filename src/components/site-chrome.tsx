import Link from "next/link";

const navItems = [
  ["Kitaplar", "/kitaplar"],
  ["Yazarlar", "/yazarlar"],
  ["Hakkımızda", "/hakkimizda"],
  ["İletişim", "/iletisim"]
] as const;

export function SiteHeader({ v1 = false }: { v1?: boolean }) {
  const prefix = v1 ? "/v1" : "";
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand" href={`${prefix}/`}>
          <img src="/dibace_logo_siyah.png" alt="Dibace Yayınları" />
          <span>
            <span className="brand-title">Dibace Yayınları</span>
            <span className="brand-tagline">Edebiyatın Önsözü</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Ana menü">
          {navItems.map(([label, href]) => (
            <Link key={href} href={`${prefix}${href}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ v1 = false }: { v1?: boolean }) {
  const prefix = v1 ? "/v1" : "";
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2 className="serif">Dibace Yayınları</h2>
          <p>Edebiyatın önsözü. Geçmişin mirasını bugünün okuruyla buluşturan seçkin yayıncılık.</p>
        </div>
        <div>
          <h3>Sayfalar</h3>
          <p><Link href={`${prefix}/kitaplar`}>Kitaplar</Link></p>
          <p><Link href={`${prefix}/yazarlar`}>Yazarlar</Link></p>
          <p><Link href={`${prefix}/hakkimizda`}>Hakkımızda</Link></p>
        </div>
        <div>
          <h3>İletişim</h3>
          <p>Dervişali Mahallesi. Draman Caddesi. 3/A Fatih / İstanbul</p>
          <p>dibaceyayinlari@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children, v1 = false }: { children: React.ReactNode; v1?: boolean }) {
  return (
    <div className={v1 ? "v1" : undefined}>
      <SiteHeader v1={v1} />
      {children}
      <SiteFooter v1={v1} />
    </div>
  );
}

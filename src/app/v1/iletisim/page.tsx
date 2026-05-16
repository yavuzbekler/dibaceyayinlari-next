import { Instagram, Mail, MapPin } from "lucide-react";
import { PublicShell } from "@/components/site-chrome";

export default function V1ContactPage() {
  return (
    <PublicShell v1>
      <main className="page">
        <section className="wide-container v1-hero">
          <div>
            <span className="eyebrow">İLETİŞİM</span>
            <h1>Okur, yazar ve kitapçılar için açık kapı.</h1>
            <p style={{ fontSize: 19, color: "var(--brand-body)", maxWidth: 620 }}>
              Soru, öneri, iş birliği ve kitap talepleriniz için aşağıdaki kanallar üzerinden Dibace Yayınları'na ulaşabilirsiniz.
            </p>
          </div>
          <div className="contact-grid" style={{ margin: 0 }}>
            <div>
              <div className="contact-line"><Mail color="#7a4a2e" /><div><span className="eyebrow">E-Posta</span><p>dibaceyayinlari@gmail.com</p></div></div>
              <div className="contact-line"><MapPin color="#7a4a2e" /><div><span className="eyebrow">Adres</span><p>Dervişali Mahallesi. Draman Caddesi. 3/A<br />Fatih / İstanbul</p></div></div>
              <div className="contact-line"><Instagram color="#7a4a2e" /><div><span className="eyebrow">Sosyal Medya</span><p><a href="https://www.instagram.com/dibaceyayinlari/" target="_blank" rel="noreferrer">Instagram</a> · <a href="https://x.com/dibaceyayinlari" target="_blank" rel="noreferrer">X (Twitter)</a></p></div></div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <form className="contact-form" action="https://formspree.io/f/xxx" method="POST">
              <div className="form-field"><label>İsim Soyisim</label><input name="name" required /></div>
              <div className="form-field"><label>E-Posta Adresi</label><input name="email" type="email" required /></div>
              <div className="form-field"><label>Mesajınız</label><textarea name="message" required /></div>
              <button className="btn dark" type="submit">Gönder</button>
            </form>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

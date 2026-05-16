import { Instagram, Mail, MapPin } from "lucide-react";
import { PublicShell } from "@/components/site-chrome";

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="page container">
        <section className="page-title" style={{ textAlign: "center" }}>
          <h1>İletişim</h1>
          <p style={{ margin: "0 auto" }}>Soru veya önerileriniz için aşağıdaki kanallar üzerinden bize ulaşabilirsiniz.</p>
        </section>
        <section className="contact-grid">
          <div>
            <div className="contact-line"><Mail color="#7a4a2e" /><div><span className="eyebrow">E-Posta</span><p>dibaceyayinlari@gmail.com</p></div></div>
            <div className="contact-line"><MapPin color="#7a4a2e" /><div><span className="eyebrow">Adres</span><p>Dervişali Mahallesi. Draman Caddesi. 3/A<br />Fatih / İstanbul</p></div></div>
            <div className="contact-line"><Instagram color="#7a4a2e" /><div><span className="eyebrow">Sosyal Medya</span><p><a href="https://www.instagram.com/dibaceyayinlari/" target="_blank" rel="noreferrer">Instagram</a> · <a href="https://x.com/dibaceyayinlari" target="_blank" rel="noreferrer">X (Twitter)</a></p></div></div>
          </div>
          <form className="contact-form" action="https://formspree.io/f/xxx" method="POST">
            <div className="form-field"><label>İsim Soyisim</label><input name="name" required /></div>
            <div className="form-field"><label>E-Posta Adresi</label><input name="email" type="email" required /></div>
            <div className="form-field"><label>Mesajınız</label><textarea name="message" required /></div>
            <button className="btn dark" type="submit">Gönder</button>
          </form>
        </section>
      </main>
    </PublicShell>
  );
}

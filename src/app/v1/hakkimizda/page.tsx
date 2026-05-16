import Link from "next/link";
import { Award, BookOpen, Feather, Layers, PenTool } from "lucide-react";
import { PublicShell } from "@/components/site-chrome";
import { getBooks } from "@/lib/db";

export const dynamic = "force-dynamic";

const steps = [
  [Feather, "1. Eser Seçimi", "Yayın kurulumuz, binlerce eser arasından sadece zamana direnebilen, edebi ve ilmi derinliği olan metinleri seçer."],
  [PenTool, "2. Tercüme & Tahkik", "Klasik metinlerin aslına sadık kalınarak, günümüz Türkçesiyle harmanlanır."],
  [Layers, "3. Editoryal İşçilik", "Metinler; imla, akıcılık ve kavramsal tutarlılık açısından defalarca gözden geçirilir. Her cümle üzerinde durulur."],
  [BookOpen, "4. Tasarım & Baskı", "Kitabın ruhunu yansıtan kapak tasarımı, gözü yormayan mizanpaj ve kaliteli kağıt seçimiyle eser vücut bulur."]
] as const;

export default async function V1AboutPage() {
  const books = await getBooks();

  return (
    <PublicShell v1>
      <main className="page">
        <section className="wide-container v1-hero">
          <div>
            <span className="eyebrow">KURUMSAL KİMLİK</span>
            <h1>Sözün değerini bilenler için.</h1>
            <p style={{ fontSize: 19, color: "var(--brand-body)", maxWidth: 680 }}>
              Dibace Yayınları, medeniyetimizin köklü mirasını modern yayıncılık ilkeleriyle harmanlayarak bugünün okuruna sunan bir kültür köprüsüdür.
            </p>
          </div>
          <div className="about-image"><img src="/about-hands.png" alt="Dibace Yayınları" /></div>
        </section>
        <section className="section">
          <div className="container split">
            <div>
              <span className="eyebrow">Neden Dibace?</span>
              <h2>Hakikate ve hikmete açılan zarif başlangıç.</h2>
            </div>
            <div>
              <p>Dibace, klasik edebiyatımızda eserlerin giriş bölümüne, önsözüne verilen addır. Bir eserin ruhuna açılan ilk kapıdır. Biz de yayınevi olarak kendimizi, hakikate ve hikmete açılan bir kapı, zarif bir başlangıç olarak görüyoruz.</p>
              <p>Yayın hayatımıza başladığımız günden bu yana, sadece çok satan değil, "çok kalan" kitapların peşine düştük. Günübirlik rüzgarlara kapılmadan, kütüphanelerde nesiller boyu saklanacak, babadan evlada miras kalacak nitelikte eserler neşretmeyi gaye edindik.</p>
              <blockquote style={{ borderLeft: "4px solid var(--brand-accent)", paddingLeft: 24, fontFamily: "Libre Baskerville", fontStyle: "italic", fontSize: 20 }}>
                "Bizim için yayıncılık bir ticaret değil, bir emaneti geleceğe taşıma sorumluluğudur."
              </blockquote>
              <p>Geleneksel ile moderni, doğu ile batıyı, ilim ile irfanı aynı rafta buluşturuyoruz. Çünkü inanıyoruz ki; kelimeler sınır tanımaz ve iyi bir kitap, okurunu zamanın ötesine taşır.</p>
            </div>
          </div>
        </section>
        <section className="v1-band">
          <div className="container stats-grid">
            <div><div className="stat-value">{books.length}</div><span className="eyebrow">Seçkin Eser</span></div>
            <div><div className="stat-value">15</div><span className="eyebrow">Yıllık Tecrübe</span></div>
            <div><div className="stat-value">∞</div><span className="eyebrow">Sınırsız Tutku</span></div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Yayın Yolculuğu</span>
                <h2>Bir kitabın okura varışı.</h2>
              </div>
            </div>
            <div className="process-grid">
              {steps.map(([Icon, title, desc]) => (
                <article className="process-card" key={title}>
                  <Icon color="#7a4a2e" />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="v1-band">
          <div className="container" style={{ textAlign: "center" }}>
            <Award color="#caa26f" size={48} />
            <h2>Akademik Hassasiyet</h2>
            <p style={{ color: "rgba(251,250,244,.72)", maxWidth: 760, margin: "0 auto 28px" }}>
              Dibace Yayınları, yayımladığı her eserde akademik yetkinliği esas alır. Eserlerimiz, sahasında otorite kabul edilen akademisyenlerden oluşan bilim kurulumuzun onayı ve gözetimi altında hazırlanmaktadır.
            </p>
            <Link className="btn" href="/v1/iletisim">Okur Ailemize Katılın</Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

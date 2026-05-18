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

export default async function AboutPage() {
  const books = await getBooks();
  return (
    <PublicShell>
      <main className="page">
        {/* 1. Hero */}
        <section className="about-hero about-hero-texture">
          <div className="container about-hero-inner">
            <span className="eyebrow">KURUMSAL KİMLİK</span>
            <h1 className="about-hero-title">&ldquo;Sözün değerini bilenler için...&rdquo;</h1>
            <p className="about-hero-desc">
              Dibace Yayınları, medeniyetimizin köklü mirasını modern yayıncılık
              ilkeleriyle harmanlayarak bugünün okuruna sunan bir kültür köprüsüdür.
            </p>
          </div>
        </section>

        {/* 2. Hikayemiz */}
        <section className="section about-story-section">
          <div className="container about-story-grid">
            <div className="about-image-decorated">
              <div className="about-image-main">
                <img src="/about-hands.png" alt="Dibace Ofis" />
              </div>
              <div className="about-image-frame" />
              <div className="about-image-blur" />
            </div>
            <div className="about-story-text">
              <h2>Neden &lsquo;Dibace&rsquo;?</h2>
              <div className="about-story-body">
                <p>
                  <span className="about-drop-cap">D</span>
                  ibace, klasik edebiyatımızda eserlerin giriş bölümüne, önsözüne
                  verilen addır. Bir eserin ruhuna açılan ilk kapıdır. Biz de
                  yayınevi olarak kendimizi, hakikate ve hikmete açılan bir kapı,
                  zarif bir başlangıç olarak görüyoruz.
                </p>
                <p>
                  Yayın hayatımıza başladığımız günden bu yana, sadece çok satan
                  değil, &ldquo;çok kalan&rdquo; kitapların peşine düştük. Günübirlik
                  rüzgarlara kapılmadan, kütüphanelerde nesiller boyu saklanacak,
                  babadan evlada miras kalacak nitelikte eserler neşretmeyi gaye
                  edindik.
                </p>
                <blockquote className="about-blockquote">
                  &ldquo;Bizim için yayıncılık bir ticaret değil, bir emaneti
                  geleceğe taşıma sorumluluğudur.&rdquo;
                </blockquote>
                <p>
                  Geleneksel ile moderni, doğu ile batıyı, ilim ile irfanı aynı
                  rafta buluşturuyoruz. Çünkü inanıyoruz ki; kelimeler sınır
                  tanımaz ve iyi bir kitap, okurunu zamanın ötesine taşır.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. İstatistikler */}
        <section className="stats-band">
          <div className="container">
            <div className="stats-grid stats-divided">
              <div className="stat-item">
                <div className="stat-value">{books.length}</div>
                <span className="eyebrow">Seçkin Eser</span>
              </div>
              <div className="stat-item">
                <div className="stat-value">15</div>
                <span className="eyebrow">Yıllık Tecrübe</span>
              </div>
              <div className="stat-item">
                <div className="stat-value">∞</div>
                <span className="eyebrow">Sınırsız Tutku</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bir Kitabın Yolculuğu */}
        <section className="section">
          <div className="container">
            <div className="about-process-head">
              <h2>Bir Kitabın Yolculuğu</h2>
              <p>
                Ham metinden okurun eline ulaşan o zarif nesneye dönüşene kadar,
                her aşamada kuyumcu titizliğiyle çalışıyoruz.
              </p>
            </div>
            <div className="process-grid">
              {steps.map(([Icon, title, desc]) => (
                <article className="about-process-card" key={title}>
                  <div className="about-process-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="serif">{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Akademik Hassasiyet */}
        <section className="about-academic">
          <div className="container about-academic-inner">
            <Award size={48} className="about-academic-icon" />
            <h2>Akademik Hassasiyet</h2>
            <p>
              Dibace Yayınları, yayımladığı her eserde akademik yetkinliği esas
              alır. Eserlerimiz, sahasında otorite kabul edilen akademisyenlerden
              oluşan bilim kurulumuzun onayı ve gözetimi altında hazırlanmaktadır.
              Amacımız, popüler kültürün yüzeyselliğinden uzak, referans değeri
              taşıyan bir külliyat oluşturmaktır.
            </p>
            <div className="about-keywords">
              <span>Güvenilirlik</span>
              <span>•</span>
              <span>Derinlik</span>
              <span>•</span>
              <span>Kalite</span>
            </div>
          </div>
        </section>

        {/* 6. Okur Ailemize Katılın */}
        <section className="about-join">
          <div className="container about-join-inner">
            <div className="about-join-text">
              <h2>Okur Ailemize Katılın</h2>
              <p>
                Biz, okurlarımızı bir müşteri olarak değil, aynı irfan sofrasını
                paylaştığımız dostlarımız olarak görüyoruz. Çıkan her yeni
                kitabımızda, düzenlenen söyleşilerimizde sizi de aramızda görmekten
                mutluluk duyarız.
              </p>
              <a
                href="https://x.com/dibaceyayinlari"
                target="_blank"
                rel="noopener noreferrer"
                className="about-x-link"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Dibace Kültür Topluluğu</span>
              </a>
            </div>
            <div className="about-join-image">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
                alt="Kitap Okuyan Birisi"
              />
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

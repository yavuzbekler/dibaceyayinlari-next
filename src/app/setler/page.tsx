import { PublicShell } from "@/components/site-chrome";
import { getBookSets } from "@/lib/db";
import { SetsShowcase } from "@/components/sets-showcase";

export const dynamic = "force-dynamic";

export default async function SetsPage() {
  const sets = await getBookSets();
  return (
    <PublicShell>
      <main className="page container">
        <section className="page-title">
          <h1>Kitap Setleri</h1>
          <p>Özenle seçilmiş eserlerden oluşan özel koleksiyonlarımız.</p>
        </section>
        <section style={{ paddingBottom: 92 }}>
          <SetsShowcase sets={sets} grid />
        </section>
      </main>
    </PublicShell>
  );
}

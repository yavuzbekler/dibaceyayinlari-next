import Link from "next/link";
import { PublicShell } from "@/components/site-chrome";
import { getAuthors } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
  const authors = await getAuthors();
  return (
    <PublicShell>
      <main className="page container">
        <section className="page-title">
          <span className="eyebrow">Ekibimiz</span>
          <h1>Yazarlarımız</h1>
          <p>Dibace Yayınları'nın kataloğuna entelektüel derinlik katan kıymetli müellifler ve mütercimler.</p>
        </section>
        <section className="authors-grid">
          {authors.map((author) => (
            <article className="author-card" key={author.id}>
              <Link href={`/yazar/${author.id}`}><img src={author.photo ?? "/logo.jpg"} alt={author.name} /></Link>
              <h2><Link href={`/yazar/${author.id}`}>{author.name}</Link></h2>
              <p>{author.short_bio}</p>
              <Link className="eyebrow" href={`/yazar/${author.id}`}>Yazar Profili →</Link>
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}

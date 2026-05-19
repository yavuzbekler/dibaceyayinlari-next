import { HomeClassic } from "@/components/home-classic";
import { PublicShell } from "@/components/site-chrome";
import { getBooks, getContents, getHomepageSets } from "@/lib/db";
import { contentMap } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [books, contents, sets] = await Promise.all([getBooks(), getContents(), getHomepageSets()]);
  return (
    <PublicShell>
      <HomeClassic books={books} content={contentMap(contents)} sets={sets} />
    </PublicShell>
  );
}

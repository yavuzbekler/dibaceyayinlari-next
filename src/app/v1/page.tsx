import { HomeV1 } from "@/components/home-v1";
import { PublicShell } from "@/components/site-chrome";
import { getBooks } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function V1HomePage() {
  return (
    <PublicShell v1>
      <HomeV1 books={await getBooks()} />
    </PublicShell>
  );
}

import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/dictionaries";
import { siteName } from "@/lib/site";

// Placeholder until the real homepage lands in M2.
export default async function HomePage() {
  const t = await getDictionary();

  return (
    <main id="main" className="flex-1">
      <Container className="flex flex-col gap-5 py-24 md:py-32">
        <h1 className="text-display">{siteName}</h1>
        <p className="max-w-2xl text-lead text-ink">{t.home.headline}</p>
        <p className="text-muted">{t.home.status}</p>
      </Container>
    </main>
  );
}

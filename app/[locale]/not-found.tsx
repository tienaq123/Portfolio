import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <main id="main" className="flex-1">
      <Container className="flex flex-col items-start gap-4 py-24 md:py-32">
        <h1 className="text-title">{t.notFound.title}</h1>
        <p>{t.notFound.description}</p>
        <ButtonLink href={`/${locale}`} variant="secondary" className="mt-2">
          {t.notFound.backHome}
        </ButtonLink>
      </Container>
    </main>
  );
}

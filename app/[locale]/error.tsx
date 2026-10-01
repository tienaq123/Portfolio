"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { en } from "@/messages/en";
import { vi } from "@/messages/vi";

// Error boundaries are Client Components and get no props from the server,
// so both (small) message sets ship with this boundary.
const strings = { en: en.error, vi: vi.error };

export default function LocaleError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const locale = hasLocale(params.locale) ? params.locale : defaultLocale;
  const t = strings[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex-1">
      <Container className="flex flex-col items-start gap-4 py-24 md:py-32">
        <h1 className="text-title">{t.title}</h1>
        <p>{t.description}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button onClick={() => retry()}>{t.retry}</Button>
          <ButtonLink href={`/${locale}`} variant="secondary">
            {t.backHome}
          </ButtonLink>
        </div>
        {error.digest && (
          <p className="text-sm text-muted">
            {t.reference}: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </Container>
    </main>
  );
}

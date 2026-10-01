"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { locales } from "@/i18n/config";
import { en } from "@/messages/en";
import { vi } from "@/messages/vi";
import { fontVariables } from "./fonts";
import "./globals.css";

// Replaces the root layout when it fails, so no locale is known: both languages.
const messages = { en, vi };

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <title>{`${en.error.title} / ${vi.error.title}`}</title>
        <main className="flex flex-1 items-center">
          <Container className="grid gap-12 py-24 md:grid-cols-2">
            {locales.map((code) => (
              <section
                key={code}
                lang={code}
                className="flex flex-col items-start gap-4"
              >
                <h1 className="text-title">{messages[code].error.title}</h1>
                <p>{messages[code].error.description}</p>
                <Button onClick={() => retry()} className="mt-2">
                  {messages[code].error.retry}
                </Button>
              </section>
            ))}
          </Container>
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { locales } from "@/i18n/config";
import { en } from "@/messages/en";
import { vi } from "@/messages/vi";
import { fontVariables } from "./fonts";
import "./globals.css";

// Unmatched URLs have no locale to read, so this page shows both languages.
const messages = { en, vi };

export const metadata: Metadata = {
  title: `404 — ${en.notFound.title} / ${vi.notFound.title}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 items-center">
          <Container className="grid gap-12 py-24 md:grid-cols-2">
            {locales.map((code) => (
              <section
                key={code}
                lang={code}
                className="flex flex-col items-start gap-4"
              >
                <h1 className="text-title">{messages[code].notFound.title}</h1>
                <p>{messages[code].notFound.description}</p>
                <ButtonLink
                  href={`/${code}`}
                  variant="secondary"
                  className="mt-2"
                >
                  {messages[code].notFound.backHome}
                </ButtonLink>
              </section>
            ))}
          </Container>
        </main>
      </body>
    </html>
  );
}

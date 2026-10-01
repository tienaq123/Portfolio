import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { en } from "@/messages/en";
import { vi } from "@/messages/vi";
import { inter } from "./fonts";
import "./globals.css";

// Unmatched URLs have no locale to read, so this page shows both languages.
const messages = { en, vi };

export const metadata: Metadata = {
  title: `404 — ${en.notFound.title} / ${vi.notFound.title}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-neutral-900">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-24">
          {locales.map((code) => (
            <section key={code} lang={code} className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {messages[code].notFound.title}
              </h1>
              <p className="text-neutral-700">
                {messages[code].notFound.description}
              </p>
              <Link
                href={`/${code}`}
                className="text-sm underline underline-offset-4"
              >
                {messages[code].notFound.backHome}
              </Link>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { UmamiScript } from "@/components/analytics/umami-script";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionScript } from "@/components/ui/motion/motion-script";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { chatAvailable } from "@/lib/ai/availability";
import { getSiteProfile } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Defaults for pages without their own metadata (e.g. not-found). Pages set
// canonical + hreflang themselves: an inherited canonical would be wrong.
export async function generateMetadata(): Promise<Metadata> {
  const [t, profile] = await Promise.all([
    getDictionary(),
    getLocale().then(getSiteProfile),
  ]);
  return {
    metadataBase: new URL(siteUrl),
    title: t.metadata.title,
    description: t.metadata.description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    openGraph: { type: "website", siteName: profile.name },
    twitter: { card: "summary_large_image" },
  };
}

// Every page renders its own <main id="main"> for the skip link.
export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const profile = await getSiteProfile(locale);

  return (
    // suppressHydrationWarning: the motion script sets data-motion first.
    <html
      lang={locale}
      className={`${fontVariables} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <MotionScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-raised"
        >
          {t.a11y.skipToContent}
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        {/* Hidden until the assistant can answer (keys set, then redeploy). */}
        {chatAvailable() && (
          <ChatLauncher
            locale={locale}
            email={profile.links.email}
            strings={t.chat}
          />
        )}
        <UmamiScript />
      </body>
    </html>
  );
}

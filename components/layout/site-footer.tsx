import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { siteName } from "@/lib/site";
import { getNavLinks } from "./nav-items";

// Bottom bar only. The dark "Let's build…" contact band above it is the
// homepage Contact section (M2) and shares the same night background.
export async function SiteFooter() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <footer className="border-t border-white/10 bg-night text-night-muted">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-night-ink">{siteName}</p>
          <p className="text-sm">{t.footer.role}</p>
        </div>

        <div className="flex items-center justify-between gap-8">
          <nav aria-label={t.footer.nav}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {getNavLinks(locale, t).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-night-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#top"
            aria-label={t.footer.backToTop}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-night-ink transition-colors hover:bg-white/10"
          >
            <ArrowUp aria-hidden="true" className="size-5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}

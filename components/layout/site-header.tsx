import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { siteName } from "@/lib/site";
import { HeaderFrame } from "./header-frame";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { getNavLinks } from "./nav-items";

export async function SiteHeader() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const links = getNavLinks(locale, t);
  const cta = { href: `/${locale}#contact`, label: t.nav.cta };

  return (
    <HeaderFrame>
      {/* Desktop nav starts at lg: Vietnamese labels overflow the row at md. */}
      <Container className="flex h-16 items-center gap-8 lg:h-18">
        <Link
          href={`/${locale}`}
          className="mr-auto text-lg font-bold tracking-tight text-ink"
        >
          {siteName}
        </Link>

        <nav aria-label={t.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.9375rem] font-medium text-body transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <LanguageSwitcher locale={locale} label={t.languageSwitcher.label} />
          {/* Wrapper owns visibility: ButtonLink's own inline-flex would override `hidden`. */}
          <div className="hidden lg:block">
            <ButtonLink href={cta.href}>
              {cta.label}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
          <MobileMenu
            links={links}
            cta={cta}
            labels={{
              open: t.nav.openMenu,
              close: t.nav.closeMenu,
              nav: t.nav.primary,
            }}
          />
        </div>
      </Container>
    </HeaderFrame>
  );
}

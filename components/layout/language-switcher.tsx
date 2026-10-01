"use client";

import type { MouseEvent } from "react";
import {
  LOCALE_COOKIE,
  localeNames,
  locales,
  type Locale,
} from "@/i18n/config";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Remembered so the proxy sends `/` to this locale next time. */
function rememberLocale(code: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}

/** Same page in another locale: swaps the leading /<locale> segment. */
function localizedUrl(target: Locale) {
  const { pathname, search, hash } = window.location;
  return `/${target}${pathname.replace(/^\/[^/]+/, "")}${search}${hash}`;
}

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  className?: string;
};

/**
 * Links point at the other locale's homepage so they work without JS;
 * with JS the click keeps the current path and remembers the choice.
 */
export function LanguageSwitcher({
  locale,
  label,
  className,
}: LanguageSwitcherProps) {
  function select(event: MouseEvent<HTMLAnchorElement>, code: Locale) {
    event.preventDefault();
    rememberLocale(code);
    if (code === locale) return;
    track("language_switched", { from: locale, to: code });
    window.location.assign(localizedUrl(code));
  }

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center rounded-control bg-surface-muted p-1">
        {locales.map((code) => {
          const active = code === locale;
          return (
            <li key={code}>
              <a
                href={`/${code}`}
                hrefLang={code}
                lang={code}
                aria-current={active ? "true" : undefined}
                onClick={(event) => select(event, code)}
                className={cn(
                  "flex h-9 min-w-11 items-center justify-center rounded-lg px-2.5 font-mono text-xs font-medium uppercase transition-colors",
                  active
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink",
                )}
              >
                {/* Visible code stays in the name (WCAG 2.5.3 label in name). */}
                {code}
                <span className="sr-only">{` (${localeNames[code]})`}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

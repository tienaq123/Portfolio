import type { Locale } from "@/i18n/config";
import type { Messages } from "@/messages/en";

// Homepage section anchors. M2 gives the sections these ids.
const navItems = [
  { key: "work", hash: "work" },
  { key: "about", hash: "about" },
  { key: "skills", hash: "skills" },
  { key: "contact", hash: "contact" },
] as const satisfies ReadonlyArray<{
  key: keyof Messages["nav"];
  hash: string;
}>;

export type NavLink = { href: string; label: string };

/** Absolute links so they also work from case study pages. */
export function getNavLinks(locale: Locale, t: Messages): NavLink[] {
  return navItems.map((item) => ({
    href: `/${locale}#${item.hash}`,
    label: t.nav[item.key],
  }));
}

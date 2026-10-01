import Link from "next/link";
import { localeNames, locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// Placeholder until the real homepage lands in M2.
export default async function HomePage() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Bùi Hữu Tiến</h1>
      <p className="text-lg text-neutral-700">{t.home.headline}</p>
      <p className="text-sm text-neutral-500">{t.home.status}</p>

      <nav aria-label={t.languageSwitcher.label}>
        <ul className="flex gap-4 text-sm">
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={`/${code}`}
                hrefLang={code}
                aria-current={code === locale ? "page" : undefined}
                className="underline-offset-4 hover:underline aria-[current=page]:font-semibold"
              >
                {localeNames[code]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

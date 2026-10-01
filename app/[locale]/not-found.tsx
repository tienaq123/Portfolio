import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t.notFound.title}
      </h1>
      <p className="text-neutral-700">{t.notFound.description}</p>
      <Link
        href={`/${locale}`}
        className="text-sm underline underline-offset-4"
      >
        {t.notFound.backHome}
      </Link>
    </main>
  );
}

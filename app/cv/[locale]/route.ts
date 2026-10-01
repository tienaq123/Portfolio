import { hasLocale, locales } from "@/i18n/config";
import { getCvFile } from "@/lib/content";

// Stable CV URLs (/cv/en, /cv/vi) that outlive where the PDF is stored.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/cv/[locale]">,
) {
  const { locale } = await ctx.params;
  const file = hasLocale(locale) ? await getCvFile(locale) : null;

  if (!file) return new Response("Not found", { status: 404 });

  // Relative Location keeps the handler free of request data, so it prerenders.
  return new Response(null, { status: 307, headers: { Location: file } });
}

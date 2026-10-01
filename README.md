# Bùi Hữu Tiến — Portfolio

Bilingual (English / Vietnamese) engineering portfolio: who I am, the products I've built, and case studies that go into the architecture, technical decisions and trade-offs behind them.

**Live:** https://portfolio-plum-eight-59.vercel.app

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first design tokens in `app/globals.css`)
- **Zod** for content and env validation · `react-markdown` + `remark-gfm` for case study bodies
- **Playwright** + **axe-core** for smoke and accessibility tests · GitHub Actions CI · Vercel
- **Umami** for cookieless analytics (optional, production only)

## Architecture

```text
proxy.ts                    /  →  /en or /vi (NEXT_LOCALE cookie, then Accept-Language)
app/
  [locale]/                 root layout per locale; every page is prerendered
    page.tsx                homepage
    work/                   project list
    work/[slug]/            case study (+ opengraph-image)
    opengraph-image.tsx     OG image per locale
    error.tsx, not-found.tsx
  cv/[locale]/route.ts      stable CV URL → redirects to the current PDF
  global-not-found.tsx      bilingual 404 for URLs without a locale
  sitemap.ts, robots.ts
i18n/                       locale config, negotiation, dictionaries (next/root-params)
messages/                   UI strings — vi.ts is typed against en.ts
lib/content/                portfolio content + Zod schema + async getters
lib/seo/, lib/og/           metadata, JSON-LD, OG image rendering
lib/analytics/              typed Umami wrapper (no-op when disabled)
components/                 ui/ primitives, layout/, home/, projects/
tests/e2e/                  Playwright smoke + axe
```

Decisions worth knowing:

- **Locale is a root segment, not a prop.** `[locale]` is the root layout; server code reads it with `getLocale()` (built on `next/root-params`). Client Components get their strings as props.
- **Content is data, validated at build time.** Projects, experience and case studies live in `lib/content/data/` and are parsed with Zod on import, so a missing translation or malformed entry fails the build. Pages only use the async getters in `lib/content`, so the source can move to a database later without touching components.
- **Static by default.** Every locale × page is prerendered, including the OG images. Unknown case study slugs return a real HTTP 404.
- **SEO per locale.** Each page sets its canonical URL, `hreflang` alternates (with `x-default` → English), Open Graph and Twitter metadata; the homepage carries `Person` + `WebSite` JSON-LD. OG images load a subset of Plus Jakarta Sans explicitly, because the default font has no Vietnamese glyphs.
- **Privacy.** The downloadable CV is a web version (no phone number, city only). Analytics is cookieless and off unless a website ID is configured.

## Running locally

Requires Node.js 24 and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000 → redirects to /en or /vi
```

| Script | Purpose |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint (incl. React Compiler rules) |
| `pnpm typecheck` | Generate route types, then `tsc --noEmit` |
| `pnpm format` / `pnpm format:check` | Prettier with Tailwind class sorting |
| `pnpm test:e2e` | Playwright smoke + axe against a production server (run `pnpm build` first; once: `pnpm exec playwright install chromium`) |

CI runs lint, typecheck, format check, build and the Playwright suite on every pull request.

### Environment

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel Production | Canonical origin for metadata, sitemap and JSON-LD. Previews fall back to `VERCEL_URL`. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Vercel Production | Enables Umami. Empty = no analytics. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | optional | Defaults to Umami Cloud. |

## Roadmap

- **V1** — homepage, project list, four bilingual case studies, SEO, analytics, tests.
- Next — restrained motion, an AI assistant that answers questions about my work from a curated knowledge base, then a database and a small CMS for content.

## Content and fonts

The content (text, photos, case studies, CV) belongs to Bùi Hữu Tiến. Fonts in `assets/fonts` are subsets of Plus Jakarta Sans under the SIL Open Font License (`assets/fonts/OFL.txt`).

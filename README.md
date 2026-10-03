# Bùi Hữu Tiến — Portfolio

Bilingual (English / Vietnamese) engineering portfolio: who I am, the products I've built, and case studies that go into the architecture, technical decisions and trade-offs behind them.

**Live:** https://portfolio-plum-eight-59.vercel.app

## Stack

- **Next.js 16** (App Router, Cache Components, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first design tokens in `app/globals.css`)
- **Zod** for content and env validation · `react-markdown` + `remark-gfm` for case study bodies
- **Playwright** + **axe-core** for smoke and accessibility tests · GitHub Actions CI · Vercel
- **Umami** for cookieless analytics (optional, production only)
- **AI assistant:** Claude or any OpenAI-compatible model, switched by env (Anthropic and OpenAI SDKs), with tool-based retrieval, Upstash rate limiting, Supabase for 30-day question logs · Vitest for unit tests

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
lib/ai/, app/api/chat/      assistant: knowledge, prompt, Claude client, limits, storage
components/chat/            launcher (initial JS) + lazy chat panel
components/                 ui/ primitives, layout/, home/, projects/
tests/e2e/                  Playwright smoke + axe
```

Decisions worth knowing:

- **Locale is a root segment, not a prop.** `[locale]` is the root layout; server code reads it with `getLocale()` (built on `next/root-params`). Client Components get their strings as props.
- **Content is data, validated at build time.** Projects, experience and case studies live in `lib/content/data/` and are parsed with Zod on import, so a missing translation or malformed entry fails the build. Pages only use the async getters in `lib/content`, so the source can move to a database later without touching components.
- **Static by default.** Every locale × page is prerendered, including the OG images. Unknown case study slugs return a real HTTP 404.
- **SEO per locale.** Each page sets its canonical URL, `hreflang` alternates (with `x-default` → English), Open Graph and Twitter metadata; the homepage carries `Person` + `WebSite` JSON-LD. OG images load a subset of Plus Jakarta Sans explicitly, because the default font has no Vietnamese glyphs.
- **An assistant that cannot make things up about the owner.** The model gets a compact index of the published content and fetches details with a `get_details` tool; sources shown under each answer are the records it fetched. Only published records and `public_ai` knowledge exist on the server side, so the rule holds even if the prompt is bypassed. A leak guard stops the stream if the prompt's canary ever appears. The chat panel is a lazy chunk loaded on intent, and the API refuses to run in production without rate limiting.
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
| `pnpm test` | Vitest unit tests (`lib/**/*.test.ts`) |
| `node scripts/eval-chat.mts --base <url>` | Golden-set eval of the assistant against a running server with a real API key |
| `pnpm test:e2e` | Playwright smoke + axe against a production server (build first with `CHAT_MOCK=1 pnpm build` so the chat launcher exists; once: `pnpm exec playwright install chromium webkit`) |

CI runs lint, typecheck, format check, build and the Playwright suite on every pull request.

### Environment

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin for metadata, sitemap and JSON-LD. Without it, Vercel production uses the project's production domain and previews their deployment URL. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Vercel Production | Enables Umami. Empty = no analytics. |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | optional | Defaults to Umami Cloud. |
| `AI_PROVIDER` | server | `openai` (OpenAI Chat Completions: official or any compatible gateway) or `anthropic`. Optional when only one provider is configured. |
| `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL` | server | OpenAI-compatible provider. Base URL empty = official OpenAI; set it for a gateway. |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ANTHROPIC_BASE_URL` | server | Anthropic provider; base URL only for a compatible proxy. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | server | Rate limiting; required for the assistant in production. |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY` | server | Optional 30-day question log (`supabase/migrations`). |
| `CRON_SECRET` | server | Authorizes the daily keepalive cron (`vercel.json`). |
| `CHAT_MOCK=1` | tests | Canned answers without an API key; ignored in production. |

## Roadmap

- **V1** — homepage, project list, four bilingual case studies, SEO, analytics, tests.
- **V1.1** — restrained motion.
- **V1.5** (in progress) — the AI assistant.
- Next — a database and a small CMS for content.

## Content and fonts

The content (text, photos, case studies, CV) belongs to Bùi Hữu Tiến. Fonts in `assets/fonts` are subsets of Plus Jakarta Sans under the SIL Open Font License (`assets/fonts/OFL.txt`).

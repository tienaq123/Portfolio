# Bùi Hữu Tiến — Portfolio

Bilingual (EN / VI) engineering portfolio built with Next.js 16, TypeScript and Tailwind CSS v4.

> Work in progress. The full README (architecture, decisions) ships with V1.

## Development

Requires Node.js 24 and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000 → redirects to /en or /vi
```

| Script | Purpose |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Generate route types, then `tsc --noEmit` |
| `pnpm format` / `pnpm format:check` | Prettier (with Tailwind class sorting) |
| `pnpm build` | Production build |

## Project layout

```text
app/[locale]/     public routes (root layout per locale)
i18n/             locale config, Accept-Language negotiation, dictionaries
messages/         UI strings (en.ts, vi.ts)
lib/              env, content, AI and integrations
proxy.ts          locale redirects
```

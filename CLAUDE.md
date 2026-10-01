@AGENTS.md

# Project Instructions

## Product

This is Bùi Hữu Tiến's engineering portfolio, bilingual (English + Vietnamese).
The primary audience is technical recruiters, hiring managers and software engineers.

## How work is organized

- The execution plan lives in `docs/phases/` (local only — gitignored). `docs/phases/README.md` holds the status board, the decision log and the per-task prompt template. It overrides `PORTFOLIO_MASTER_PLAN.md` where they conflict.
- Work one phase at a time, one task ID (`M2-T3`…) per branch/PR. Do not pull work forward from later phases.
- After finishing a task, tick its checkbox in the phase file.

## Core principles

- Prefer simple production-ready architecture. Do not over-engineer.
- Do not add dependencies without a concrete need.
- Reuse existing components and patterns.
- Public pages must remain fast, static and accessible.
- Keep TypeScript strict. Do not use `any` unless unavoidable and documented.
- Validate external/user input with Zod.
- Never expose server secrets to client code (server env goes behind `import "server-only"`).

## Next.js 16 specifics

- This Next.js version differs from older training data: read `node_modules/next/dist/docs/` before using an API (see AGENTS.md).
- `cacheComponents: true` is enabled: cache with `"use cache"` + `cacheLife`/`cacheTag`; do not use `unstable_cache` or route segment configs.
- Request interception lives in `proxy.ts` (not `middleware.ts`).

## i18n

- Locales: `en` (default) and `vi`, prefixed URLs (`/en/...`, `/vi/...`). Config in `i18n/config.ts`.
- The locale comes from the `[locale]` root segment. Read it with `getLocale()` / `getDictionary()` from `i18n/dictionaries.ts` (built on `next/root-params`); do not prop-drill it through server components.
- UI strings live in `messages/en.ts` and `messages/vi.ts`; `vi` is typed as `Messages`, so a missing key fails typecheck.
- Portfolio content (projects, experience…) lives in `lib/content/`, never in components or messages.
- Never hardcode user-visible text in a component. Every visible string must exist in both languages.
- Client components receive the strings they need as props from a server parent.

## UI

- Clean premium developer/product aesthetic; strong typography and whitespace; restrained accent.
- Motion is restrained and respects `prefers-reduced-motion`.
- Mobile is first-class. Test layouts with the longest Vietnamese strings, not only English.

## Coding rules

- Prefer Server Components; use Client Components only for real interactivity.
- Keep components focused; keep domain/data logic out of presentation components.
- Avoid premature abstractions.
- Handle loading, empty and error states.

## Before changing code

1. Inspect relevant code first and identify existing conventions.
2. State a brief plan.
3. Avoid unrelated refactors.

## Before declaring a task complete

Run:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm format:check`
- `pnpm build` (always for routing, config or architectural changes)

Then review the diff for regressions, duplicated logic, accessibility issues, leaked secrets and unnecessary complexity.

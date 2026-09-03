# Amana Partners — Agent Notes

Marketing site for Amana Partners LLC, a cross-border investment advisory firm
serving GCC principals investing in Spain.

## Stack

- TanStack Start (SSR) + TanStack Router file-based routes in `src/routes`
- React 19, TypeScript strict
- Tailwind CSS v4 (config lives in `src/styles.css` via `@theme`, not a JS config)
- Bun as runtime and package manager — never mix in npm/yarn/pnpm

## Commands

```
bun install
bun run dev        # build-assets, then vite dev on :8080
bun run build      # build-assets, then nitro build (vercel preset, the deploy target)
bun run assets     # just the build-time asset pipeline (see below)
bun run lint
bun run typecheck
bun test           # unit tests (src/**/*.test.ts, bun:test)
bun run format
```

### Build-time assets — `scripts/build-assets.mjs`

Runs before `dev` and `build`. Best-effort; a failure warns and the build
continues. It produces:

- `public/og-image.jpg` — the social card (also `node scripts/generate-og-image.mjs` standalone).
- `public/img/<photo>-{640,960,1280}.webp` — responsive variants for `<Photo>`.
- `public/favicon.ico` — PNG-in-ICO wrapper of `favicon-32.png`, for old clients.
- `src/generated/route-meta.ts` — per-route last-commit dates for the sitemap
  `<lastmod>`. Committed like `routeTree.gen.ts` so a bare `tsc` works.

`public/img/` and `public/favicon.ico` are git-ignored (regenerated each build).

## Deployment

Vercel, on `https://www.amanapartnersllc.com`. `src/lib/site.ts` is the single
source of truth for the domain and the public mailbox — SEO tags, the sitemap
and the JSON-LD all read from it. `public/robots.txt` is the one place the
domain is repeated by hand.

Environment variables live in Vercel → Settings → Environment Variables; see
`.env.example` for the full list. `SMTP_PASSWORD` is required or the contact
form's endpoint returns 503.

## Conventions

- Brand tokens (`--navy`, `--gold`, `--ivory`, …) are defined in `src/styles.css`.
  Use the Tailwind utilities they generate (`text-navy`, `bg-gold`) rather than
  hardcoding hex values.
- `src/routeTree.gen.ts` is generated — never edit it by hand.
- Motion must respect `prefers-reduced-motion`; the `.reveal` / `.tilt-3d`
  helpers in `src/styles.css` already do.
- Every route's `head()` must go through `pageHead()` in `src/lib/site.ts`. It
  owns the canonical link, `og:url` and the per-page Twitter tags, none of
  which can live on `__root.tsx` without duplicating or flattening them.
- Anything under `src/server/` is server-only — `importProtection` in
  `vite.config.ts` fails the build if a client module imports it. Secrets and
  the SMTP client belong there, never in a route component.
- Locale (`en` / `ar`) is resolved on the server from the `amana-locale`
  cookie in the root route loader (`src/lib/get-initial-locale.ts`), so the
  first paint matches the visitor's language. `LanguageProvider` seeds from it
  and owns runtime switching. Crawlers (no cookie) get English, which is what
  the canonical metadata is written in.
- Photos go through `<Photo src={importedWebp} base="<stem>" sizes="…" />`
  from `Primitives.tsx` — never a bare `<img>` for the hero photos.
- Dependencies are deliberately minimal (no shadcn/ui, no react-query). Prefer
  a hand-rolled component over pulling a library back in.
- `bun test` covers the contact-form guards (`src/lib/contact-guard.ts`).
  `.github/workflows/ci.yml` runs typecheck + lint + test + build on every PR.

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
bun run dev        # vite dev on :8080
bun run build      # nitro build, vercel preset (the deployment target)
bun run lint
bun run format
```

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

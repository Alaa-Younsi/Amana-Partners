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
bun run build      # nitro build, cloudflare-module preset
bun run lint
bun run format
```

## Conventions

- Brand tokens (`--navy`, `--gold`, `--ivory`, …) are defined in `src/styles.css`.
  Use the Tailwind utilities they generate (`text-navy`, `bg-gold`) rather than
  hardcoding hex values.
- `src/routeTree.gen.ts` is generated — never edit it by hand.
- Motion must respect `prefers-reduced-motion`; the `.reveal` / `.tilt-3d`
  helpers in `src/styles.css` already do.

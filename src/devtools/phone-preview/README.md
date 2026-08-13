# Phone preview — a recording rig (temporary; delete after filming)

Puts the live site inside a phone frame on the desktop screen, at the device's
real CSS viewport size, so the mobile experience can be screen-recorded without
filming an actual phone (no moiré, no hand shake, no crop problems).

**This is not a product feature. Delete it before the client sees the site** —
a phone chip in the header of a finished site is exactly the sort of leftover
that makes it look unfinished.

## Using it

Click the phone chip in the header (desktop nav, left of the EN/عربي toggle).
Then:

- **Device buttons** — iPhone 15 Pro (393×852), iPhone SE (375×667),
  Pixel 8 Pro (412×915). Add devices in `DEVICES` in `state.ts`: CSS viewport
  size, corner radius, notch style (`island` / `punch` / `none`).
- **Rotate** — landscape.
- **Fullscreen** — the phone is sized to fill whatever box it is given, so this
  is simply the biggest and sharpest it gets: worth ~15 % on a 1080p screen,
  and it keeps the tab strip and address bar out of a window capture. Esc
  leaves fullscreen without also leaving the preview.
- **✕ / Esc** — back to the desktop site.

The controls fade out after ~2.5 idle seconds and return on the first mouse
move, so a recording longer than that catches only the phone. The mode is kept
in `sessionStorage`, so reloading the page — which is how you re-trigger the
scroll-reveal / hero animations — keeps you in the preview.

The frame opens on whatever route the desktop was showing, so toggling from
`/services` previews `/services`. Language, navigation and everything else work
normally inside the glass.

## Record with `bun run dev`

Not `vite preview`, and not against the deployed site — see the security-header
note below. The dev server serves the same pages; nothing about the site's
appearance differs.

## Removing it (before handoff)

Four steps, no side effects:

1. Delete `src/devtools/phone-preview/`. If that leaves `src/devtools/` empty,
   delete it too.
2. `src/routes/__root.tsx` — remove the import and unwrap `<PhonePreview>` in
   `RootComponent` (re-indent the providers).
3. `src/components/SiteLayout.tsx` — remove the import and the
   `<PhonePreviewButton light={lightHeader} />` line in `SiteHeader`.
4. `src/server.ts` — delete the `PHONE_PREVIEW_DEV` const and inline the
   non-dev branch of both expressions that use it, so they read
   `"frame-ancestors 'none'"` and `"x-frame-options": "DENY"` again.

```
grep -rn "PHONE PREVIEW" src/
```

finds all of them; it must come back empty. Then `bun run typecheck &&
bun run lint` to confirm nothing else referenced it — nothing else does: nothing
outside this folder imports from it, and it adds **no dependency**
(`lucide-react` was already installed; the store is a hand-rolled
`useSyncExternalStore`, deliberately, so `package.json` never changed).

## Why an iframe and not a scaled `<div>`

Scaling a `<div>` down to 393px gets you the *desktop* layout drawn small:
`@media (max-width: 1023px)` resolves against the window, `100vh` resolves
against the window, and `position: fixed` — which is what `SiteHeader` is —
escapes to the window. An iframe **is** a window, so every one of those answers
the way it would on the device. What you record is the mobile site, not a small
picture of the desktop one.

## The traps that shaped it (don't "simplify" these away)

- **This site refuses to be framed, including by itself.** `src/server.ts` sends
  `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`; with those in force
  the iframe loads as an opaque blocked page and the phone shows nothing but
  black. The rig relaxes both to same-origin **behind `import.meta.env.DEV`**,
  which Vite replaces with a literal `false` when building for production — the
  deployed bundle was checked and contains only `frame-ancestors 'none'` and
  `"DENY"`, so a forgotten rig cannot weaken the live site's clickjacking
  defence. That is also why filming happens on `bun run dev`.
- **Tailwind v4 computes colours as `oklab`, not `rgb`.** The scrolled header's
  `bg-background/80` reports as `oklab(0.979 0.0006 0.0057 / 0.8)`. A regex that
  assumed `rgb()` read those as 0–255 channels, turned near-white into
  near-black, and tinted the status bar charcoal over every scrolled page. The
  fix is to let the browser do it: the layer stack is painted onto a 1×1 canvas
  and the pixel read back, which parses and composites every colour syntax the
  page can emit, for less code than hand-rolling oklab.
- **`elementsFromPoint` (plural), painted back-to-front — not an ancestor walk.**
  `SiteHeader` is `fixed` and transparent before scroll, so the navy `PageHero`
  underneath it is its *sibling*: climbing parents goes straight past it to
  `body` and reports ivory over navy. Each strip samples its own edge, too — the
  status bar against the top of the viewport, the home indicator against the
  bottom, which on a long page are routinely different colours.
- **The frame's scrollbar is hidden by a style tag injected into the frame.**
  Desktop Chrome draws a classic scrollbar inside an iframe on Windows; it lands
  in the recording, and it steals width the phone should have. A parent cannot
  style a child document's scrollbars, so the rig appends the rule inside — and
  re-appends it after a real document load.

- **`window.name`, not a `?phone=1` query flag.** The router drops the query the
  moment you click a link inside the frame, so the inner app drew a second phone
  inside the first one as soon as anyone navigated. `window.name` is set on the
  element before its document exists and survives navigation and reload.
- **`sessionStorage` is shared with the iframe** (same origin, same tab), so the
  frame also reads `on: true`. The `inFrame` check in `PhonePreview` has to come
  *before* the `on` check, or the frame draws its own phone.
- **SSR: state comes through `useSyncExternalStore`, not `useEffect`.** This app
  server-renders, so the server has no `sessionStorage` and no `window.name`.
  `getServerSnapshot` returns "off / not in a frame", hydration matches the HTML,
  and React re-renders once afterwards with the real values. A plain
  `useState(readStored())` would be a hydration mismatch.
- **Two nested boxes for the scale transform.** A transform scales what is
  *painted* and leaves the layout box its original size, so centring a scaled
  phone centres the box it *used to* occupy — the phone hung off the bottom of
  the screen. The outer div takes the scaled dimensions; the inner one scales
  from `top left`.
- **Fit measured off the stage with a `ResizeObserver`,** not computed from
  `window.innerHeight` — the window is not the stage in fullscreen, and not when
  browser chrome changes height. A guessed margin cost the home indicator and
  the lower bezel in the shot.
- **The status bar is a reserved strip, not an overlay.** Floated over the glass,
  the Dynamic Island pill sits squarely on the header — the first thing in the
  video would be a control with a black lozenge through it. Reserving it also
  gives the page the shorter viewport a phone really has.
- **The strip is tinted from the frame, by hit-test, not from `body`.** This
  site's page top is ivory on `/`, navy on every interior `PageHero`, and a
  translucent ivory header once scrolled — three different answers, so
  `useFrameChrome` reads the element one pixel below the top edge, composites it
  over the body colour, and re-reads on the frame's scroll. The clock's ink is
  derived from that colour's luminance rather than read off the element, because
  the node under the strip is often a decorative overlay whose own `color` is
  meaningless.
- **Controls in a rail down the side, not a bar along the bottom.** The phone is
  as tall as the window allows, so there is no empty height under it — but
  hundreds of pixels of unused width either side.
- **The scrollbar gutter is reclaimed while the rig is up.** A `fixed inset-0`
  element does not cover a reserved gutter, which leaves a strip of ivory page
  background down the edge of the black backdrop, in shot.
- **`allow="autoplay; fullscreen"` on the iframe** — without it a muted
  autoplaying video records as a still poster.

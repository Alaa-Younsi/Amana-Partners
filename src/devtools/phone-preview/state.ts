import { useSyncExternalStore } from "react";

/**
 * PHONE PREVIEW — TEMPORARY recording rig. See ./README.md to delete it.
 *
 * The whole feature lives in this folder plus two insertion points
 * (src/routes/__root.tsx and src/components/SiteLayout.tsx), both marked
 * `PHONE PREVIEW`.
 *
 * The original rig used zustand; this project doesn't have it, so the store is
 * a ~30-line `useSyncExternalStore` instead. That is deliberate: a recording
 * tool that gets deleted next week must not add a dependency to package.json.
 */

/** Shown as the iframe's accessible title. */
export const FRAME_TITLE = "Amana Partners — mobile preview";

/**
 * The `name` the outer window gives the iframe.
 *
 * How the app knows which side of the glass it is on. The alternative was a
 * `?phone=1` query flag, which the router drops the moment you click a link
 * inside the frame — so the inner app would draw a second phone inside the
 * first one as soon as anyone navigated. `window.name` is set on the element
 * before its document exists and survives both navigation and reload.
 */
export const FRAME_NAME = "phone-preview-frame";

/**
 * CSS viewport sizes, as the real devices report them. `short` is what the
 * side rail shows — the full name is the button's tooltip.
 */
export const DEVICES = {
  "iphone-15-pro": {
    label: "iPhone 15 Pro",
    short: "15 Pro",
    width: 393,
    height: 852,
    radius: 55,
    notch: "island",
  },
  "iphone-se": {
    label: "iPhone SE",
    short: "SE",
    width: 375,
    height: 667,
    radius: 42,
    notch: "none",
  },
  "pixel-8-pro": {
    label: "Pixel 8 Pro",
    short: "Pixel 8",
    width: 412,
    height: 915,
    radius: 46,
    notch: "punch",
  },
} as const;

export type DeviceKey = keyof typeof DEVICES;

interface PhonePreviewState {
  on: boolean;
  device: DeviceKey;
}

const STORAGE_KEY = "phone-preview";
const DEFAULT_STATE: PhonePreviewState = { on: false, device: "iphone-15-pro" };

/**
 * sessionStorage, not component state: recording an intro/reveal animation
 * means reloading the page over and over, and a preview that fell back to the
 * desktop layout on every reload would be useless for exactly the shot it
 * exists to get.
 */
function readStored(): PhonePreviewState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { on?: unknown; device?: unknown };
      const device =
        typeof parsed.device === "string" && parsed.device in DEVICES
          ? (parsed.device as DeviceKey)
          : DEFAULT_STATE.device;
      return { on: parsed.on === true, device };
    }
  } catch {
    /* private mode, or a shape from an older build — start closed */
  }
  return DEFAULT_STATE;
}

function persist(next: PhonePreviewState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* nothing to do — the preview just won't survive a reload */
  }
}

/*
  Read lazily rather than at module scope: this module is imported during SSR
  too, where there is no sessionStorage. Null means "not read yet".
*/
let state: PhonePreviewState | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/*
  Must return a STABLE reference between changes — useSyncExternalStore calls
  it on every render and re-renders forever if the identity keeps changing.
*/
function getSnapshot(): PhonePreviewState {
  if (state === null) state = readStored();
  return state;
}

/*
  Hydration reads this, so the client's first render matches the server's HTML;
  React then compares it against getSnapshot() and re-renders once if the tab
  was already in preview mode. That single post-hydration swap is the whole
  reason this is a useSyncExternalStore and not a useEffect.
*/
function getServerSnapshot(): PhonePreviewState {
  return DEFAULT_STATE;
}

function setState(next: PhonePreviewState): void {
  state = next;
  persist(next);
  for (const listener of listeners) listener();
}

export function usePhonePreview(): PhonePreviewState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const phonePreview = {
  toggle: () => setState({ ...getSnapshot(), on: !getSnapshot().on }),
  close: () => setState({ ...getSnapshot(), on: false }),
  setDevice: (device: DeviceKey) => setState({ ...getSnapshot(), device }),
};

/*
  True only inside the previewed iframe: draw the site, not the rig.

  Also a hook rather than a module constant, and for the same hydration reason:
  the frame's own SSR pass has no `window`, so the server says "not in a frame"
  and the client corrects it after hydrating instead of mismatching.
*/
const subscribeToNothing = () => () => {};

export function useInPhoneFrame(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.name === FRAME_NAME,
    () => false,
  );
}

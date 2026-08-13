import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Maximize2, RotateCw, X } from "lucide-react";

import {
  DEVICES,
  FRAME_NAME,
  FRAME_TITLE,
  phonePreview,
  useInPhoneFrame,
  usePhonePreview,
} from "./state";
import type { DeviceKey } from "./state";

/**
 * PHONE PREVIEW — TEMPORARY recording rig. See ./README.md to delete it.
 *
 * Puts the real site inside a phone on a desktop screen, at the real device's
 * real CSS size, so it can be screen-recorded without a phone in shot.
 *
 * It is an <iframe>, and that is the entire trick. Scaling a <div> down to
 * 393px would have got the desktop layout drawn small: `@media (max-width:
 * 1023px)` resolves against the window, `100vh` resolves against the window,
 * and `position: fixed` (this site's header) escapes to the window. An iframe
 * IS a window — so every one of those answers the way it would on the device,
 * and what gets recorded is the mobile site rather than an impression of it.
 *
 * The outer app is unmounted while the preview is up, not hidden: two live
 * copies of a page mean two of everything expensive it runs (scroll listeners,
 * the world map, reveal observers) competing with the copy being filmed.
 */
export function PhonePreview({ children }: { children: ReactNode }) {
  const { on } = usePhonePreview();
  const inFrame = useInPhoneFrame();

  // inside the glass we are simply the site — never nest a second rig.
  // This check must come first: sessionStorage is shared with the frame, so
  // the frame also reads `on: true` and would otherwise draw its own phone.
  if (inFrame) return <>{children}</>;
  if (!on) return <>{children}</>;
  return <PhoneStage />;
}

function PhoneStage() {
  const { device } = usePhonePreview();
  const spec = DEVICES[device];

  const [landscape, setLandscape] = useState(false);
  const width = landscape ? spec.height : spec.width;
  const height = landscape ? spec.width : spec.height;

  /*
    The iframe opens on whatever page the desktop was showing, so toggling from
    /services previews /services. Captured once, on mount: making it follow the
    outer location afterwards would reload the frame — and losing the shot to a
    reload is worse than the frame being one route stale, which it cannot be,
    because the outer app is not mounted to navigate.
  */
  const [initialPath] = useState(() => window.location.pathname + window.location.search);

  /*
    Fit the phone to the window without touching its viewport: the transform
    scales the rendered pixels, and the iframe's own CSS width stays 393.

    Measured off the stage element with a ResizeObserver rather than computed
    from `window.innerHeight`, because the stage is the box the phone actually
    has to fit inside and the window is only sometimes the same thing — it is
    not in fullscreen, and it is not once the browser's own chrome changes
    height. A guessed margin got this wrong and the phone ran off the bottom of
    the screen, losing the home indicator and the lower bezel from the shot.
  */
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const BEZEL = 13;
  /** the lane the control rail lives in, kept clear of the phone — see fit() */
  const RAIL = 92;
  const bodyW = width + BEZEL * 2;
  const bodyH = height + BEZEL * 2;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      /*
        Barely any vertical margin: this is a recording, and every pixel not
        spent on the phone is a pixel of empty backdrop to crop out later.

        Horizontally, the controls' lane is reserved on BOTH sides, because the
        phone is centred and only a symmetric reserve keeps it clear of a rail
        pinned to one edge. It is free in practice — a phone is ~430 px wide in
        a window that is thousands, so the height term wins every time — and it
        means the rail can never end up over the screen even in a narrow window.
      */
      const room = 24;
      const next = Math.min(
        (stage.clientHeight - room) / bodyH,
        (stage.clientWidth - room - RAIL * 2) / bodyW,
        2,
      );
      if (next > 0) setScale(next);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [bodyW, bodyH]);

  /*
    The biggest the phone can get on a given monitor is the browser without its
    chrome — worth ~15% on a 1080p screen, and it also removes the tab strip
    and the address bar from anything captured with a window recorder.
  */
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen().catch(() => {});
  }, []);

  /*
    How much of the screen the OS keeps for itself. Landscape gives it all
    back except the home indicator, which is what a phone actually does.
  */
  const statusBar = landscape ? 0 : spec.notch === "island" ? 54 : spec.notch === "punch" ? 40 : 22;
  const homeBar = spec.notch === "none" ? 0 : landscape ? 16 : 24;

  const frameRef = useRef<HTMLIFrameElement>(null);
  const chrome = useFrameChrome(frameRef, width);
  useHiddenFrameScrollbars(frameRef);

  /*
    The stage is the only thing mounted, so the outer document has nothing to
    scroll — but a reserved scrollbar gutter is not covered by a `fixed inset-0`
    element, which leaves a strip of the site's ivory page background down the
    edge of an otherwise black backdrop, in shot. Reclaim it while the preview
    is up, and put it back on the way out.
  */
  useEffect(() => {
    const root = document.documentElement;
    const previous = [root.style.overflow, root.style.scrollbarGutter] as const;
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "auto";
    return () => {
      root.style.overflow = previous[0];
      root.style.scrollbarGutter = previous[1];
    };
  }, []);

  // Esc leaves — the exit chip is the obvious way out, this is the one that
  // works when the chip has faded itself out to stay off camera.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // in fullscreen, Escape belongs to the browser — leaving fullscreen and
      // leaving the preview in one keypress is one press too many
      if (event.key === "Escape" && !document.fullscreenElement) phonePreview.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const controls = useIdleHidden();

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(120% 90% at 50% 0%, #16203a 0%, #0c1122 45%, #05070d 100%)",
      }}
    >
      {/*
        Two boxes, and they have to be two. A transform scales what is PAINTED
        and leaves the layout box its original size, so centring a scaled phone
        centres the box it used to occupy — which is how a phone that had been
        scaled to fit still hung off the bottom of the screen. The outer div is
        given the scaled dimensions so the layout box and the visible phone are
        the same rectangle, and `top left` makes the inner one grow from that
        box's corner instead of its middle.
      */}
      <div style={{ width: bodyW * scale, height: bodyH * scale }}>
        <div
          className="relative"
          style={{
            width: bodyW,
            height: bodyH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            padding: BEZEL,
            borderRadius: spec.radius + BEZEL,
            // brushed-titanium rail: a flat black rectangle reads as a mockup,
            // the two-stop gradient plus an inner hairline reads as a phone
            background:
              "linear-gradient(150deg, #55504b 0%, #1b1917 26%, #100f0e 62%, #45403b 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 1px rgba(255,255,255,0.16) inset, 0 40px 80px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.6)",
          }}
        >
          {/* volume + wake, on the rail rather than drawn on the glass */}
          <SideButton side="start" top={112} length={26} />
          <SideButton side="start" top={158} length={48} />
          <SideButton side="start" top={218} length={48} />
          <SideButton side="end" top={176} length={74} />

          <div
            className="relative overflow-hidden bg-black"
            style={{ width, height, borderRadius: spec.radius }}
          >
            {/*
              Safe areas, exactly as iOS gives them to a full-screen web app —
              and the reason they are here rather than an island floating over
              the glass. Overlaid, the pill sat squarely on top of the header's
              language chip: the first thing in the video was a control with a
              black lozenge through it. Reserving the strip instead puts the
              status bar where a phone puts it, gives the page the shorter
              viewport it would really get, and leaves every pixel of the site
              visible. `chrome` paints them in the site's OWN colours, read
              live out of the frame — see useFrameChrome.
            */}
            {statusBar > 0 && (
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-7 text-[13px] font-semibold"
                style={{
                  height: statusBar,
                  background: chrome.top.background,
                  color: chrome.top.color,
                }}
              >
                <span>9:41</span>
                <span className="flex items-center gap-1.5 opacity-90">
                  <Bars />
                  <Battery />
                </span>
              </div>
            )}

            <iframe
              // the frame's identity, read back by state.ts inside the app
              name={FRAME_NAME}
              ref={frameRef}
              title={FRAME_TITLE}
              src={initialPath}
              width={width}
              height={height - statusBar - homeBar}
              // a hero video that autoplays muted needs this, or the frame
              // records a poster where the site shows a video
              allow="autoplay; fullscreen"
              style={{
                width,
                height: height - statusBar - homeBar,
                marginTop: statusBar,
                border: 0,
                display: "block",
              }}
            />

            {homeBar > 0 && (
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pb-[7px]"
                style={{ height: homeBar, background: chrome.bottom.background }}
              >
                <span
                  className="h-[5px] w-[36%] rounded-full"
                  style={{ background: chrome.bottom.color, opacity: 0.55 }}
                />
              </div>
            )}

            {!landscape && spec.notch === "island" && (
              <span
                aria-hidden
                className="pointer-events-none absolute start-1/2 top-[11px] z-20 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black"
              />
            )}
            {!landscape && spec.notch === "punch" && (
              <span
                aria-hidden
                className="pointer-events-none absolute start-1/2 top-[13px] z-20 h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-black"
              />
            )}

            {/* the sheen a real screen has under room light — kept faint so it
                does not sit on top of the thing being filmed */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30"
              style={{
                borderRadius: spec.radius,
                background:
                  "linear-gradient(128deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 34%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.07) inset",
              }}
            />
          </div>
        </div>
      </div>

      {/*
        The rig's own controls, which must not end up in the video.

        A rail down the side rather than a bar across the bottom, because the
        bar sat ON the phone: the stage is centred, the phone is as tall as the
        window allows, and there is simply no empty height under it to put
        anything in — but there are hundreds of pixels of unused width either
        side. Off the screen entirely beats translucent-over-the-screen, since
        the point of the preview is to see the whole phone.

        They still fade out after a few idle seconds and return on the first
        mouse move, so a recording longer than that catches only the phone.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 transition-opacity duration-500"
        style={{ opacity: controls ? 1 : 0 }}
      >
        <div className="pointer-events-auto flex w-[72px] flex-col items-stretch gap-0.5 rounded-2xl border border-white/10 bg-black/70 p-1.5 text-[11px] text-white/70 backdrop-blur">
          {(Object.keys(DEVICES) as DeviceKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => phonePreview.setDevice(key)}
              title={DEVICES[key].label}
              className={`cursor-pointer rounded-lg px-1 py-1.5 text-center leading-tight transition-colors ${
                key === device ? "bg-white/15 text-white" : "hover:text-white"
              }`}
            >
              {DEVICES[key].short}
            </button>
          ))}
          <span className="mx-1 my-1 h-px bg-white/15" />
          <div className="flex justify-around">
            <button
              type="button"
              onClick={() => setLandscape((v) => !v)}
              title="Rotate"
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCw size={13} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Fullscreen — the biggest the phone gets"
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Maximize2 size={13} />
            </button>
            <button
              type="button"
              onClick={phonePreview.close}
              title="Exit phone preview (Esc)"
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Inside-the-glass fixes                                                     */
/* ------------------------------------------------------------------------ */

const NO_SCROLLBARS_ID = "phone-preview-no-scrollbars";
const NO_SCROLLBARS_CSS = `
  html { scrollbar-width: none !important; scrollbar-gutter: auto !important; }
  body { scrollbar-width: none !important; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
`;

/**
 * Phones have no scrollbar; a desktop Chrome iframe on Windows draws a classic
 * one down the right edge of the "screen", and it lands in the recording.
 *
 * Injected into the frame's own document (same origin, so this is just a style
 * tag) rather than styled from out here — a parent cannot reach a child
 * document's scrollbars. It also hands the page the full 393 px a real phone
 * has, instead of 393 minus the gutter.
 */
function useHiddenFrameScrollbars(frameRef: React.RefObject<HTMLIFrameElement | null>): void {
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const inject = () => {
      const doc = frame.contentDocument;
      // survives client-side navigation (same document); re-runs after a real
      // document load, which is when the tag is gone and has to go back
      if (!doc || doc.getElementById(NO_SCROLLBARS_ID)) return;
      const style = doc.createElement("style");
      style.id = NO_SCROLLBARS_ID;
      style.textContent = NO_SCROLLBARS_CSS;
      doc.head?.appendChild(style);
    };

    frame.addEventListener("load", inject);
    inject();
    return () => frame.removeEventListener("load", inject);
  }, [frameRef]);
}

/* ------------------------------------------------------------------------ */
/* Status-bar / home-indicator tint                                          */
/* ------------------------------------------------------------------------ */

interface Chrome {
  background: string;
  color: string;
}

interface FrameChrome {
  top: Chrome;
  bottom: Chrome;
}

const IVORY = "#faf8f4";
const NAVY_DEEP = "#0d1830";
/** Pre-load fallback and compositing backstop — this site's --background. */
const FALLBACK_RGB: [number, number, number] = [250, 248, 244];
const FALLBACK_CHROME: Chrome = { background: IVORY, color: NAVY_DEEP };
const FALLBACK_FRAME_CHROME: FrameChrome = { top: FALLBACK_CHROME, bottom: FALLBACK_CHROME };

function sameChrome(a: Chrome, b: Chrome): boolean {
  return a.background === b.background && a.color === b.color;
}

/** Flatten whatever paints at (x, y) in the frame into a strip colour + ink. */
function sample(painter: Painter, doc: Document, x: number, y: number): Chrome | null {
  const rgb = painter(
    doc.elementsFromPoint(x, y).map((el) => getComputedStyle(el).backgroundColor),
  );
  if (!rgb) return null;
  return {
    background: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
    // Derived from the flattened colour rather than read off the element: the
    // node under a strip is often a decorative overlay whose own `color` is
    // meaningless, and an unreadable clock is worse than a slightly off-brand one.
    color: luminance(rgb) < 0.45 ? IVORY : NAVY_DEEP,
  };
}

/**
 * The safe-area strips are painted in the site's own colours, read out of the
 * frame rather than hardcoded — a status bar still glowing ivory above the
 * navy PageHero of /services is the one thing that would give away that this is
 * not a phone.
 *
 * Same origin, so the frame's document is simply readable. The colour is taken
 * from whatever element sits under the status bar (hit-tested one pixel down
 * the top edge) rather than from `body`, because on this site the top of the
 * page is an ivory hero on `/`, a navy plate on every interior page, and the
 * translucent header once it goes opaque on scroll — three different answers.
 * Re-read on the frame's scroll so the strip tracks the header, and on `load`
 * so it survives an in-frame navigation.
 */
function useFrameChrome(
  frameRef: React.RefObject<HTMLIFrameElement | null>,
  width: number,
): FrameChrome {
  const [chrome, setChrome] = useState<FrameChrome>(FALLBACK_FRAME_CHROME);
  const painterRef = useRef<Painter | null>(null);

  const read = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    const body = doc?.body;
    if (!doc || !body) return;
    try {
      /*
        `elementsFromPoint` (plural), composited back-to-front, rather than
        walking up from `elementFromPoint`. Two reasons, both load-bearing here:

        - SiteHeader is `fixed` and transparent before scroll, so the navy
          PageHero it sits over is its SIBLING, not its ancestor — an ancestor
          walk climbs straight past it to `body` and reports ivory over navy.
        - Once scrolled the header is `bg-background/80`, i.e. genuinely
          translucent, so the honest answer is the blend of it and whatever is
          behind — which is what painting the stack in order gives.

        `body`/`html` come last in the list and are usually transparent (the
        ivory comes from a `@layer base` rule that lands on neither), hence the
        opaque ivory backstop the painter starts from.
      */
      const painter = (painterRef.current ??= createPainter());
      const x = Math.round(width / 2);
      // Each strip is sampled against its OWN edge: on a phone the status bar
      // sits over the top of the page and the home indicator over the bottom,
      // and on a long page those are routinely different colours.
      const viewportHeight = frameRef.current?.contentWindow?.innerHeight ?? 0;
      const top = sample(painter, doc, x, 2);
      const bottom = viewportHeight > 4 ? sample(painter, doc, x, viewportHeight - 2) : top;
      if (!top || !bottom) return;

      setChrome((prev) =>
        sameChrome(prev.top, top) && sameChrome(prev.bottom, bottom) ? prev : { top, bottom },
      );
    } catch {
      /* never let the tint break the rig */
    }
  }, [frameRef, width]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    let scrollTarget: Window | null = null;
    const detach = () => {
      scrollTarget?.removeEventListener("scroll", schedule);
      scrollTarget = null;
    };

    const onLoad = () => {
      read();
      // `load` can beat the stylesheet in dev, where it is injected by the
      // bundle rather than linked — one late re-read costs nothing and covers it
      window.setTimeout(read, 400);
      detach();
      scrollTarget = frame.contentWindow;
      scrollTarget?.addEventListener("scroll", schedule, { passive: true });
    };

    frame.addEventListener("load", onLoad);
    // the frame may already be loaded by the time this effect runs
    if (frame.contentDocument?.readyState === "complete") onLoad();

    return () => {
      frame.removeEventListener("load", onLoad);
      detach();
      cancelAnimationFrame(raf);
    };
  }, [frameRef, read]);

  return chrome;
}

type Painter = (layers: string[]) => [number, number, number] | null;

/**
 * Flattens a back-to-front stack of CSS background-colours to one opaque sRGB
 * triplet, by painting them onto a 1×1 canvas and reading the pixel back.
 *
 * The browser does the parsing and the compositing, and that is the point: this
 * project is on Tailwind v4, whose colour utilities compute to **oklab** —
 * `bg-background/80` reports as `oklab(0.979 0.0006 0.0057 / 0.8)`, not
 * `rgba(...)`. A regex that assumed rgb read those first three components as
 * 0–255 channels, turned near-white into near-black, and tinted the status bar
 * charcoal over every scrolled page. Hand-parsing oklab/oklch/color() to fix
 * that would be a colour-space library; `fillStyle` already accepts every form
 * the page can produce.
 */
function createPainter(): Painter {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return () => null;

  // Whatever this browser serializes a fully-transparent colour to. Assigning
  // an unparseable value to fillStyle is a no-op, so "still the sentinel"
  // is how an unsupported colour syntax is detected rather than mispainted.
  ctx.fillStyle = "#00000000";
  const SENTINEL = ctx.fillStyle;

  return (layers) => {
    // Start opaque, so the pixel read back needs no un-premultiplying.
    ctx.fillStyle = `rgb(${FALLBACK_RGB.join(", ")})`;
    ctx.fillRect(0, 0, 1, 1);

    for (let i = layers.length - 1; i >= 0; i--) {
      ctx.fillStyle = SENTINEL;
      ctx.fillStyle = layers[i];
      if (ctx.fillStyle === SENTINEL) continue; // transparent, or unparseable
      ctx.fillRect(0, 0, 1, 1);
    }

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
}

function luminance([r, g, b]: [number, number, number]): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/* ------------------------------------------------------------------------ */
/* Chrome-less phone furniture                                               */
/* ------------------------------------------------------------------------ */

/*
  Signal and battery, drawn in currentColor so they inherit whatever the status
  bar's ink is. Cheap, and their absence is conspicuous: a status bar with a
  clock and nothing on the right reads as a mock-up rather than a phone.
*/
function Bars() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.8" />
      ))}
    </svg>
  );
}

function Battery() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.45"
      />
      <rect x="2.4" y="2.4" width="16" height="7.2" rx="1.7" fill="currentColor" />
      <path d="M23 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

/** A side button on the rail. Cosmetic — it is the silhouette that sells it. */
function SideButton({ side, top, length }: { side: "start" | "end"; top: number; length: number }) {
  return (
    <span
      aria-hidden
      className="absolute w-[3px] rounded-full"
      style={{
        top,
        height: length,
        [side === "start" ? "left" : "right"]: -2,
        background:
          side === "start"
            ? "linear-gradient(90deg,#6a635c,#2a2725)"
            : "linear-gradient(270deg,#6a635c,#2a2725)",
      }}
    />
  );
}

/** True while the pointer has moved recently; false after a few still seconds. */
function useIdleHidden(delay = 2600): boolean {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const bump = useCallback(() => {
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), delay);
  }, [delay]);

  useEffect(() => {
    // the controls start visible, so mount only has to start the clock —
    // calling bump() here would be a setState to the value already held
    timer.current = setTimeout(() => setVisible(false), delay);
    window.addEventListener("mousemove", bump);
    return () => {
      window.removeEventListener("mousemove", bump);
      clearTimeout(timer.current);
    };
  }, [bump, delay]);

  return visible;
}

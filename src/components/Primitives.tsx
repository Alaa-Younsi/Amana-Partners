import { useEffect, useRef, useState, type ReactNode } from "react";

import { useRevealOnScroll, useTilt } from "@/hooks/use-motion";

/** Widths emitted by scripts/build-assets.mjs into /public/img. */
const PHOTO_WIDTHS = [640, 960, 1280] as const;

/**
 * Responsive photo. `src` is the Vite-imported, content-hashed original
 * (~1600px, the large-screen fallback); `base` is the file stem shared by the
 * generated `/img/<base>-{640,960,1280}.webp` variants. `sizes` must describe
 * the rendered width so the browser can pick the smallest sufficient file.
 */
export function Photo({
  src,
  base,
  alt,
  sizes,
  className = "",
  width = 1600,
  height = 1000,
  priority = false,
}: {
  src: string;
  base: string;
  alt: string;
  sizes: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const srcSet =
    PHOTO_WIDTHS.map((w) => `/img/${base}-${w}.webp ${w}w`).join(", ") + `, ${src} 1600w`;
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}

/** Section wrapper that drives the scroll-reveal of its `.reveal` children. */
export function Section({
  children,
  className = "",
  tone = "default",
  stagger = 90,
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "navy";
  stagger?: number;
  id?: string;
}) {
  const ref = useRevealOnScroll<HTMLElement>(stagger);

  const toneClass =
    tone === "navy" ? "text-ivory" : tone === "muted" ? "border-t border-border" : "";

  const style =
    tone === "navy"
      ? { backgroundColor: "var(--navy-deep)" }
      : tone === "muted"
        ? { backgroundColor: "#f6f2ea" }
        : undefined;

  return (
    <section ref={ref} id={id} className={`relative ${toneClass} ${className}`} style={style}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`reveal ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
      <div className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="hairline" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2 className="mt-6 font-display text-4xl leading-[1.08] md:text-5xl">{title}</h2>
      {intro && (
        <p
          className={`mt-6 text-base leading-relaxed ${light ? "text-ivory/70" : "text-muted-foreground"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/**
 * Card that tilts toward the pointer with its contents floating on raised
 * Z-planes. Falls back to a flat card for touch and reduced-motion users.
 */
export function TiltCard({
  children,
  className = "",
  max = 7,
  reveal = true,
  fill = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  /** Scroll-reveal the card. Applied to the wrapper, never to the tilt layer. */
  reveal?: boolean;
  /**
   * Stretch to fill the parent's height — what you want for a row of cards
   * that should match heights. Set `false` for a standalone card (e.g. a
   * single photo next to unrelated copy), otherwise a taller sibling in a
   * CSS Grid row will stretch this one well past its own content and leave
   * empty space below it.
   */
  fill?: boolean;
}) {
  const tilt = useTilt<HTMLDivElement>(max);
  return (
    <div className={`scene ${fill ? "h-full" : ""} ${reveal ? "reveal-3d" : ""}`}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerEnter={tilt.onPointerEnter}
        onPointerLeave={tilt.onPointerLeave}
        className={`tilt-3d sheen ${fill ? "h-full" : ""} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Counts up to `value` the first time it enters the viewport. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame: number | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast start, gentle settle
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const rounded = value % 1 === 0 ? Math.round(display) : display.toFixed(1);
  const final = value % 1 === 0 ? value : value.toFixed(1);

  // The animated digits would otherwise be read out mid-count by a screen
  // reader; expose the settled figure once and hide the ticking span.
  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {prefix}
        {rounded}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  );
}

/** Numbered panel used by the pillars / approach grids. */
export function NumberedCard({
  n,
  title,
  body,
  note,
}: {
  n: string;
  title: string;
  body?: string;
  note?: string;
}) {
  return (
    <TiltCard className="gold-frame bg-card p-9 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
      <div className="layer-1 flex items-baseline justify-between">
        <span className="font-display text-3xl text-gold">{n}</span>
        <span className="rule-grow" />
      </div>
      <h3 className="layer-2 mt-7 font-display text-2xl text-navy">{title}</h3>
      {body && <p className="layer-1 mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {note && (
        <p className="layer-1 mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          {note}
        </p>
      )}
    </TiltCard>
  );
}

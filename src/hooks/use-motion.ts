import { useCallback, useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Adds `is-visible` to every `.reveal` / `.reveal-3d` descendant of the
 * returned ref once it scrolls into view, staggered by DOM order.
 *
 * One observer per section beats one per element, and elements are unobserved
 * after firing so nothing keeps running behind the fold.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(stagger = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal, .reveal-3d"));
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const index = targets.indexOf(el);
          el.style.transitionDelay = `${Math.max(index, 0) * stagger}ms`;
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}

/**
 * Pointer-tracked 3D tilt. Writes `--rx` / `--ry` on the element so the
 * transform stays in CSS (compositor-friendly) instead of re-rendering React.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 9) {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      // Coarse pointers (touch) shouldn't tilt — it fights with scrolling.
      if (event.pointerType !== "mouse") return;

      const { left, top, width, height } = el.getBoundingClientRect();
      const px = (event.clientX - left) / width - 0.5;
      const py = (event.clientY - top) / height - 0.5;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${px * max * 2}deg`);
        el.style.setProperty("--rx", `${-py * max * 2}deg`);
      });
    },
    [max],
  );

  const onPointerEnter = useCallback(() => {
    ref.current?.classList.add("tilt-3d-active");
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    el.classList.remove("tilt-3d-active");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return { ref, onPointerMove, onPointerEnter, onPointerLeave };
}

/** True once the window has scrolled past `offset` px. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}

/**
 * Normalised (0..1) scroll progress through the document, for the reading
 * progress bar in the header.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}

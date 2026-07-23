import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { LogoLockup, LogoMark } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useScrollProgress, useScrolled } from "@/hooks/use-motion";
import { useTranslation } from "@/lib/i18n";

const NAV_ROUTES = [
  { to: "/", key: "home" },
  { to: "/why-spain", key: "whySpain" },
  { to: "/services", key: "services" },
  { to: "/opportunities", key: "opportunities" },
  { to: "/about", key: "about" },
] as const;

/** Replace with the client's real profiles when supplied. */
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4z",
  },
  {
    label: "Instagram",
    href: "#",
    d: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.4A6.4 6.4 0 1 0 18.4 12 6.4 6.4 0 0 0 12 5.6Zm0 10.6A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2Zm6.6-10.9a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5Z",
  },
  {
    label: "YouTube",
    href: "#",
    d: "M23 12s0-3.4-.4-5a2.6 2.6 0 0 0-1.8-1.8C19.1 4.8 12 4.8 12 4.8s-7.1 0-8.8.4A2.6 2.6 0 0 0 1.4 7C1 8.6 1 12 1 12s0 3.4.4 5a2.6 2.6 0 0 0 1.8 1.8c1.7.4 8.8.4 8.8.4s7.1 0 8.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-5 .4-5ZM9.7 15.4V8.6l6 3.4Z",
  },
  {
    label: "TikTok",
    href: "#",
    d: "M16.6 5.8a4.8 4.8 0 0 1-1.1-3.1h-3.2v12.9a2.7 2.7 0 1 1-2-2.6V9.7a5.9 5.9 0 1 0 5.2 5.9V9.3a7.9 7.9 0 0 0 4.5 1.4V7.5a4.7 4.7 0 0 1-3.4-1.7Z",
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const progress = useScrollProgress();
  const { t } = useTranslation();
  const NAV = NAV_ROUTES.map((n) => ({ to: n.to, label: t.nav[n.key] }));

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  // Every interior page opens on a dark (navy) PageHero, not the home page's
  // light ivory hero — so before scroll (when the header itself is still
  // transparent) its text needs to be light there, not the navy used on
  // home. Once the mobile overlay is open, it's always a navy backdrop too.
  const lightHeader = open || (!scrolled && !isHome);

  // Lock body scroll and allow Escape to dismiss while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-ivory"
      >
        {t.common.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-background/80 shadow-[0_1px_0_0_rgba(230,224,212,1),0_10px_40px_-24px_rgba(13,24,48,0.45)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between transition-[height] duration-500 ${
            scrolled ? "h-[4.5rem]" : "h-24"
          }`}
        >
          <Link to="/" className="group" aria-label={t.common.homeAriaLabel}>
            <LogoLockup light={lightHeader} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label={t.common.primaryNav}>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className={`gold-underline text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  lightHeader
                    ? "text-ivory/75 hover:text-gold"
                    : "text-foreground/70 hover:text-navy"
                }`}
                activeProps={{ style: { color: lightHeader ? "var(--gold)" : "var(--navy)" } }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageToggle light={lightHeader} />
            <CtaButton to="/contact" variant={lightHeader ? "ghost" : "outline"}>
              {t.nav.consultation}
            </CtaButton>
          </div>

          <button
            type="button"
            className={`relative flex h-11 w-11 items-center justify-center transition-colors duration-300 lg:hidden ${
              lightHeader ? "text-ivory" : "text-navy"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Reading-progress hairline */}
        <div
          className="h-px origin-left bg-gold transition-opacity duration-500"
          style={{
            transform: `scaleX(${progress})`,
            opacity: scrolled ? 1 : 0,
          }}
        />
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[55] lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--navy-deep)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              transform: "perspective(700px) rotateX(58deg) scale(2.2)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, black, transparent 72%)",
              WebkitMaskImage: "linear-gradient(to top, black, transparent 72%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 end-[-4rem] h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
          />
          <LogoMark
            decorative
            className="pointer-events-none absolute -bottom-14 end-2 h-64 w-64 opacity-[0.06] animate-float-slow"
            navy="var(--ivory)"
            gold="var(--gold)"
          />
        </div>
        <nav
          className="container-x relative flex h-full flex-col justify-center gap-2"
          aria-label={t.common.mobileNav}
        >
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ style: { color: "var(--gold)" } }}
              tabIndex={open ? 0 : -1}
              className="border-b border-ivory/10 py-5 font-display text-3xl text-ivory transition-all duration-500"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${open ? 120 + i * 70 : 0}ms`,
              }}
            >
              <span className="me-4 text-xs tracking-[0.3em] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              {n.label}
            </Link>
          ))}
          <div
            className="mt-10 flex items-center gap-4"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(24px)",
              transitionDelay: `${open ? 120 + NAV.length * 70 : 0}ms`,
              transition: "opacity 500ms, transform 500ms",
            }}
          >
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="inline-flex flex-1 items-center justify-center gap-3 px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em]"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy-deep)" }}
            >
              {t.nav.consultation}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <LanguageToggle light tabIndex={open ? 0 : -1} />
          </div>
        </nav>
      </div>
    </>
  );
}

/**
 * Primary CTA: a bordered plate whose gold fill wipes in from the bottom,
 * with a subtle lift so it reads as a physical button.
 */
export function CtaButton({
  to,
  children,
  variant = "outline",
}: {
  to: string;
  children: ReactNode;
  variant?: "outline" | "solid" | "ghost";
}) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-[transform,box-shadow,color] duration-500 hover:-translate-y-0.5";

  const skin =
    variant === "solid"
      ? "bg-gold text-navy-deep hover:shadow-[0_16px_40px_-16px_rgba(192,160,99,0.9)]"
      : variant === "ghost"
        ? "border border-ivory/30 text-ivory hover:border-gold hover:text-gold"
        : "border border-gold/60 text-navy hover:text-navy-deep hover:shadow-[0_16px_40px_-20px_rgba(27,43,77,0.6)]";

  return (
    <Link to={to} className={`${base} ${skin}`}>
      {variant === "outline" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
        />
      )}
      <span className="relative z-10">{children}</span>
      <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  const NAV = NAV_ROUTES.map((n) => ({ to: n.to, label: t.nav[n.key] }));

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--navy-deep)", color: "var(--ivory)" }}
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 68%)" }}
      />

      <div className="container-x relative grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" className="group inline-block" aria-label={t.common.homeAriaLabel}>
            <LogoLockup light />
          </Link>
          <p className="mt-7 max-w-sm text-sm leading-relaxed text-ivory/65">{t.footer.blurb}</p>
          <div className="mt-8 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer me"
                className="flex h-10 w-10 items-center justify-center border border-gold/30 text-gold transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-navy-deep"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <h2 className="eyebrow">{t.footer.navigate}</h2>
          <ul className="mt-6 space-y-3.5 text-sm text-ivory/75">
            {[...NAV, { to: "/contact", label: t.nav.contact }].map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-gold"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow">{t.footer.marketsServed}</h2>
          <ul className="mt-6 space-y-3.5 text-sm text-ivory/75">
            {t.footer.markets.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <a
            href="mailto:partners@amanapartners.com"
            className="mt-6 inline-block border-b border-gold/40 pb-1 text-sm text-gold transition-colors hover:border-gold"
            dir="ltr"
          >
            partners@amanapartners.com
          </a>
        </div>
      </div>

      <div className="relative border-t border-ivory/10">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-xs text-ivory/45 md:flex-row">
          <p>
            © {new Date().getFullYear()} Amana Partners LLC. {t.footer.rightsReserved}
          </p>
          <p className="uppercase tracking-[0.24em]">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** Interior-page hero: navy plate with a faint 3D grid and a gold horizon. */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: "var(--navy-deep)", color: "var(--ivory)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform: "perspective(760px) rotateX(58deg) scale(2.4)",
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, black, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />

      <LogoMark
        decorative
        className="pointer-events-none absolute -bottom-16 right-6 h-72 w-72 opacity-[0.05] animate-float-slow"
        navy="var(--ivory)"
        gold="var(--gold)"
      />

      <div className="container-x relative pb-24 pt-40 md:pb-32 md:pt-48">
        <div className="flex items-center gap-4">
          <span className="hairline" />
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[1.03] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ivory/70 md:text-lg">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

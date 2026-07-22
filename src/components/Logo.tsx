/**
 * Amana Partners monogram, redrawn from the logo artwork as vector so it stays
 * crisp at favicon size, works on navy as well as ivory, and carries no JPEG
 * background box. `public/logo.jpeg` remains the source of truth for social
 * previews.
 */
export function LogoMark({
  className = "h-10 w-10",
  navy = "var(--navy)",
  gold = "var(--gold)",
  decorative = false,
}: {
  className?: string;
  navy?: string;
  gold?: string;
  /** Set when the mark is purely ornamental, so AT skips it. */
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      {...(decorative
        ? { "aria-hidden": true as const, focusable: false }
        : { role: "img", "aria-label": "Amana Partners" })}
      fill="none"
    >
      {/* Outer chevron "A" */}
      <path d="M50 6 L96 94 L76 94 L50 43 L24 94 L4 94 Z" fill={navy} />
      {/* Interlocking gold "M" element from the mark */}
      <path d="M50 38 L67 62 L59 74 L50 60 L41 74 L33 62 Z" fill={gold} />
    </svg>
  );
}

export function LogoLockup({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark
        className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:scale-105"
        navy={light ? "var(--ivory)" : "var(--navy)"}
        gold="var(--gold)"
      />
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.35rem] tracking-[0.14em]"
          style={{ color: light ? "var(--ivory)" : "var(--navy)" }}
        >
          AMANA
        </span>
        <span
          className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.42em]"
          style={{ color: "var(--gold)" }}
        >
          Partners
        </span>
      </span>
    </span>
  );
}

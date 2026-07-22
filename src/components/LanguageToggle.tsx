import { useTranslation } from "@/lib/i18n";

export function LanguageToggle({
  className = "",
  light = false,
  tabIndex,
}: {
  className?: string;
  light?: boolean;
  tabIndex?: number;
}) {
  const { locale, setLocale } = useTranslation();

  const base = light
    ? "border-ivory/30 text-ivory/75 hover:border-gold hover:text-ivory"
    : "border-gold/40 text-navy/75 hover:border-gold hover:text-navy";

  const activeOn = light ? "text-ivory" : "text-navy";
  const activeOff = light ? "text-ivory/40" : "text-navy/40";

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      aria-label={locale === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${base} ${className}`}
    >
      <span className={locale === "en" ? activeOn : activeOff}>EN</span>
      <span aria-hidden="true" className={light ? "text-ivory/30" : "text-navy/30"}>
        /
      </span>
      <span className={locale === "ar" ? activeOn : activeOff} dir="rtl">
        عربي
      </span>
    </button>
  );
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { translations, type Locale } from "@/lib/translations";
import { LOCALE_COOKIE } from "@/lib/get-initial-locale";

const STORAGE_KEY = "amana-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)["en"];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* private-mode / storage disabled — the cookie below still carries it */
  }
  // The cookie is what the server reads on the next request, so the first
  // paint after a reload already matches the chosen language.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  /** Resolved on the server from the locale cookie; seeds SSR + first paint. */
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Reconcile with a stored preference the server couldn't see (e.g. the
  // cookie was cleared but localStorage kept the choice from a prior visit).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if ((stored === "ar" || stored === "en") && stored !== locale) {
        setLocaleState(stored);
      }
    } catch {
      /* ignore */
    }
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    persistLocale(locale);
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale: setLocaleState, t: translations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Co-located with its provider by design; not a Fast Refresh hazard here.
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within a LanguageProvider");
  return ctx;
}

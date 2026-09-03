import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import type { Locale } from "@/lib/translations";

export const LOCALE_COOKIE = "amana-locale";

const parseLocale = (value: string | undefined | null): Locale => (value === "ar" ? "ar" : "en");

const fromCookieHeader = (cookie: string | undefined | null): Locale => {
  const match = cookie?.match(/(?:^|;\s*)amana-locale=(ar|en)\b/);
  return parseLocale(match?.[1]);
};

/**
 * The locale to render on the very first paint.
 *
 * On the server it is read from the request's `amana-locale` cookie, so a
 * returning Arabic visitor gets Arabic HTML (and the right `lang` / `dir`)
 * with no flash of English. A crawler, or anyone with no cookie, gets English
 * — which is also what the canonical SEO metadata is written in.
 *
 * On the client it mirrors the same cookie, so a hard refresh and a soft
 * navigation agree. `createIsomorphicFn` keeps the server-only
 * `getRequestHeader` import out of the browser bundle.
 */
export const getInitialLocale = createIsomorphicFn()
  .server((): Locale => {
    try {
      return fromCookieHeader(getRequestHeader("cookie"));
    } catch {
      return "en";
    }
  })
  .client((): Locale => {
    if (typeof document === "undefined") return "en";
    return fromCookieHeader(document.cookie);
  });

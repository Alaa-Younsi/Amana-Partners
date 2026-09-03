import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  organizationJsonLd,
} from "../lib/site";
import { LanguageProvider, useTranslation } from "../lib/i18n";
import { getInitialLocale } from "../lib/get-initial-locale";
import { installGlobalErrorReporting, reportError } from "../lib/report-error";

// Latin faces load on every page; the Arabic faces are only fetched when the
// resolved locale is `ar` (see `head()` below). Weights are trimmed to the
// ones the design actually uses.
const LATIN_FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap";
const ARABIC_FONTS =
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@300;400;500;700&display=swap";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">{t.notFound.errorLabel}</p>
        <h1 className="mt-4 font-display text-6xl">{t.notFound.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.notFound.body}</p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center border border-navy px-6 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-navy hover:bg-navy hover:text-ivory"
          >
            {t.notFound.returnHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    console.error(error);
    reportError(error, { boundary: "root" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">{t.errorPage.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl">{t.errorPage.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.errorPage.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-navy bg-navy px-6 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-ivory"
          >
            {t.errorPage.tryAgain}
          </button>
          <a
            href="/"
            className="border border-navy px-6 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-navy hover:bg-navy hover:text-ivory"
          >
            {t.errorPage.goHome}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  // Resolved on the server from the locale cookie, so the first byte of HTML
  // is already in the visitor's language. Runs once — runtime language
  // switching is the provider's job, not the loader's.
  loader: () => ({ locale: getInitialLocale() }),
  staleTime: Infinity,
  gcTime: Infinity,

  // Document responses are safe to cache at the CDN: they only vary by the
  // tiny `amana-locale` cookie. Anonymous visitors and crawlers hit the edge
  // cache; a returning visitor with the cookie gets a fresh render.
  headers: () => ({
    "cache-control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    vary: "Cookie",
  }),

  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? "en";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: DEFAULT_TITLE },
        { name: "description", content: DEFAULT_DESCRIPTION },
        { name: "author", content: "Amana Partners LLC" },
        { name: "theme-color", content: "#0d1830" },
        { name: "color-scheme", content: "light" },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: DEFAULT_TITLE },
        { property: "og:description", content: DEFAULT_DESCRIPTION },
        { property: "og:type", content: "website" },
        // og:url is deliberately per-route (see routeUrlTags in lib/site.ts),
        // not set here — every route supplies its own.
        { property: "og:locale", content: "en_GB" },
        { property: "og:locale:alternate", content: "ar_AE" },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
        { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:alt", content: "Amana Partners — Cross-Border Investment Advisory" },
        { name: "twitter:card", content: "summary_large_image" },
        // twitter:title / twitter:description are deliberately per-route (see
        // pageHead in lib/site.ts) so each page's card carries its own copy.
        { name: "twitter:image", content: OG_IMAGE },
        {
          name: "twitter:image:alt",
          content: "Amana Partners — Cross-Border Investment Advisory for GCC capital in Spain",
        },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "icon", href: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        // canonical is deliberately per-route (see routeUrlTags) — not set here.
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: LATIN_FONTS },
        ...(locale === "ar" ? [{ rel: "stylesheet" as const, href: ARABIC_FONTS }] : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationJsonLd()),
        },
        {
          // Pre-paint: (1) arm the scroll-reveal styles, (2) sync <html lang/dir>
          // to the locale cookie so a returning Arabic visitor never sees an
          // LTR frame. Both are no-ops without scripting, and the content
          // itself is already server-rendered in the right language.
          children:
            'document.documentElement.setAttribute("data-anim","on");' +
            "(function(){var m=document.cookie.match(/(?:^|;\\s*)amana-locale=(ar|en)\\b/);" +
            'var l=m?m[1]:"en";var e=document.documentElement;' +
            'e.lang=l;e.dir=l==="ar"?"rtl":"ltr";})()',
        },
        {
          // Speculation Rules: Chrome prerenders an interior page in the
          // background when the pointer settles on its link. Same-origin only,
          // carries the visitor's cookies (so locale is preserved), ignored by
          // browsers that don't support it. Pairs with router `defaultPreload`.
          type: "speculationrules",
          children: JSON.stringify({
            prerender: [
              {
                where: {
                  and: [
                    { href_matches: "/*" },
                    { not: { href_matches: "/api/*" } },
                    { not: { selector_matches: "[data-no-prerender]" } },
                  ],
                },
                eagerness: "moderate",
              },
            ],
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // `lang` / `dir` are corrected pre-paint by the head script above (the shell
  // renders outside the router context, so it can't read the loader here).
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { locale } = Route.useLoaderData();

  useEffect(() => {
    installGlobalErrorReporting();
  }, []);

  return (
    <LanguageProvider initialLocale={locale}>
      <Outlet />
    </LanguageProvider>
  );
}

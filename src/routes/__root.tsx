import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
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
// PHONE PREVIEW — temporary recording rig, delete with the folder it points at
import { PhonePreview } from "@/devtools/phone-preview/PhonePreview";

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "author", content: "Amana Partners LLC" },
      { name: "theme-color", content: "#0d1830" },
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
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      // canonical is deliberately per-route (see routeUrlTags) — not set here.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd()),
      },
      {
        // Arms the scroll-reveal styles before first paint. Without scripting
        // the attribute is never set and all content renders normally.
        children: `document.documentElement.setAttribute("data-anim","on")`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
  const { queryClient } = Route.useRouteContext();
  return (
    // PHONE PREVIEW — temporary recording rig. Delete this wrapper, its
    // import, and src/devtools/phone-preview/ to remove.
    <PhonePreview>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Outlet />
        </LanguageProvider>
      </QueryClientProvider>
    </PhonePreview>
  );
}

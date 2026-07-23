/**
 * Canonical site configuration. Everything SEO-facing (canonical URLs, the
 * sitemap, robots, Open Graph, JSON-LD) reads from here so there is exactly
 * one place to change the domain at launch.
 */

// Override per-environment with VITE_SITE_URL (no trailing slash).
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://www.amanapartners.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Amana Partners";
export const LEGAL_NAME = "Amana Partners LLC";

export const DEFAULT_TITLE =
  "Amana Partners — Cross-Border Investment Advisory for GCC Investors in Spain";

export const DEFAULT_DESCRIPTION =
  "Amana Partners is a private cross-border investment advisory firm helping GCC principals identify, evaluate and access strategic opportunities in Spain — across real estate, hospitality, M&A, strategic partnerships and market entry.";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Per-route canonical link + og:url meta. Every route must set its own —
 * the root route deliberately omits both, since router-core dedupes `meta`
 * by attribute (child wins) but never dedupes `links`, so a root-level
 * canonical would render *alongside* a route's own and produce two
 * `<link rel="canonical">` tags.
 */
export function routeUrlTags(path: string) {
  const url = absoluteUrl(path);
  return {
    links: [{ rel: "canonical" as const, href: url }],
    meta: [{ property: "og:url", content: url }],
  };
}

/** Social preview image — 1200×630, matches the platform-recommended 1.91:1 ratio. */
export const OG_IMAGE = absoluteUrl("/og-image.jpg");
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Square brand mark, for contexts (schema.org `logo`, manifest icons) that want a logo, not a banner. */
export const LOGO_IMAGE = absoluteUrl("/icon-512.png");

/** Organization + website structured data for the home page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: LOGO_IMAGE,
    image: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    email: "partners@amanapartners.com",
    slogan: "Strategic Advisory · Cross-Border Investment",
    knowsLanguage: ["en", "es", "ar"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Paseo de la Castellana",
      addressLocality: "Madrid",
      postalCode: "28046",
      addressCountry: "ES",
    },
    areaServed: [
      { "@type": "Country", name: "Spain" },
      { "@type": "Place", name: "Gulf Cooperation Council" },
      { "@type": "Place", name: "Europe" },
    ],
    serviceType: [
      "Real Estate Investment Advisory",
      "Hospitality Investment Advisory",
      "Business Acquisitions (M&A)",
      "Strategic Partnerships",
      "Market Entry Advisory",
      "Investor Representation",
    ],
  };
}

/** BreadcrumbList structured data for an interior page (Home › Page). */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}

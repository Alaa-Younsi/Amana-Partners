/**
 * Canonical site configuration. Everything SEO-facing (canonical URLs, the
 * sitemap, robots, Open Graph, JSON-LD) reads from here so there is exactly
 * one place to change the domain.
 */

// Override per-environment with VITE_SITE_URL (no trailing slash).
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://www.amanapartnersllc.com"
).replace(/\/$/, "");

export const SITE_NAME = "Amana Partners";
export const LEGAL_NAME = "Amana Partners LLC";

/** Public mailbox — footer, JSON-LD, and the destination for form enquiries. */
export const CONTACT_EMAIL = "contact@amanapartnersllc.com";

/** Managing Partner's LinkedIn — the only social profile published so far. */
export const LINKEDIN_URL = "https://www.linkedin.com/in/chaker-nouar-83317559";

export const DEFAULT_TITLE =
  "Amana Partners — Cross-Border Investment Advisory for GCC Investors in Spain";

export const DEFAULT_DESCRIPTION =
  "Amana Partners is a private cross-border investment advisory firm helping GCC principals identify, evaluate and access strategic opportunities in Spain — across real estate, hospitality, M&A, strategic partnerships and market entry.";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Per-route head tags: title, description, canonical, Open Graph and Twitter.
 *
 * Every route must call this. The canonical link and `og:url` in particular
 * cannot live on the root route — router-core dedupes `meta` by attribute
 * (child wins) but never dedupes `links`, so a root-level canonical would
 * render *alongside* a route's own and produce two `<link rel="canonical">`
 * tags. Twitter's title/description are emitted per route here rather than at
 * the root for the same reason a page needs its own description: a single
 * root-level pair would caption every page with the home page's copy.
 */
export function pageHead({
  path,
  title,
  description,
  socialTitle = title,
  socialDescription = description,
}: {
  path: string;
  title: string;
  description: string;
  /** Shorter, punchier line for link previews; defaults to the page's own. */
  socialTitle?: string;
  socialDescription?: string;
}) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: socialDescription },
      { property: "og:url", content: url },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [{ rel: "canonical" as const, href: url }],
  };
}

/** Social preview image — 1200×630, matches the platform-recommended 1.91:1 ratio. */
export const OG_IMAGE = absoluteUrl("/og-image.jpg");
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Square brand mark, for contexts (schema.org `logo`, manifest icons) that want a logo, not a banner. */
export const LOGO_IMAGE = absoluteUrl("/icon-512.png");

/**
 * Organization + website structured data for the home page, as a `@graph` so
 * the two nodes can reference each other by `@id` instead of duplicating the
 * publisher inline.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: LOGO_IMAGE,
          width: 512,
          height: 512,
          caption: LEGAL_NAME,
        },
        image: OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        email: CONTACT_EMAIL,
        sameAs: [LINKEDIN_URL],
        slogan: "Strategic Advisory · Cross-Border Investment",
        knowsLanguage: ["en", "es", "ar"],
        priceRange: "€€€€",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Paseo de la Castellana",
          addressLocality: "Madrid",
          postalCode: "28046",
          addressCountry: "ES",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: CONTACT_EMAIL,
            url: absoluteUrl("/contact"),
            availableLanguage: ["English", "Arabic", "Spanish"],
          },
        ],
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
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: ["en", "ar"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
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

/** ContactPage structured data, paired with the breadcrumb on /contact. */
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#contactpage`,
    url: absoluteUrl("/contact"),
    name: "Private Consultation — Amana Partners",
    description:
      "Request a private, confidential consultation with Amana Partners in Madrid, Dubai, or by secure video.",
    inLanguage: ["en", "ar"],
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

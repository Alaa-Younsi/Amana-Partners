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

/** Social preview image. Replace with a 1200×630 render when one is produced. */
export const OG_IMAGE = `${SITE_URL}/logo.jpeg`;

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Organization + website structured data for the home page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
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

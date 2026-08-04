/**
 * Generates the social share (Open Graph) image at public/og-image.jpg.
 *
 * Composition: the coastal waterfront hero photo (1200×630, the 1.91:1 ratio
 * every platform crops to) with a navy scrim in the lower third carrying the
 * Amana wordmark, a gold rule and the positioning line — a photographic,
 * link-preview-first card in the spirit of a premium editorial cover.
 *
 * Run: `bun scripts/generate-og-image.mjs`
 * Fonts are resolved from the OS (Georgia + Arial), so no bundled fonts.
 */
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, "../src/assets/hero-spain.webp");
const OUTPUT = resolve(here, "../public/og-image.jpg");

const WIDTH = 1200;
const HEIGHT = 630;

const NAVY = "#0d1830";
const IVORY = "#faf8f4";
const GOLD = "#c0a063";

// The "A" mark from favicon.svg (100×100 glyph), recoloured for a dark ground.
const LOGO_MARK = `
    <path d="M50 12 L92 90 L74 90 L50 44 L26 90 L8 90 Z" fill="${IVORY}"/>
    <path d="M50 40 L66 62 L58 73 L50 60 L42 73 L34 62 Z" fill="${GOLD}"/>`;

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.30" stop-color="${NAVY}" stop-opacity="0"/>
      <stop offset="0.66" stop-color="${NAVY}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.94"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}" stop-opacity="0.7"/>
      <stop offset="0.32" stop-color="${NAVY}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#top)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bottom)"/>

  <!-- Top-left kicker -->
  <text x="92" y="74" font-family="Arial, sans-serif" font-size="16"
        letter-spacing="5" fill="${GOLD}">PRIVATE CROSS-BORDER INVESTMENT ADVISORY</text>

  <!-- Brand lockup -->
  <g transform="translate(90,372) scale(0.92)">${LOGO_MARK}</g>
  <text x="212" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="62"
        letter-spacing="7" fill="${IVORY}">AMANA</text>
  <text x="215" y="472" font-family="Arial, sans-serif" font-size="20"
        letter-spacing="13" fill="${GOLD}">PARTNERS</text>

  <!-- Gold rule -->
  <rect x="92" y="512" width="620" height="1.5" fill="${GOLD}" opacity="0.85"/>

  <!-- Positioning line -->
  <text x="92" y="556" font-family="Georgia, 'Times New Roman', serif" font-size="31"
        fill="${IVORY}">Cross-Border Investment Advisory</text>
  <text x="92" y="590" font-family="Arial, sans-serif" font-size="18" letter-spacing="0.5"
        fill="${IVORY}" opacity="0.82">GCC capital in Spain — real estate, hospitality, M&amp;A &amp; market entry</text>

  <!-- Footer locale line, bottom-right -->
  <text x="1108" y="596" text-anchor="end" font-family="Arial, sans-serif" font-size="15"
        letter-spacing="3" fill="${IVORY}" opacity="0.6">MADRID · DUBAI</text>
</svg>`);

await sharp(SOURCE)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUTPUT);

console.log(`Wrote ${OUTPUT}`);

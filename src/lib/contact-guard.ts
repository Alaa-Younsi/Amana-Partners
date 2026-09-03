/**
 * Pure, testable guards for the /api/contact endpoint. No framework imports,
 * so `bun test` can exercise them directly (see contact-guard.test.ts).
 */
import { z } from "zod";

import { SITE_URL } from "@/lib/site";

/** Five enquiries per IP per 15 minutes — generous for a human, tedious for a bot. */
export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 15 * 60 * 1000;

/**
 * The client also enforces the honeypot and the minimum fill time, but neither
 * is trustworthy from the browser, so both are re-checked server-side.
 * `elapsedMs` is self-reported and therefore forgeable — it filters naive bots
 * only, which is all it is claimed to do.
 */
export const MIN_FILL_MS = 1500;

/** Every field is length-capped below, so a body past this is abuse, not an enquiry. */
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * Same-origin guard. Browsers attach `Origin` to every cross-site POST, so
 * refusing a mismatch stops someone else's page from pointing a form at this
 * endpoint and using the mailbox as a relay. A *missing* Origin is allowed —
 * non-browser clients omit it — and those still face the honeypot, the timing
 * check and the rate limit.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  // The canonical host is accepted outright so a proxy that rewrites `host`
  // can't 403 a genuine enquiry; preview deployments match on the headers.
  return [
    new URL(SITE_URL).host,
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
  ].includes(originHost);
}

export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(200).optional().default(""),
  interest: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  company_website: z.string().max(200).optional().default(""),
  elapsedMs: z.number().nonnegative().optional().default(MIN_FILL_MS),
});

export type ParsedEnquiry = z.infer<typeof enquirySchema>;

/**
 * True when a submission trips the honeypot or was filled faster than a human
 * plausibly could. The caller accepts these silently (202) rather than telling
 * the bot which signal caught it.
 */
export function isLikelyBot(input: Pick<ParsedEnquiry, "company_website" | "elapsedMs">): boolean {
  return input.company_website.trim() !== "" || input.elapsedMs < MIN_FILL_MS;
}

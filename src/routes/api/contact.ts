import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";

import { SITE_URL } from "@/lib/site";
import { MailerNotConfiguredError, sendEnquiry } from "@/server/mailer";
import { clientKey, rateLimit } from "@/server/rate-limit";

/** Five enquiries per IP per 15 minutes — generous for a human, tedious for a bot. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

/**
 * The client also enforces the honeypot and the minimum fill time, but neither
 * is trustworthy from the browser, so both are re-checked here. `elapsedMs` is
 * self-reported and therefore forgeable — it filters naive bots only, which is
 * all it is claimed to do.
 */
const MIN_FILL_MS = 1500;

/** Every field is length-capped below, so a body past this is abuse, not an enquiry. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Same-origin guard. Browsers attach `Origin` to every cross-site POST, so
 * refusing a mismatch stops someone else's page from pointing a form at this
 * endpoint and using the mailbox as a relay. A *missing* Origin is allowed —
 * non-browser clients omit it — and those still face the honeypot, the timing
 * check and the rate limit.
 */
function isSameOrigin(request: Request): boolean {
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

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(200).optional().default(""),
  interest: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  company_website: z.string().max(200).optional().default(""),
  elapsedMs: z.number().nonnegative().optional().default(MIN_FILL_MS),
});

const json = (body: unknown, status: number, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers },
  });

/**
 * Silently accepted, never delivered. Telling a bot which signal caught it
 * just teaches it to avoid that signal next time.
 */
const acceptSilently = () => json({ ok: true }, 202);

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) {
          return json({ ok: false, error: "forbidden" }, 403);
        }

        if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
          return json({ ok: false, error: "payload_too_large" }, 413);
        }

        const { allowed, retryAfter } = rateLimit(
          `contact:${clientKey(request)}`,
          RATE_LIMIT,
          RATE_WINDOW_MS,
        );
        if (!allowed) {
          return json({ ok: false, error: "rate_limited" }, 429, {
            "retry-after": String(retryAfter),
          });
        }

        // Read as text first: `content-length` is a claim, this is the fact.
        let payload: unknown;
        try {
          const raw = await request.text();
          if (raw.length > MAX_BODY_BYTES) {
            return json({ ok: false, error: "payload_too_large" }, 413);
          }
          payload = JSON.parse(raw);
        } catch {
          return json({ ok: false, error: "invalid_json" }, 400);
        }

        const parsed = enquirySchema.safeParse(payload);
        if (!parsed.success) {
          return json({ ok: false, error: "invalid_input" }, 400);
        }

        const { company_website, elapsedMs, ...enquiry } = parsed.data;
        if (company_website.trim() !== "" || elapsedMs < MIN_FILL_MS) {
          return acceptSilently();
        }

        try {
          await sendEnquiry(enquiry);
        } catch (error) {
          console.error("Contact enquiry delivery failed", error);
          if (error instanceof MailerNotConfiguredError) {
            return json({ ok: false, error: "unavailable" }, 503);
          }
          return json({ ok: false, error: "send_failed" }, 502);
        }

        return json({ ok: true }, 200);
      },
    },
  },
});

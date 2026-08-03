import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";

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

        let payload: unknown;
        try {
          payload = await request.json();
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

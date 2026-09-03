import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { MailerNotConfiguredError, sendEnquiry } from "@/server/mailer";
import { clientKey, rateLimit } from "@/server/rate-limit";
import {
  MAX_BODY_BYTES,
  RATE_LIMIT,
  RATE_WINDOW_MS,
  enquirySchema,
  isLikelyBot,
  isSameOrigin,
} from "@/lib/contact-guard";

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
        if (isLikelyBot({ company_website, elapsedMs })) {
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

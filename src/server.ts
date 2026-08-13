import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Content-Security-Policy.
 *
 * `script-src` keeps 'unsafe-inline' because TanStack Start emits inline
 * hydration/dehydration scripts with no nonce hook; `style-src` keeps it
 * because the design leans on inline style attributes and CSS custom
 * properties. Everything else is locked to self, and object/frame/base are
 * shut off entirely.
 */
/*
  PHONE PREVIEW — temporary recording rig (src/devtools/phone-preview).

  The rig puts the site inside a same-origin <iframe>, which `frame-ancestors
  'none'` + `X-Frame-Options: DENY` forbid even from ourselves — without this
  the frame loads as an opaque blocked page and the phone shows nothing.

  Relaxed to same-origin in DEV ONLY. `import.meta.env.DEV` is statically
  replaced with `false` when Vite builds for production, so the deployed bundle
  cannot contain the relaxed values regardless of whether anyone remembers to
  delete this. Record with `bun run dev`.

  To remove: delete this const and inline the `: "…"` branch of both
  expressions below.
*/
const PHONE_PREVIEW_DEV = import.meta.env.DEV;

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  PHONE_PREVIEW_DEV ? "frame-ancestors 'self'" : "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": CSP,
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  // PHONE PREVIEW — see PHONE_PREVIEW_DEV above; production always gets DENY.
  "x-frame-options": PHONE_PREVIEW_DEV ? "SAMEORIGIN" : "DENY",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "cross-origin-opener-policy": "same-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
};

function withSecurityHeaders(response: Response): Response {
  // Response headers can be immutable (e.g. from caches) — clone to be safe.
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};

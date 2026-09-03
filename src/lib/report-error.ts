/**
 * Client-side crash reporting seam.
 *
 * No-ops unless `VITE_ERROR_REPORT_URL` is set. Point it at a collector
 * (Sentry tunnel, Logtail, a tiny serverless function, …) and remember to add
 * that host to `connect-src` in the CSP in `src/server.ts` — the default
 * policy only allows `'self'`.
 *
 * Kept dependency-free on purpose: swapping in a full SDK later is a one-file
 * change, and until then a crash still surfaces via the error boundary.
 */
const ENDPOINT = import.meta.env.VITE_ERROR_REPORT_URL as string | undefined;

let installed = false;

export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (!ENDPOINT || typeof window === "undefined") return;
  try {
    const err = error as Partial<Error> | undefined;
    const payload = JSON.stringify({
      message: err?.message ?? String(error),
      stack: err?.stack ?? null,
      context: context ?? null,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    });
    const sent = navigator.sendBeacon?.(ENDPOINT, payload);
    if (!sent) {
      void fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    /* reporting must never throw into the caller */
  }
}

/** Attach global handlers once, from the app root. */
export function installGlobalErrorReporting() {
  if (installed || !ENDPOINT || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("error", (e) => reportError(e.error ?? e.message, { kind: "error" }));
  window.addEventListener("unhandledrejection", (e) =>
    reportError(e.reason, { kind: "unhandledrejection" }),
  );
}

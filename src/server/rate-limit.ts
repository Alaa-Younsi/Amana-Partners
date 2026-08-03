/**
 * Fixed-window, in-memory rate limiter.
 *
 * Scoped to a single warm serverless instance, so it is a speed bump against
 * casual form spam rather than a guarantee — a distributed attacker spread
 * across cold starts will get more than `limit` through. That is an accepted
 * trade-off here: the real backstop is the mailbox, and adding a shared store
 * (KV/Redis) for a brochure site's contact form is not worth the dependency.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry; 0 when allowed. */
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    // Opportunistic sweep — the map only ever holds keys seen by this
    // instance, but without this a long-lived instance grows unbounded.
    if (buckets.size > 500) {
      for (const [k, v] of buckets) {
        if (now >= v.resetAt) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

/** Best-effort client identity from proxy headers, for rate-limit keying only. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

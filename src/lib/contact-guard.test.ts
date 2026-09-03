import { describe, expect, it } from "bun:test";

import { enquirySchema, isLikelyBot, isSameOrigin, MIN_FILL_MS } from "./contact-guard";
import { SITE_URL } from "./site";

const canonicalHost = new URL(SITE_URL).host;

const post = (headers: Record<string, string>) =>
  new Request("https://example.test/api/contact", { method: "POST", headers });

describe("isSameOrigin", () => {
  it("allows a request with no Origin header (non-browser client)", () => {
    expect(isSameOrigin(post({}))).toBe(true);
  });

  it("allows an Origin whose host matches the canonical site", () => {
    expect(isSameOrigin(post({ origin: `https://${canonicalHost}` }))).toBe(true);
  });

  it("allows an Origin that matches the forwarded host (preview deploy)", () => {
    expect(
      isSameOrigin(
        post({
          origin: "https://amana-preview.vercel.app",
          "x-forwarded-host": "amana-preview.vercel.app",
        }),
      ),
    ).toBe(true);
  });

  it("rejects a foreign Origin", () => {
    expect(isSameOrigin(post({ origin: "https://evil.example" }))).toBe(false);
  });

  it("rejects a malformed Origin", () => {
    expect(isSameOrigin(post({ origin: "not a url" }))).toBe(false);
  });
});

describe("enquirySchema", () => {
  const base = { name: "Layla", email: "layla@example.com" };

  it("accepts a minimal valid enquiry and fills defaults", () => {
    const parsed = enquirySchema.parse(base);
    expect(parsed.country).toBe("");
    expect(parsed.message).toBe("");
    expect(parsed.elapsedMs).toBe(MIN_FILL_MS);
  });

  it("trims whitespace from fields", () => {
    const parsed = enquirySchema.parse({
      ...base,
      name: "  Layla  ",
      email: " layla@example.com ",
    });
    expect(parsed.name).toBe("Layla");
    expect(parsed.email).toBe("layla@example.com");
  });

  it("rejects an invalid email", () => {
    expect(enquirySchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(enquirySchema.safeParse({ ...base, name: "   " }).success).toBe(false);
  });

  it("rejects an over-long message", () => {
    expect(enquirySchema.safeParse({ ...base, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("rejects a negative elapsedMs", () => {
    expect(enquirySchema.safeParse({ ...base, elapsedMs: -1 }).success).toBe(false);
  });
});

describe("isLikelyBot", () => {
  it("flags a filled honeypot", () => {
    expect(isLikelyBot({ company_website: "http://spam.example", elapsedMs: 9999 })).toBe(true);
  });

  it("flags a form submitted faster than a human could", () => {
    expect(isLikelyBot({ company_website: "", elapsedMs: MIN_FILL_MS - 1 })).toBe(true);
  });

  it("passes a clean, human-paced submission", () => {
    expect(isLikelyBot({ company_website: "  ", elapsedMs: MIN_FILL_MS + 1 })).toBe(false);
  });
});

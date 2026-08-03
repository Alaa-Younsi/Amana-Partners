/**
 * Outbound mail for contact-form enquiries.
 *
 * Delivery goes through Hostinger's SMTP server using the site's own mailbox,
 * so no third-party form service ever sees an enquiry. The mailbox sends to
 * itself; `replyTo` is the enquirer, so hitting Reply in the inbox answers
 * them directly.
 *
 * Files under `src/server/` are blocked from the client bundle by the
 * `importProtection` rule in vite.config.ts — never import this from a
 * component.
 */
import nodemailer, { type Transporter } from "nodemailer";

import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export interface Enquiry {
  name: string;
  email: string;
  country: string;
  phone: string;
  interest: string;
  message: string;
}

/** Thrown when the mailbox credentials are missing, so the route can 503 rather than 500. */
export class MailerNotConfiguredError extends Error {
  constructor(missing: string) {
    super(`Mail transport is not configured: ${missing} is unset.`);
    this.name = "MailerNotConfiguredError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MailerNotConfiguredError(name);
  return value;
}

// One transporter per warm serverless instance — nodemailer pools the
// connection, so repeated submissions don't re-handshake TLS every time.
let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
    port,
    // Hostinger speaks implicit TLS on 465 and STARTTLS on 587.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER ?? CONTACT_EMAIL,
      pass: requireEnv("SMTP_PASSWORD"),
    },
  });
  return transporter;
}

/**
 * Defence in depth for values that end up in a mail header. Nodemailer already
 * folds line breaks out of header values, but a crafted `name` shouldn't have
 * to depend on that staying true across upgrades.
 */
const headerSafe = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderRows(enquiry: Enquiry) {
  const rows: Array<[string, string]> = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone || "—"],
    ["Country", enquiry.country || "—"],
    ["Area of interest", enquiry.interest || "—"],
  ];
  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font:400 13px/1.5 Arial,sans-serif;white-space:nowrap">${label}</td>` +
        `<td style="padding:6px 0;color:#0d1830;font:400 14px/1.5 Arial,sans-serif">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
}

export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  const to = process.env.CONTACT_TO ?? CONTACT_EMAIL;
  const from = process.env.SMTP_USER ?? CONTACT_EMAIL;

  const plain = [
    `New enquiry from the ${SITE_NAME} website`,
    "",
    `Name:     ${enquiry.name}`,
    `Email:    ${enquiry.email}`,
    `Phone:    ${enquiry.phone || "—"}`,
    `Country:  ${enquiry.country || "—"}`,
    `Interest: ${enquiry.interest || "—"}`,
    "",
    "Message:",
    enquiry.message || "(none)",
  ].join("\n");

  const html = `
<div style="background:#faf8f4;padding:32px">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e6e0d4">
    <div style="background:#0d1830;padding:20px 28px">
      <p style="margin:0;color:#c0a063;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase">${SITE_NAME}</p>
      <p style="margin:6px 0 0;color:#faf8f4;font:400 18px/1.4 Georgia,serif">New consultation enquiry</p>
    </div>
    <div style="padding:28px">
      <table style="border-collapse:collapse">${renderRows(enquiry)}</table>
      <p style="margin:24px 0 6px;color:#6b7280;font:400 13px/1.5 Arial,sans-serif">Message</p>
      <p style="margin:0;padding:14px 16px;background:#faf8f4;border-left:2px solid #c0a063;color:#0d1830;font:400 14px/1.7 Arial,sans-serif;white-space:pre-wrap">${
        escapeHtml(enquiry.message) || "(none)"
      }</p>
      <p style="margin:24px 0 0;color:#6b7280;font:400 12px/1.5 Arial,sans-serif">Reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p>
    </div>
  </div>
</div>`;

  await getTransporter().sendMail({
    from: { name: `${SITE_NAME} Website`, address: from },
    to,
    replyTo: { name: headerSafe(enquiry.name), address: enquiry.email },
    subject: headerSafe(
      `New enquiry — ${enquiry.name}${enquiry.interest ? ` · ${enquiry.interest}` : ""}`,
    ),
    text: plain,
    html,
  });
}

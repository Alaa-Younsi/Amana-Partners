import { createFileRoute } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";
import { breadcrumbJsonLd, contactPageJsonLd, CONTACT_EMAIL, pageHead } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => {
    return {
      ...pageHead({
        path: "/contact",
        title: "Private Consultation — Amana Partners",
        description:
          "Request a private, confidential consultation with Amana Partners in Madrid, Dubai, or by secure video.",
        socialDescription: "Begin the conversation in confidence.",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Contact", "/contact")),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(contactPageJsonLd()),
        },
      ],
    };
  },
  component: Contact,
});

type Status = "idle" | "sending" | "sent" | "error";

function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>("idle");
  const interestId = useId();
  const messageId = useId();
  const honeypotId = useId();
  // Bots that skip the honeypot still tend to fill and submit a form in well
  // under a second; a real visitor can't. Sent to the server as `elapsedMs`,
  // where it is re-checked — neither this nor the honeypot is enforceable here.
  const mountedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, elapsedMs: Date.now() - mountedAt.current }),
      });
      if (!response.ok) throw new Error(`Enquiry failed: ${response.status}`);
      setStatus("sent");
      form.reset();
      mountedAt.current = Date.now();
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.contact.hero.eyebrow}
        title={t.contact.hero.title}
        intro={t.contact.hero.intro}
      />

      <Section className="py-24 md:py-32">
        <div className="container-x">
          <div className="reveal mx-auto max-w-2xl">
            <form
              className="gold-frame bg-card p-8 shadow-[var(--shadow-soft)] md:p-12"
              onSubmit={onSubmit}
              noValidate={false}
            >
              <p className="eyebrow">{t.contact.form.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl">{t.contact.form.title}</h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <Field
                  label={t.contact.form.fields.name}
                  name="name"
                  autoComplete="name"
                  required
                />
                <Field
                  label={t.contact.form.fields.country}
                  name="country"
                  autoComplete="country-name"
                />
                <Field
                  label={t.contact.form.fields.email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <Field
                  label={t.contact.form.fields.phone}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor={interestId}
                  className="text-xs uppercase tracking-[0.22em] text-muted-foreground"
                >
                  {t.contact.form.interestLabel}
                </label>
                <select
                  id={interestId}
                  name="interest"
                  className="mt-3 w-full border border-border bg-transparent px-4 py-3 text-sm transition-colors duration-300 focus:border-gold focus:outline-none"
                >
                  {t.contact.form.interests.map((interest, i) => (
                    <option key={i}>{interest}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label
                  htmlFor={messageId}
                  className="text-xs uppercase tracking-[0.22em] text-muted-foreground"
                >
                  {t.contact.form.messageLabel}
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  rows={5}
                  maxLength={2000}
                  className="mt-3 w-full border border-border bg-transparent px-4 py-3 text-sm transition-colors duration-300 focus:border-gold focus:outline-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              {/* Honeypot — hidden from humans, irresistible to bots */}
              <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
                <label htmlFor={honeypotId}>{t.contact.form.honeypotLabel}</label>
                <input
                  id={honeypotId}
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative mt-10 inline-flex w-full items-center justify-center overflow-hidden px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-18px_rgba(27,43,77,0.8)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                style={{ backgroundColor: "var(--navy)", color: "var(--ivory)" }}
              >
                <span className="relative z-10">
                  {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                </span>
              </button>

              <p
                aria-live="polite"
                className={`mt-5 text-xs ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
              >
                {status === "sent" && t.contact.form.confirmSent}
                {status === "error" && t.contact.form.errorMessage}
                {(status === "idle" || status === "sending") && t.contact.form.confirmDefault}
              </p>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t.contact.form.orEmail}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="border-b border-gold/50 pb-0.5 text-navy transition-colors hover:border-gold"
                dir="ltr"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={200}
        className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm transition-colors duration-300 focus:border-gold focus:outline-none"
      />
    </div>
  );
}

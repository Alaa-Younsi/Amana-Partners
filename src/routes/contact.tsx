import { createFileRoute } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";
import { breadcrumbJsonLd, routeUrlTags } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => {
    const { links, meta } = routeUrlTags("/contact");
    return {
      meta: [
        { title: "Private Consultation — Amana Partners" },
        {
          name: "description",
          content:
            "Request a private, confidential consultation with Amana Partners in Madrid, Dubai, or by secure video.",
        },
        { property: "og:title", content: "Private Consultation — Amana Partners" },
        { property: "og:description", content: "Begin the conversation in confidence." },
        ...meta,
      ],
      links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Contact", "/contact")),
        },
      ],
    };
  },
  component: Contact,
});

function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const interestId = useId();
  const messageId = useId();
  const honeypotId = useId();
  // Bots that skip the honeypot still tend to fill and submit a form in well
  // under a second; a real visitor can't. Client-side only — a real signal,
  // but not enforcement, which has to happen server-side once a submission
  // endpoint exists (see TODO below).
  const mountedAt = useRef(Date.now());

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypotFilled = (form.elements.namedItem("company_website") as HTMLInputElement)?.value;
    const submittedTooFast = Date.now() - mountedAt.current < 1500;
    if (honeypotFilled || submittedTooFast) {
      return;
    }
    // TODO(client): POST to the real enquiry endpoint once it exists — and
    // re-check both signals above server-side; neither is enforceable here.
    setSent(true);
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.contact.hero.eyebrow}
        title={t.contact.hero.title}
        intro={t.contact.hero.intro}
      />

      <Section className="py-24 md:py-32">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <div className="reveal md:col-span-5">
            <p className="eyebrow">{t.contact.offices.eyebrow}</p>
            <div className="mt-8 space-y-10">
              {t.contact.offices.blocks.map((b, i) => (
                <Block key={i} title={b.title} lines={b.lines} />
              ))}
            </div>
          </div>

          <div className="reveal md:col-span-6 md:col-start-7">
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
                className="group relative mt-10 inline-flex w-full items-center justify-center overflow-hidden px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-18px_rgba(27,43,77,0.8)]"
                style={{ backgroundColor: "var(--navy)", color: "var(--ivory)" }}
              >
                <span className="relative z-10">{t.contact.form.submit}</span>
              </button>

              <p aria-live="polite" className="mt-5 text-xs text-muted-foreground">
                {sent ? t.contact.form.confirmSent : t.contact.form.confirmDefault}
              </p>
            </form>
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

const HAS_ARABIC = /[؀-ۿ]/;

function Block({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="group border-s border-border ps-6 transition-colors duration-500 hover:border-gold">
      <h3 className="font-display text-xl text-navy">{title}</h3>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {lines.map((l, i) => (
          <p key={i} dir={HAS_ARABIC.test(l) ? undefined : "ltr"}>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

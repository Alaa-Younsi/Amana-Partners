import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, MapPin, Scale } from "lucide-react";

import { CtaButton, SiteLayout } from "@/components/SiteLayout";
import { CountUp, NumberedCard, Section, SectionHeading, TiltCard } from "@/components/Primitives";
import { WorldMap } from "@/components/WorldMap";
import { useTranslation } from "@/lib/i18n";
import { routeUrlTags } from "@/lib/site";
import marbella from "@/assets/marbella.webp";
import madrid from "@/assets/madrid.webp";
import barcelona from "@/assets/barcelona-interior.webp";

export const Route = createFileRoute("/")({
  head: () => routeUrlTags("/"),
  component: Home,
});

const MARKET_IMAGES = [marbella, madrid, barcelona];
const TRUST_ICONS = [Globe2, MapPin, Scale];
const STATS_CONFIG = [
  { value: 420, prefix: "€ ", suffix: "M+" },
  { value: 12 },
  { value: 6, suffix: " GCC" },
  { value: 100, suffix: "%" },
];

function Home() {
  const { t, locale } = useTranslation();
  const mirrored = locale === "ar";
  return (
    <SiteLayout>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Warm ivory ground with a soft gold bloom behind the map */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: mirrored
              ? "radial-gradient(120% 90% at 22% 32%, #ffffff 0%, var(--ivory) 46%, #f4efe5 100%)"
              : "radial-gradient(120% 90% at 78% 32%, #ffffff 0%, var(--ivory) 46%, #f4efe5 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[18%] -z-10 h-[32rem] w-[32rem] rounded-full opacity-[0.13] blur-3xl end-[6%]"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 68%)" }}
        />

        {/* Dotted world map — decorative background, large enough that on
            narrow screens it would sit directly behind the headline and hurt
            legibility, so it's hidden there in favour of the smaller inline
            version below the hero copy. Mirrors to the opposite side (and
            fades from the opposite edge) so it never sits under the text,
            in either reading direction. */}
        <WorldMap
          mirrored={mirrored}
          className="pointer-events-none absolute -end-[4%] top-10 -z-10 hidden h-auto max-w-none opacity-90 md:block md:w-[80%] lg:w-[74%]"
        />

        <div className="container-x relative pb-20 pt-36 md:pb-24 md:pt-44 lg:pb-28 lg:pt-48">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-navy/80">
              <span>{t.home.hero.badge1}</span>
              <span aria-hidden="true" className="h-4 w-px bg-gold" />
              <span>{t.home.hero.badge2}</span>
            </div>

            <h1 className="mt-8 font-display text-5xl leading-[1.02] text-navy-deep md:text-6xl lg:text-7xl">
              {t.home.hero.titlePrefix}{" "}
              <em className="shimmer not-italic">{t.home.hero.titleEm}</em>
              {t.home.hero.titleSuffix}
            </h1>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.home.hero.subtitle}
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              {/* TODO(client): confirm the advisor name shown on this CTA. */}
              <CtaButton to="/contact">{t.home.hero.ctaSpeak}</CtaButton>
              <Link
                to="/services"
                className="gold-underline text-[0.72rem] font-medium uppercase tracking-[0.2em] text-navy/70 transition-colors hover:text-navy"
              >
                {t.home.hero.ctaExpertise}
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-5">
              {TRUST_ICONS.map((Icon, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="me-5 hidden h-8 w-px bg-border sm:block" />
                  )}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
                  </span>
                  <span className="max-w-[7rem] text-[0.68rem] font-medium uppercase leading-tight tracking-[0.18em] text-navy/75">
                    {t.home.hero.trust[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact map, mobile only — the large background version above
              is hidden below md since it would sit directly under the text;
              this sits in normal flow below the copy instead, so it's never
              hidden, on either side of the toggle. */}
          <div
            aria-hidden="true"
            className="relative -mx-6 mt-14 h-52 overflow-hidden sm:h-64 md:hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            }}
          >
            <WorldMap
              mirrored={mirrored}
              // The map's own viewBox spans the whole visible globe (Americas
              // to Asia) so its geometric centre is mostly empty ocean — the
              // Spain/Europe/GCC cluster sits well right of that centre (and
              // mirrored, well left of it). Centering on the cluster itself,
              // not the viewBox midpoint, is what actually frames it.
              className={`absolute left-1/2 top-1/2 h-auto w-[42rem] max-w-none -translate-y-[36%] ${
                mirrored ? "-translate-x-[36%]" : "-translate-x-[64%]"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- STATS BAR */}
      <Section className="border-y border-border bg-card" stagger={70}>
        <div className="container-x grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {STATS_CONFIG.map((s, i) => (
            <div key={i} className="reveal px-4 py-11 text-center">
              <div className="font-display text-4xl text-navy md:text-5xl">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
                {t.home.stats[i]}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ POSITIONING */}
      <Section className="py-28 md:py-36">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow={t.home.positioning.eyebrow}
              title={
                <>
                  {t.home.positioning.titleLine1}
                  <br />
                  <span className="text-gold">{t.home.positioning.titleLine2Gold}</span>
                </>
              }
            />
          </div>
          <div className="reveal md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-foreground/85">{t.home.positioning.body}</p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {t.home.positioning.facts.map((f, i) => (
                <Fact key={i} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- PILLARS */}
      <Section tone="muted" className="py-28 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow={t.home.pillars.eyebrow} title={t.home.pillars.title} />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.home.pillars.items.map((p, i) => (
              <NumberedCard
                key={i}
                n={String(i + 1).padStart(2, "0")}
                title={p.title}
                body={p.body}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- MARKETS */}
      <Section className="py-28 md:py-36">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.home.markets.eyebrow}
            title={t.home.markets.title}
            intro={t.home.markets.intro}
          />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.home.markets.items.map((m, i) => (
              <TiltCard
                key={i}
                className="relative overflow-hidden bg-navy-deep shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)]"
                max={6}
              >
                <img
                  src={MARKET_IMAGES[i]}
                  alt={m.city}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="h-[26rem] w-full object-cover opacity-75 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, var(--navy-deep) 4%, transparent 62%)",
                  }}
                />
                <div className="layer-2 pointer-events-none absolute inset-x-0 bottom-0 p-8">
                  <h3 className="font-display text-3xl text-ivory">{m.city}</h3>
                  <p className="mt-2 text-[0.66rem] uppercase tracking-[0.22em] text-gold">
                    {m.note}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------- STRATEGIC OPPORTUNITIES */}
      <Section tone="muted" className="py-28 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t.home.verticals.eyebrow}
              title={t.home.verticals.title}
              intro={t.home.verticals.intro}
            />
            <Link
              to="/services"
              className="reveal gold-underline shrink-0 text-[0.72rem] uppercase tracking-[0.22em] text-navy"
            >
              {t.home.verticals.exploreLink}
            </Link>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.home.verticals.items.map((v, i) => (
              <NumberedCard
                key={i}
                n={String(i + 1).padStart(2, "0")}
                title={v.title}
                note={v.note}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- OUR APPROACH */}
      <Section className="py-28 md:py-36">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.home.approach.eyebrow}
            title={t.home.approach.title}
            intro={t.home.approach.intro}
          />
          <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.home.approach.steps.map((s, i) => (
              <li key={i} className="contents">
                <NumberedCard n={String(i + 1).padStart(2, "0")} title={s.title} body={s.body} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ------------------------------------------------------- TESTIMONIAL */}
      <Section tone="navy" className="overflow-hidden py-28 md:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            transform: "perspective(700px) rotateX(62deg) scale(2.2)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, black, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent 70%)",
          }}
        />
        <div className="container-x relative max-w-4xl text-center">
          <p className="reveal eyebrow">{t.home.testimonial.eyebrow}</p>
          <blockquote className="reveal mt-10 font-display text-3xl italic leading-snug md:text-[2.6rem]">
            {t.home.testimonial.quote}
          </blockquote>
          <p className="reveal mt-9 text-[0.68rem] uppercase tracking-[0.28em] text-ivory/55">
            {t.home.testimonial.attribution}
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section className="py-28 md:py-32">
        <div className="container-x grid items-center gap-12 md:grid-cols-2">
          <div className="reveal">
            <SectionHeading eyebrow={t.home.finalCta.eyebrow} title={t.home.finalCta.title} />
          </div>
          <div className="reveal flex flex-col items-start gap-7 md:items-end">
            <p className="max-w-md text-base text-muted-foreground md:text-end">
              {t.home.finalCta.body}
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 text-[0.7rem] uppercase tracking-[0.22em] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-18px_rgba(27,43,77,0.8)]"
              style={{ backgroundColor: "var(--navy)", color: "var(--ivory)" }}
            >
              {t.home.finalCta.button}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="group border-t border-border pt-4 transition-colors duration-500 hover:border-gold">
      <div className="text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-xl text-navy">{value}</div>
    </div>
  );
}

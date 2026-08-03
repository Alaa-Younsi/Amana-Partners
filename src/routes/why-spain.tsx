import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section, SectionHeading, TiltCard } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";
import { breadcrumbJsonLd, pageHead } from "@/lib/site";
import madridImg from "@/assets/madrid.webp";

export const Route = createFileRoute("/why-spain")({
  head: () => {
    return {
      ...pageHead({
        path: "/why-spain",
        title: "Why Spain — Amana Partners",
        description:
          "The macro thesis behind Spanish real estate for GCC capital: stability, yield, lifestyle and residency.",
        socialDescription: "Why sophisticated GCC investors are allocating to Spanish real estate.",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Why Spain", "/why-spain")),
        },
      ],
    };
  },
  component: WhySpain,
});

const REASON_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

function WhySpain() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.whySpain.hero.eyebrow}
        title={t.whySpain.hero.title}
        intro={t.whySpain.hero.intro}
      />

      <Section className="py-24 md:py-32">
        <div className="container-x grid items-center gap-16 md:grid-cols-12">
          <div className="reveal md:col-span-5">
            <TiltCard
              max={7}
              reveal={false}
              className="overflow-hidden shadow-[var(--shadow-lift)]"
            >
              <img
                src={madridImg}
                alt="Madrid at twilight"
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
                width={1600}
                height={1000}
              />
            </TiltCard>
          </div>
          <div className="reveal md:col-span-6 md:col-start-7">
            <p className="eyebrow">{t.whySpain.perspective.eyebrow}</p>
            <h2 className="mt-6 font-display text-4xl leading-tight">
              {t.whySpain.perspective.title}
            </h2>
            {t.whySpain.perspective.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-lg leading-relaxed text-foreground/85 ${i === 0 ? "mt-6" : "mt-4"}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted" className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.whySpain.reasonsSection.eyebrow}
            title={t.whySpain.reasonsSection.title}
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.whySpain.reasons.map((r, i) => (
              <TiltCard
                key={i}
                max={6}
                className="gold-frame bg-card p-10 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="layer-1 font-display text-2xl italic text-gold">
                  {REASON_NUMERALS[i]}
                </div>
                <h3 className="layer-2 mt-5 font-display text-2xl text-navy">{r.title}</h3>
                <p className="layer-1 mt-4 text-sm leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

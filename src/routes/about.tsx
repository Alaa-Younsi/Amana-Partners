import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section, SectionHeading, TiltCard } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";
import { breadcrumbJsonLd, routeUrlTags } from "@/lib/site";
import interior from "@/assets/barcelona-interior.webp";

export const Route = createFileRoute("/about")({
  head: () => {
    const { links, meta } = routeUrlTags("/about");
    return {
      meta: [
        { title: "About Amana Partners" },
        {
          name: "description",
          content:
            "Amana Partners is a private cross-border investment advisory firm helping GCC principals access strategic opportunities in Spain.",
        },
        { property: "og:title", content: "About Amana Partners" },
        {
          property: "og:description",
          content:
            "An independent advisory firm — not a brokerage — built for GCC principals investing in Spain.",
        },
        ...meta,
      ],
      links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("About", "/about")),
        },
      ],
    };
  },
  component: About,
});

function About() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.about.hero.eyebrow}
        title={t.about.hero.title}
        intro={t.about.hero.intro}
      />

      <Section className="py-24 md:py-32">
        <div className="container-x grid items-start gap-16 md:grid-cols-12">
          <div className="reveal md:col-span-6">
            <p className="eyebrow">{t.about.mission.eyebrow}</p>
            <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
              {t.about.mission.title}
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-foreground/85">
              {t.about.mission.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="reveal md:col-span-5 md:col-start-8">
            <TiltCard
              max={7}
              reveal={false}
              fill={false}
              className="overflow-hidden shadow-[var(--shadow-lift)]"
            >
              <img
                src={interior}
                alt="Amana Partners environment"
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
                className="w-full object-cover"
              />
            </TiltCard>
            <div className="mt-8 border-s-2 ps-6" style={{ borderColor: "var(--gold)" }}>
              <p className="font-display text-2xl italic leading-snug text-navy">
                {t.about.mission.quote}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t.about.mission.quoteAttribution}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.about.values.eyebrow} title={t.about.values.title} />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.about.values.items.map((v) => (
              <TiltCard
                key={v.title}
                max={6}
                className="gold-frame bg-card p-10 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
              >
                <h3 className="layer-2 font-display text-2xl text-navy">{v.title}</h3>
                <span className="layer-1 mt-4 block rule-grow" />
                <p className="layer-1 mt-4 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

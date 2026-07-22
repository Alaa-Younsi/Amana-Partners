import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Section, TiltCard } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Expertise — Amana Partners" },
      {
        name: "description",
        content:
          "Six investment verticals: real estate, hospitality, business acquisitions (M&A), strategic partnerships, market entry in Spain and investor representation.",
      },
      { property: "og:title", content: "Our Expertise — Amana Partners" },
      {
        property: "og:description",
        content:
          "Cross-border investment advisory across six verticals for GCC principals investing in Spain.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.services.hero.eyebrow}
        title={t.services.hero.title}
        intro={t.services.hero.intro}
      />

      <Section className="py-24 md:py-32" stagger={80}>
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2">
            {t.services.items.map((s, idx) => (
              <TiltCard
                key={s.title}
                max={5}
                className="gold-frame bg-card p-10 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] md:p-14"
              >
                <div className="layer-1 flex items-baseline justify-between border-b border-border pb-6">
                  <span className="font-display text-3xl text-gold">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
                    {t.services.verticalLabel}
                  </span>
                </div>
                <h2 className="layer-2 mt-8 font-display text-3xl text-navy">{s.title}</h2>
                <p className="layer-1 mt-4 text-base leading-relaxed text-foreground/80">
                  {s.body}
                </p>
                <ul className="layer-1 mt-8 space-y-3">
                  {s.bullets.map((i) => (
                    <li
                      key={i}
                      className="group/item flex items-start gap-3 text-sm text-foreground/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-px w-4 shrink-0 transition-[width] duration-500 group-hover/item:w-7"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

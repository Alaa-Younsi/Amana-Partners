import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Photo, Section, TiltCard } from "@/components/Primitives";
import { useTranslation } from "@/lib/i18n";
import { breadcrumbJsonLd, pageHead } from "@/lib/site";
import madrid from "@/assets/madrid.webp";
import costaBlanca from "@/assets/costa-blanca.webp";
import barcelona from "@/assets/barcelona-interior.webp";
import hero from "@/assets/hero-spain.webp";

export const Route = createFileRoute("/opportunities")({
  head: () => {
    return {
      ...pageHead({
        path: "/opportunities",
        title: "Strategic Opportunities — Amana Partners",
        description:
          "A representative sample of the cross-border investment opportunities Amana Partners evaluates for GCC principals across Spain.",
        socialDescription:
          "Real estate, hospitality, M&A and market-entry opportunities across Spain — reviewed under NDA with qualified principals.",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Opportunities", "/opportunities")),
        },
      ],
    };
  },
  component: Opportunities,
});

const DEAL_IMAGES = [hero, madrid, barcelona, costaBlanca, madrid, barcelona];
const DEAL_IMAGE_BASES = [
  "hero-spain",
  "madrid",
  "barcelona-interior",
  "costa-blanca",
  "madrid",
  "barcelona-interior",
];

function Opportunities() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t.opportunities.hero.eyebrow}
        title={t.opportunities.hero.title}
        intro={t.opportunities.hero.intro}
      />

      <Section className="py-24 md:py-32" stagger={0}>
        <div className="container-x space-y-20 md:space-y-28">
          {t.opportunities.deals.map((d, i) => (
            <article
              key={i}
              className={`reveal grid items-center gap-10 md:grid-cols-12 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="md:col-span-7 md:[direction:ltr]">
                <TiltCard
                  max={5}
                  reveal={false}
                  className="relative aspect-[16/10] overflow-hidden shadow-[var(--shadow-lift)]"
                >
                  <Photo
                    src={DEAL_IMAGES[i]}
                    base={DEAL_IMAGE_BASES[i]}
                    alt={d.title}
                    sizes="(min-width: 768px) 680px, calc(100vw - 3rem)"
                    width={1600}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/25"
                  />
                </TiltCard>
              </div>
              <div className="flex flex-col justify-center md:col-span-5 md:[direction:ltr]">
                <p className="eyebrow">{d.tag}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {d.city}
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">{d.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-foreground/80">{d.body}</p>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                  <dt className="sr-only">{t.opportunities.dealParametersSr}</dt>
                  {d.meta.map((m, metaIdx) => (
                    <dd key={metaIdx} className="text-xs uppercase tracking-[0.16em] text-navy">
                      {m}
                    </dd>
                  ))}
                </dl>
                <Link
                  to="/contact"
                  className="group relative mt-8 inline-flex w-fit items-center gap-2 overflow-hidden border border-navy px-6 py-3 text-[0.7rem] uppercase tracking-[0.22em] transition-[transform,color] duration-500 hover:-translate-y-0.5 hover:text-ivory"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rtl:origin-right group-hover:scale-x-100"
                  />
                  <span className="relative z-10">{t.opportunities.ctaButton}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy" className="overflow-hidden py-24 md:py-32">
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
        <div className="container-x relative max-w-3xl text-center">
          <p className="reveal eyebrow">{t.opportunities.advisoryRoom.eyebrow}</p>
          <h2 className="reveal mt-6 font-display text-4xl md:text-5xl">
            {t.opportunities.advisoryRoom.title}
          </h2>
          <p className="reveal mt-6 text-ivory/75">{t.opportunities.advisoryRoom.body}</p>
          <Link
            to="/contact"
            className="reveal mt-10 inline-flex items-center gap-3 px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_rgba(192,160,99,0.9)]"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy-deep)" }}
          >
            {t.opportunities.advisoryRoom.button}
          </Link>
        </div>
      </Section>
    </SiteLayout>
  );
}

import { ArrowRight, Download } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { locales } from "@/i18n/config";
import { siteProfileData } from "@/lib/content/data/site";

// Internal review page for the design system (M1-T6). It 404s in production,
// so its labels are intentionally not localized; samples show both languages.

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "canvas", className: "bg-canvas" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-muted", className: "bg-surface-muted" },
  { name: "ink", className: "bg-ink" },
  { name: "body", className: "bg-body" },
  { name: "muted", className: "bg-muted" },
  { name: "border", className: "bg-border" },
  { name: "border-strong", className: "bg-border-strong" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-hover", className: "bg-accent-hover" },
  { name: "accent-soft", className: "bg-accent-soft" },
  { name: "accent-ink", className: "bg-accent-ink" },
  { name: "success", className: "bg-success" },
  { name: "success-soft", className: "bg-success-soft" },
  { name: "violet-soft", className: "bg-violet-soft" },
  { name: "violet-ink", className: "bg-violet-ink" },
  { name: "night", className: "bg-night" },
  { name: "night-raised", className: "bg-night-raised" },
  { name: "night-ink", className: "bg-night-ink" },
  { name: "night-muted", className: "bg-night-muted" },
];

// Real copy in both languages, to check diacritics and line lengths.
const samples = locales.map((lang) => ({
  lang,
  headline: siteProfileData.headline[lang],
  body: siteProfileData.summary[lang],
  hand: siteProfileData.hero.note[lang].replace("\n", " "),
}));

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-10">
      <h2 className="font-mono text-xs font-medium tracking-widest text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main id="main" className="flex-1">
      <Container className="flex flex-col gap-14 py-16">
        <SectionHeading
          title="Styleguide"
          description="Tokens and primitives from app/globals.css and components/ui. Tab through the page to check focus rings."
        />

        <Block title="Colors">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {swatches.map((swatch) => (
              <li key={swatch.name} className="flex flex-col gap-2">
                <span
                  className={`h-16 rounded-control border border-border ${swatch.className}`}
                />
                <code className="font-mono text-xs text-body">
                  {swatch.name}
                </code>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Typography — EN / VI">
          <div className="grid gap-12 lg:grid-cols-2">
            {samples.map((sample) => (
              <div
                key={sample.lang}
                lang={sample.lang}
                className="flex flex-col gap-5"
              >
                <p className="text-display text-ink">Bùi Hữu Tiến</p>
                <p className="text-lead text-ink">{sample.headline}</p>
                <p className="text-title">Selected Work · Dự án tiêu biểu</p>
                <p className="leading-relaxed">{sample.body}</p>
                <p className="text-sm text-muted">{sample.body}</p>
                <p className="font-hand text-2xl text-accent-ink">
                  {sample.hand}
                </p>
              </div>
            ))}
          </div>
          <pre className="overflow-x-auto rounded-card bg-night p-5 font-mono text-sm leading-relaxed text-night-ink">
            {`const ideas = ["Better products", "Happier users"];\n// Keep building...`}
          </pre>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              View Projects
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="secondary">
              <Download aria-hidden="true" />
              Download CV
            </Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="#main" size="lg">
              Large link
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <a
              href="mailto:hello@example.com"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Plain anchor (mailto)
            </a>
          </div>
        </Block>

        <Block title="Badges">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="success" dot>
              Available for new opportunities
            </Badge>
            <Badge tone="accent">EdTech</Badge>
            <Badge tone="success">Production</Badge>
            <Badge tone="violet">15K+ users</Badge>
            <Badge>Neutral</Badge>
            <span className="rounded-full bg-night p-2">
              <Badge tone="night">AI / LLM</Badge>
            </span>
          </div>
        </Block>

        <Block title="Card + SectionHeading">
          <Card className="p-6 sm:p-8">
            <SectionHeading
              title="Selected Work"
              description="A few products I've built and contributed to."
              action={
                <a
                  href="#main"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent hover:text-accent-hover"
                >
                  View all projects
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              }
            />
          </Card>
        </Block>
      </Container>
    </main>
  );
}

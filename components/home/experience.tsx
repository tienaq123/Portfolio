import { Briefcase, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { reveal } from "@/components/ui/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/i18n/dictionaries";
import type { ExperienceView } from "@/lib/content";

/** "2025-02" → "02/2025", the format used on the CV in both languages. */
const formatMonth = (yearMonth: string) =>
  `${yearMonth.slice(5, 7)}/${yearMonth.slice(0, 4)}`;

export async function Experience({ items }: { items: ExperienceView[] }) {
  const t = await getDictionary();

  return (
    <section
      id="about"
      aria-labelledby="experience-title"
      className="pt-12 pb-16 lg:pt-16 lg:pb-24"
    >
      <Container>
        <SectionHeading
          id="experience-title"
          title={t.home.experience.title}
          description={t.home.experience.description}
        />
        <ol className="relative mt-10 space-y-10 before:absolute before:top-2 before:bottom-2 before:left-1.75 before:w-px before:bg-border">
          {items.map((item, index) => {
            const Icon = item.type === "education" ? GraduationCap : Briefcase;
            return (
              <li
                key={item.id}
                {...reveal(index)}
                className="relative grid grid-cols-1 gap-4 pl-10 md:grid-cols-[9rem_minmax(0,17rem)_1fr] md:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 size-3.5 rounded-full border-3 border-accent bg-surface"
                />
                <p className="text-sm font-semibold text-ink">
                  <time dateTime={item.startDate}>
                    {formatMonth(item.startDate)}
                  </time>
                  {" – "}
                  {item.endDate ? (
                    <time dateTime={item.endDate}>
                      {formatMonth(item.endDate)}
                    </time>
                  ) : (
                    t.home.experience.present
                  )}
                </p>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
                    <Icon aria-hidden="true" className="size-5" />
                    <span className="sr-only">
                      {item.type === "education"
                        ? t.home.experience.education
                        : t.home.experience.work}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-bold">{item.organization}</h3>
                    <p className="text-sm text-muted">{item.role}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-muted"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

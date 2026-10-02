import { Container } from "@/components/ui/container";
import { reveal } from "@/components/ui/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TechBadge } from "@/components/ui/tech-badge";
import { getDictionary } from "@/i18n/dictionaries";
import type { SkillGroupView } from "@/lib/content";

export async function TechStack({ groups }: { groups: SkillGroupView[] }) {
  const t = await getDictionary();

  return (
    <section aria-labelledby="stack-title" className="pb-12 lg:pb-16">
      <Container>
        <SectionHeading
          id="stack-title"
          title={t.home.stack.title}
          description={t.home.stack.description}
        />
        <div className="mt-10 grid gap-8 lg:gap-6">
          {groups.map((group, index) => (
            <div
              key={group.key}
              {...reveal(index)}
              className="grid gap-3 lg:grid-cols-[11rem_1fr] lg:items-start"
            >
              <h3 className="text-sm font-semibold tracking-wide text-muted uppercase lg:pt-3">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <TechBadge name={skill} size="md" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

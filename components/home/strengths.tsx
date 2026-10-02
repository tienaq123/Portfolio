import {
  BrainCircuit,
  Cloud,
  CodeXml,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { reveal } from "@/components/ui/motion/reveal";
import { getDictionary } from "@/i18n/dictionaries";
import type { StrengthIconKey, StrengthView } from "@/lib/content";

const icons: Record<StrengthIconKey, LucideIcon> = {
  layers: Layers,
  code: CodeXml,
  brain: BrainCircuit,
  cloud: Cloud,
};

export async function Strengths({ strengths }: { strengths: StrengthView[] }) {
  const t = await getDictionary();

  return (
    <section aria-labelledby="strengths-title" className="py-12 lg:py-16">
      <Container>
        <SectionHeading
          id="strengths-title"
          title={t.home.strengths.title}
          description={t.home.strengths.description}
        />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((strength, index) => {
            const Icon = icons[strength.iconKey];
            return (
              <li key={strength.id} {...reveal(index)}>
                <Card className="h-full p-6">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-9 text-accent"
                  />
                  <h3 className="mt-5 text-lg font-bold">{strength.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    {strength.description}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

import {
  Box,
  CalendarDays,
  CodeXml,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/dictionaries";
import type { MetricIconKey, MetricView } from "@/lib/content";

const icons: Record<MetricIconKey, LucideIcon> = {
  calendar: CalendarDays,
  users: Users,
  code: CodeXml,
  box: Box,
};

export async function ProofStrip({ metrics }: { metrics: MetricView[] }) {
  const t = await getDictionary();

  return (
    <section aria-label={t.home.metricsLabel}>
      <Container>
        <ul className="grid gap-1 rounded-panel border border-border bg-surface/90 p-2 shadow-card backdrop-blur sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
          {metrics.map((metric) => {
            const Icon = icons[metric.iconKey];
            return (
              <li
                key={metric.id}
                className="flex items-center gap-4 p-4 lg:px-5"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent"
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-ink">{metric.value}</p>
                  <p className="text-sm font-semibold text-ink">
                    {metric.label}
                  </p>
                  {metric.description && (
                    <p className="text-xs text-muted">{metric.description}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

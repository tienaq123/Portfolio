import { cn } from "@/lib/utils";
import { TechLogo } from "./brand-icon";

type TechBadgeProps = { name: string; size?: "sm" | "md" };

export function TechBadge({ name, size = "sm" }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-border bg-surface font-medium whitespace-nowrap text-ink",
        size === "sm"
          ? "h-8 rounded-lg px-2.5 text-xs"
          : "h-11 rounded-control px-4 text-sm shadow-card",
      )}
    >
      <TechLogo
        name={name}
        className={cn("shrink-0", size === "sm" ? "size-4" : "size-5")}
      />
      {name}
    </span>
  );
}

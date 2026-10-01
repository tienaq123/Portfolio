import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "violet" | "night";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-body",
  accent: "bg-accent-soft text-accent-ink",
  success: "bg-success-soft text-success-ink",
  violet: "bg-violet-soft text-violet-ink",
  night: "bg-white/10 text-night-ink",
};

const dots: Record<Tone, string> = {
  neutral: "bg-muted",
  accent: "bg-accent",
  success: "bg-success",
  violet: "bg-violet-ink",
  night: "bg-night-ink",
};

type BadgeProps = { tone?: Tone; dot?: boolean } & ComponentProps<"span">;

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", dots[tone])}
        />
      )}
      {children}
    </span>
  );
}

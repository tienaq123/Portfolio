import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

export type ButtonStyleProps = { variant?: Variant; size?: Size };

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.125em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-accent hover:bg-accent-hover",
  secondary:
    "border border-border-strong bg-surface text-ink hover:border-ink/25 hover:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};

/** Button classes for elements that are not a Button/ButtonLink, e.g. a plain <a> for downloads or mailto. */
export function buttonVariants({
  variant = "primary",
  size = "md",
}: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonStyleProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** In-app navigation styled as a button. */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonStyleProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

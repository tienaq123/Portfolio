/** Joins class names, skipping falsy values. Does not resolve conflicting Tailwind utilities. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

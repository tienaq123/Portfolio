import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper: 1200px max, 16px side gutter on phones. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}

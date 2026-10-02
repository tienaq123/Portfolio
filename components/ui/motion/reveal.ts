import type { CSSProperties } from "react";

/**
 * Props that make an element fade and rise in the first time it scrolls into
 * view (CSS in app/globals.css, observer in ./motion-script.tsx). Spread them
 * on a wrapper, not on an element with its own transform or transition.
 *
 * `index` staggers siblings: each step delays the reveal by 80 ms.
 */
export function reveal(index = 0) {
  return {
    "data-reveal": "",
    // The motion script adds `data-revealed` before hydration.
    suppressHydrationWarning: true,
    ...(index > 0 && {
      style: { "--reveal-index": Math.min(index, 6) } as CSSProperties,
    }),
  };
}

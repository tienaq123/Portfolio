"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Sticky header that turns solid and blurred once the page has scrolled. */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-200 data-[scrolled=true]:border-border data-[scrolled=true]:bg-surface/85 data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}

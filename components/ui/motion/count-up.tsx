"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1100;
const NUMBER = /^(\D*)(\d+(?:\.\d+)?)(.*)$/;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts the number in a metric ("15K+", "~110K", "12.4K+") up from zero the
 * first time it scrolls into view. The server HTML always holds the final
 * value, so without JS, with reduced motion, or when the metric is already
 * on screen at load, nothing changes. Screen readers get the final value.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = NUMBER.exec(value);
    if (!element || !match) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already visible: resetting it to 0 would flicker.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const [, prefix = "", digits = "0", suffix = ""] = match;
    const target = Number(digits);
    const decimals = digits.split(".")[1]?.length ?? 0;
    const render = (n: number) => {
      element.textContent = `${prefix}${n.toFixed(decimals)}${suffix}`;
    };

    let frame = 0;
    render(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        render(target * easeOutCubic(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else element.textContent = value;
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = value;
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

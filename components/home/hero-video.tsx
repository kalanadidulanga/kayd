"use client";

import { useEffect, useState } from "react";

/**
 * The running system, as a silent loop over its own poster. The poster is
 * the page's image (and its largest paint); the video joins only on wide
 * screens, with motion welcome and no data-saver, and only once the page
 * is idle, so it never competes with the first paint.
 */
export function HeroVideo({ className }: { className?: string }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!wide || still || saver) return;
    const start = () => setPlay(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 2500 }) ?? window.setTimeout(start, 1200);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle));
  }, []);

  if (!play) return null;
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/visuals/system/hero-poster.webp"
      aria-hidden="true"
      onCanPlay={(e) => e.currentTarget.classList.add("is-playing")}
    >
      <source src="/visuals/system/hero-loop.webm" type="video/webm" />
      <source src="/visuals/system/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}

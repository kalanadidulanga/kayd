"use client";

import { useEffect, useRef, useState } from "react";

// Not downlink: Chrome rounds its estimate down hard (1.5 on a 4g link), so it
// marked real fast connections as slow. Data Saver and 2g/3g only.
type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * The running system, as a silent loop over its own poster. The poster is
 * the page's image (and its largest paint); the video joins only on wide
 * screens, with motion welcome, on a connection that is not slow or saving
 * data, and only once the page is idle. It pauses whenever it is off screen
 * or the tab is hidden, so it never decodes frames nobody sees.
 */
export function HeroVideo({ className }: { className?: string }) {
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: Connection }).connection;
    const slow = conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
    if (!wide || still || slow) return;
    const start = () => setPlay(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 2500 }) ?? window.setTimeout(start, 1200);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle));
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!play || !v) return;
    let visible = true;
    const sync = () => (visible && !document.hidden ? v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [play]);

  if (!play) return null;
  return (
    <video
      ref={ref}
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

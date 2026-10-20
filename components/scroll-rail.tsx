"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

type Marker = { id: string; label: string; at: number };

/**
 * The page's scrollbar, in place of the browser's: a fine line that fills
 * as you go, a thumb you can drag, a track you can click, and a dot for
 * each labelled scene ([data-rail-label]) at the point it starts. Up and
 * down buttons step from scene to scene, or by a screen where there are
 * none. Keyboard and wheel scrolling are untouched; on touch screens the
 * page scrolls as it always does.
 */
export function ScrollRail() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const thumbTop = useTransform(scrollYProgress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);
  const track = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [active, setActive] = useState(-1);
  const [atTop, setAtTop] = useState(true);

  const maxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

  useEffect(() => {
    const measure = () => {
      const max = maxScroll();
      setMarkers(
        [...document.querySelectorAll<HTMLElement>("main [data-rail-label][id]")].map((el) => ({
          id: el.id,
          label: el.dataset.railLabel!,
          at: Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / max)),
        }))
      );
    };
    const frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAtTop(v < 0.01);
    let i = -1;
    markers.forEach((m, j) => {
      if (m.at <= v + 0.02) i = j;
    });
    setActive(i);
  });

  function go(y: number, immediate = false) {
    if (lenis) lenis.scrollTo(y, { immediate });
    else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  }

  function ratioAt(clientY: number) {
    const r = track.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientY - r.top) / r.height));
  }

  function step(dir: 1 | -1) {
    const y = window.scrollY;
    const max = maxScroll();
    const stops = markers.map((m) => Math.round(m.at * max));
    const target =
      dir > 0
        ? (stops.find((t) => t > y + 8) ?? Math.min(max, y + window.innerHeight * 0.85))
        : ([...stops].reverse().find((t) => t < y - 8) ?? Math.max(0, y - window.innerHeight * 0.85));
    go(target);
    // Keyboard users arriving at the top land on the content, not a vanished button.
    if (target <= 0) document.getElementById("content")?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className="no-print pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-12 md:block">
        <div
          ref={track}
          aria-hidden="true"
          className="pointer-events-auto absolute right-[14px] top-[20vh] h-[60vh] w-5 cursor-pointer touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            go(ratioAt(e.clientY) * maxScroll());
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) go(ratioAt(e.clientY) * maxScroll(), true);
          }}
        >
          <span className="absolute inset-y-0 right-[9px] w-px bg-border-strong" />
          <motion.span style={{ scaleY: scrollYProgress }} className="absolute inset-y-0 right-[9px] w-px origin-top bg-brand" />
          <motion.span
            style={{ top: thumbTop }}
            className="absolute right-[5px] h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_4px_var(--brand-soft)]"
          />
        </div>
        {markers.length ? (
          <nav aria-label="Sections" className="pointer-events-none absolute right-[14px] top-[20vh] h-[60vh] w-5">
            {markers.map((m, i) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                aria-current={i === active ? "true" : undefined}
                onPointerDown={(e) => e.stopPropagation()}
                className="group pointer-events-auto absolute right-[4px] flex -translate-y-1/2 items-center gap-3"
                style={{ top: `${m.at * 100}%` }}
              >
                <span
                  className={cn(
                    "meta pointer-events-none whitespace-nowrap transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                    i === active ? "opacity-100" : "opacity-0"
                  )}
                >
                  {m.label}
                </span>
                <span
                  className={cn(
                    "block h-[11px] w-[11px] rounded-full border transition-colors duration-300",
                    i <= active ? "border-brand bg-brand/30" : "border-border-strong bg-background"
                  )}
                />
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="no-print glass fixed bottom-4 right-4 z-40 flex flex-col items-center rounded-full border border-border-strong p-1 shadow-soft">
        <button
          type="button"
          aria-label="Scroll up"
          onClick={() => step(-1)}
          disabled={atTop}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-brand disabled:opacity-30"
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </button>
        <span aria-hidden="true" className="my-0.5 h-px w-4 bg-brand" />
        <button
          type="button"
          aria-label="Scroll down"
          onClick={() => step(1)}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowDown aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

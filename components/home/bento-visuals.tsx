"use client";

import { motion } from "motion/react";

import { EASE } from "@/components/reveal";

const once = { once: true, margin: "0px 0px -15% 0px" } as const;

/** A tiny dashboard: a sidebar, chart bars that grow in, two table rows. */
export function DashboardViz() {
  const bars = [40, 65, 50, 85, 70, 95, 60];
  return (
    <div aria-hidden="true" className="mt-6 grid h-32 grid-cols-[72px_1fr] gap-2.5">
      <div className="rounded-xl border border-border bg-band" />
      <div className="flex flex-col gap-2">
        <div className="flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.i
              key={i}
              className="flex-1 origin-bottom rounded-t-md rounded-b-sm bg-gradient-to-b from-brand to-brand-soft"
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={once}
              transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            />
          ))}
        </div>
        <div className="h-3.5 rounded-md border border-border bg-band" />
        <div className="h-3.5 w-2/3 rounded-md border border-border bg-band" />
      </div>
    </div>
  );
}

/** A phone with a push notification that drops in. */
export function PhoneViz() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-6 h-36 w-24 overflow-hidden rounded-[22px] border border-border-strong bg-band">
      <motion.div
        className="absolute inset-x-2 top-4 flex h-9 items-center gap-1.5 rounded-xl border border-border-strong bg-surface px-2 text-[9px] text-muted-foreground"
        initial={{ y: -60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={once}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <b className="h-3.5 w-3.5 flex-none rounded bg-brand" />
        New update
      </motion.div>
    </div>
  );
}

/** A desktop window with a switch flicking on, like a tray app. */
export function DesktopViz() {
  return (
    <div aria-hidden="true" className="relative mt-6 h-32 overflow-hidden rounded-xl border border-border-strong bg-band">
      <div className="flex h-6 items-center gap-1.5 border-b border-border pl-2.5">
        <i className="h-2 w-2 rounded-full bg-border-strong" />
        <i className="h-2 w-2 rounded-full bg-border-strong" />
        <i className="h-2 w-2 rounded-full bg-border-strong" />
      </div>
      <motion.div
        className="absolute bottom-4 right-4 h-6 w-11 rounded-full bg-brand"
        initial={{ opacity: 0.3 }}
        whileInView={{ opacity: 1 }}
        viewport={once}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.span
          className="absolute top-1 h-4 w-4 rounded-full bg-white"
          initial={{ left: 4 }}
          whileInView={{ left: 24 }}
          viewport={once}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        />
      </motion.div>
    </div>
  );
}

/** Branches merging back into main, drawn as the tile comes into view. */
export function GraphViz() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: once,
    transition: { duration: 1.2, delay, ease: EASE },
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 220 120" fill="none" strokeWidth="2" className="mt-6 h-32 w-full">
      <path d="M20 10 V110" stroke="var(--border-strong)" />
      <motion.path d="M20 40 C 20 60, 70 55, 70 75 V110" stroke="var(--brand)" {...draw(0.2)} />
      <motion.path d="M20 30 C 20 50, 120 45, 120 65 V90 C 120 100, 20 95, 20 110" stroke="var(--subtle)" {...draw(0.4)} />
      <circle cx="20" cy="18" r="5" fill="var(--surface)" stroke="var(--muted-foreground)" />
      <circle cx="70" cy="80" r="5" fill="var(--surface)" stroke="var(--brand)" />
      <circle cx="120" cy="66" r="5" fill="var(--surface)" stroke="var(--subtle)" />
      <circle cx="20" cy="110" r="5" fill="var(--brand)" stroke="var(--brand)" />
    </svg>
  );
}

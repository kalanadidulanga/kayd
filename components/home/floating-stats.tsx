"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Building2, CalendarDays, FolderGit2, Layers3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { EASE } from "@/components/reveal";

// Icons are picked here by name: a server component cannot pass functions.
const ICONS = { projects: FolderGit2, clients: Building2, years: CalendarDays, tech: Layers3 };

export type Stat = { value: number; label: string; note?: string; icon: keyof typeof ICONS };

// Where each card floats on wide screens, and how far it drifts while the
// hero scrolls away. Different depths read as parallax. The right-hand pair
// sits above and below the output beam's fan.
const PLACES = [
  { cls: "xl:-left-48 xl:top-6", depth: -60 },
  { cls: "xl:-right-40 xl:-top-4", depth: -110 },
  { cls: "xl:-left-40 xl:-bottom-10", depth: -35 },
  { cls: "xl:-right-40 xl:-bottom-6", depth: -80 },
];

function Card({ stat, i, wide }: { stat: Stat; i: number; wide: boolean }) {
  const { scrollY } = useScroll();
  // Scroll-linked drift is movement too: none for reduced motion.
  const still = useReducedMotion();
  const y = useTransform(scrollY, [0, 900], [0, wide && !still ? PLACES[i].depth : 0]);
  const Icon = ICONS[stat.icon];
  return (
    <motion.li
      data-reveal=""
      style={{ y }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.1 + i * 0.12, ease: EASE }}
      className={cn(
        "glass shadow-soft group relative overflow-hidden rounded-2xl border border-border-strong p-4 text-left transition-colors duration-500 hover:border-brand/50 xl:pointer-events-auto xl:absolute xl:w-44",
        PLACES[i].cls
      )}
    >
      {/* A lit top edge and a corner glow in the accent. */}
      <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-brand to-transparent opacity-80" />
      <span aria-hidden="true" className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand opacity-[0.12] blur-2xl transition-opacity duration-500 group-hover:opacity-25" />
      <div className="relative flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-brand/25 bg-brand-soft text-brand">
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{stat.label}</span>
      </div>
      <p className="relative mt-3 flex items-baseline gap-1.5">
        <CountUp value={stat.value} className="text-4xl font-semibold tabular-nums tracking-[-0.04em]" />
        {stat.note ? <span className="text-xs text-subtle">{stat.note}</span> : null}
      </p>
    </motion.li>
  );
}

const WIDE = "(min-width: 1280px)";
function subscribeWide(onChange: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function isWide() {
  return window.matchMedia(WIDE).matches;
}

/**
 * The hero's stat cards. On wide screens they float around the code window
 * and drift at different depths; on narrower ones they sit in a grid below it.
 * The real values are in the HTML (see CountUp).
 */
export function FloatingStats({ stats }: { stats: Stat[] }) {
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);

  return (
    <ul
      data-testid="stats-strip"
      className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:pointer-events-none xl:absolute xl:inset-0 xl:mt-0 xl:block"
    >
      {stats.map((s, i) => (
        <Card key={s.label} stat={s} i={i} wide={wide} />
      ))}
    </ul>
  );
}

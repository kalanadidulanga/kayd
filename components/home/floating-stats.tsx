"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { EASE } from "@/components/reveal";

export type Stat = { value: number; label: string };

// Where each card floats on wide screens, and how far it drifts while the
// hero scrolls away. Different depths read as parallax.
const PLACES = [
  { cls: "lg:-left-40 lg:top-8", depth: -60 },
  { cls: "lg:-right-36 lg:top-24", depth: -110 },
  { cls: "lg:-left-24 lg:-bottom-8", depth: -35 },
  { cls: "lg:-right-28 lg:bottom-2", depth: -80 },
];

function Card({ stat, i, wide }: { stat: Stat; i: number; wide: boolean }) {
  const { scrollY } = useScroll();
  // Scroll-linked drift is movement too: none for reduced motion.
  const still = useReducedMotion();
  const y = useTransform(scrollY, [0, 900], [0, wide && !still ? PLACES[i].depth : 0]);
  return (
    <motion.li
      data-reveal=""
      style={{ y }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.1 + i * 0.12, ease: EASE }}
      className={cn(
        "glass shadow-soft rounded-2xl border border-border-strong px-4 py-3.5 text-left lg:absolute",
        PLACES[i].cls
      )}
    >
      <CountUp value={stat.value} className="font-mono text-3xl font-semibold tracking-tight" />
      <p className="mt-0.5 text-xs text-subtle">{stat.label}</p>
    </motion.li>
  );
}

const WIDE = "(min-width: 1024px)";
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
 * and drift at different depths; on small ones they sit in a grid below it.
 * The real values are in the HTML (see CountUp).
 */
export function FloatingStats({ stats }: { stats: Stat[] }) {
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);

  return (
    <ul
      data-testid="stats-strip"
      className="mt-4 grid grid-cols-2 gap-3 lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block"
    >
      {stats.map((s, i) => (
        <Card key={s.label} stat={s} i={i} wide={wide} />
      ))}
    </ul>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";

import { Reveal } from "@/components/reveal";

export type LogEntry = { when: string; title: string; where?: string; note?: string; head?: boolean };

/**
 * Roles as a `git log`: commits on a rail that draws itself as the reader
 * moves down the list.
 */
export function GitLog({ entries }: { entries: LogEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <ol ref={ref} className="relative pl-10">
      <span aria-hidden="true" className="absolute bottom-1.5 left-[11px] top-1.5 w-0.5 overflow-hidden rounded bg-border-strong">
        <motion.span
          className="absolute inset-0 origin-top bg-gradient-to-b from-brand to-transparent"
          style={{ scaleY: scrollYProgress }}
        />
      </span>
      {entries.map((e, i) => (
        <li key={`${e.title}-${e.when}`} className="relative pb-12 pl-5 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-9 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-brand bg-background shadow-[0_0_0_5px_var(--brand-soft)]"
          />
          <Reveal delay={i * 60}>
            <p className="font-mono text-[13px] lowercase text-brand">
              {e.when}
              {e.head ? " · HEAD" : null}
            </p>
            <p className="type-card mt-1.5">{e.title}</p>
            {e.where ? <p className="mt-1 text-muted-foreground">{e.where}</p> : null}
            {e.note ? <p className="mt-1.5 text-sm text-subtle">{e.note}</p> : null}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

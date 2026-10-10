"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/reveal";

/**
 * A line of words that rise out of a blur one after another: on load for
 * the hero, or when scrolled into view for section titles.
 */
export function Words({
  text,
  className,
  wordClassName,
  delay = 0,
  onView = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  /** seconds before the first word */
  delay?: number;
  /** start when scrolled into view instead of on mount */
  onView?: boolean;
}) {
  const words = text.split(" ");
  const from = { opacity: 0, y: 40, filter: "blur(14px)" };
  const to = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <motion.span
            data-reveal=""
            className={cn("inline-block will-change-transform", wordClassName)}
            initial={from}
            {...(onView
              ? { whileInView: to, viewport: { once: true, margin: "0px 0px -10% 0px" } }
              : { animate: to })}
            transition={{ duration: 1.1, delay: delay + i * 0.08, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

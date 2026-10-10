"use client";

import { motion } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Rises out of a soft blur the first time it scrolls into view.
 * data-reveal lets the noscript rule in the root layout show it at once
 * when JavaScript is off.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** milliseconds */
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

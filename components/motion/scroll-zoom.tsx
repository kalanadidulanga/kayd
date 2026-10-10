"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Grows from slightly small to full size as it scrolls up into view. Scale
 * only: it is often the page's largest image, so it is never shown faded.
 */
export function ScrollZoom({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <motion.div ref={ref} data-reveal="" style={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

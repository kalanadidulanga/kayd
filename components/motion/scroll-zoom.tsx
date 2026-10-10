"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Grows from slightly small to full size as it scrolls up into view. */
export function ScrollZoom({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div ref={ref} data-reveal="" style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { MotionConfig } from "motion/react";
import { ReactLenis } from "lenis/react";

/**
 * Smooth scrolling (Lenis) and one motion policy for the whole site.
 * reducedMotion="user": for visitors who ask for less motion, Motion drops
 * every movement and keeps a plain fade. Lenis turns its own smoothing off
 * for them too (respectReducedMotion is on by default).
 */
export function MotionProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.09, anchors: true, stopInertiaOnNavigate: true }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}

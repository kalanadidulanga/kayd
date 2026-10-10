"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUp } from "lucide-react";

import { EASE } from "@/components/reveal";

/** A round "back to top" button that shows once the visitor is a screen or so down. */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));
  const lenis = useLenis();

  function toTop() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    // Keyboard users land at the top too, not on a button that just vanished.
    document.getElementById("content")?.focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={toTop}
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 8 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="glass shadow-soft group grid h-10 w-10 place-items-center rounded-full border border-border-strong text-muted-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-cine group-hover:-translate-y-0.5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

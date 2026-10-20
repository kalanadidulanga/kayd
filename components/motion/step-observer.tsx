"use client";

import { useEffect, useRef } from "react";

/**
 * Writes data-step on the parent element: the index of the [data-step-at]
 * child nearest the middle of the screen. CSS turns that into state, such
 * as which part of a diagram is lit. Without JavaScript the attribute is
 * never set and the CSS shows every state at once.
 */
export function StepObserver() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    root.dataset.step = "0";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) root.dataset.step = (e.target as HTMLElement).dataset.stepAt ?? "0";
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    root.querySelectorAll("[data-step-at]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}

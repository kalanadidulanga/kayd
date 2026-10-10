"use client";

import { useEffect } from "react";

const PENDING = '[data-rise=""]:not([data-in])';

/**
 * Marks each [data-rise] element with data-in once it scrolls into view (or
 * is already above it); CSS does the animation. One observer for the whole
 * site instead of a client component per reveal. A MutationObserver picks up
 * elements that mount later, such as a newly opened tab or page.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    const watch = (root: ParentNode) => root.querySelectorAll(PENDING).forEach((el) => io.observe(el));
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        for (const n of r.addedNodes) {
          if (!(n instanceof Element)) continue;
          if (n.matches(PENDING)) io.observe(n);
          watch(n);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

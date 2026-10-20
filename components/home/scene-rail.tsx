"use client";

import { useEffect, useRef } from "react";

/**
 * A fine progress line down the right edge, with one dot per scene. The line
 * fills with the scroll (CSS); the dot of the scene in the middle of the
 * screen is marked aria-current. Scenes that did not render are dropped.
 */
export function SceneRail({ scenes }: { scenes: { id: string; label: string }[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>("a[data-scene-link]")];
    for (const a of links) if (!document.getElementById(a.dataset.sceneLink!)) a.hidden = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const a of links) a.toggleAttribute("aria-current", a.dataset.sceneLink === e.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    for (const a of links) {
      const el = document.getElementById(a.dataset.sceneLink!);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav ref={ref} aria-label="Sections" className="no-print fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <span aria-hidden="true" className="absolute bottom-1 right-[4px] top-1 w-px bg-border">
        <span className="rail-fill absolute inset-0 bg-brand" />
      </span>
      <ul className="relative flex flex-col items-end gap-5">
        {scenes.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              data-scene-link={s.id}
              className="group flex items-center gap-3 [&[aria-current]>span:last-child]:scale-125 [&[aria-current]>span:last-child]:bg-brand [&[aria-current]>span:first-child]:opacity-100"
            >
              <span className="meta pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {s.label}
              </span>
              <span className="block h-[9px] w-[9px] rounded-full border border-brand bg-background transition-[transform,background-color] duration-300" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

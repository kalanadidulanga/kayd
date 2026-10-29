"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useScroll } from "motion/react";

const MASK = "[mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]";

/**
 * Between the hero and the rest of the page, the camera descends through
 * the core into the stack, frame by frame with the scroll. The layout is
 * server-rendered (no shift), with the stack still underneath; the clip is
 * added on wide screens with motion welcome and no data-saver, and only
 * loads as it comes near. Phones get the still in the flow.
 */
export function SystemDescent() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef(0);
  const [near, setNear] = useState(false);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end end"] });

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!wide || still || saver || !box.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "150% 0px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = video.current;
    if (!v || !v.duration) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      v.currentTime = Math.min(v.duration - 0.05, Math.max(0, p) * v.duration);
    });
  });

  return (
    <>
      <div ref={box} aria-hidden="true" className="descent relative hidden h-[240vh] lg:block">
        <div className="descent-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <Image src="/visuals/system/stack.webp" alt="" fill sizes="100vw" className={`art object-cover ${MASK}`} />
          {near ? (
            <video
              ref={video}
              muted
              playsInline
              preload="auto"
              poster="/visuals/system/hero-poster.webp"
              src="/visuals/system/descent.mp4"
              className={`art absolute inset-0 h-full w-full object-cover ${MASK}`}
            />
          ) : null}
        </div>
      </div>
      <div aria-hidden="true" className="container py-10 lg:hidden">
        <Image src="/visuals/system/stack.webp" alt="" width={1600} height={900} sizes="100vw" className="art h-auto w-full [mask-image:radial-gradient(70%_70%_at_50%_50%,#000_55%,transparent)]" />
      </div>
    </>
  );
}

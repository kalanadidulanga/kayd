"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

const MASK = "[mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]";
/** Where the clip starts: by now the camera has moved past the hero's framing. */
const START = 2;

/**
 * One continuous shot from the hero into the system. On wide screens the
 * descent sits under the hero (see .descent in globals.css): as the hero
 * dives toward the core and fades, the clip fades in already moving, then
 * scrubs with the scroll down through the core into the stack. The clip
 * loads once the page is idle; phones and reduced motion see the stack as
 * a still, in the flow.
 */
export function SystemDescent() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef(0);
  const [load, setLoad] = useState(false);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!wide || still || saver) return;
    const start = () => setLoad(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 4000 }) ?? window.setTimeout(start, 2500);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = video.current;
    if (!v || !v.duration) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // Hold the first moving frame while the hero hands over, then descend.
      const t = Math.min(1, Math.max(0, (p - 0.15) / 0.85));
      v.currentTime = START + t * (v.duration - START - 0.05);
    });
  });

  return (
    <>
      <div ref={box} aria-hidden="true" className="descent pointer-events-none relative hidden lg:block">
        <motion.div style={{ opacity }} className="descent-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <Image src="/visuals/system/stack.webp" alt="" fill sizes="100vw" className={`art object-cover ${MASK}`} />
          {load ? (
            <video
              ref={video}
              muted
              playsInline
              preload="auto"
              src={`/visuals/system/descent.mp4#t=${START}`}
              className={`art absolute inset-0 h-full w-full object-cover ${MASK}`}
            />
          ) : null}
        </motion.div>
      </div>
      <div aria-hidden="true" className="container py-10 lg:hidden">
        <Image src="/visuals/system/stack.webp" alt="" width={1600} height={900} sizes="100vw" className="art h-auto w-full [mask-image:radial-gradient(70%_70%_at_50%_50%,#000_55%,transparent)]" />
      </div>
    </>
  );
}

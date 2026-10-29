"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { FrameScrub } from "@/components/home/frame-scrub";

const MASK = "[mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]";
/** 96 frames, 12 a second, from 2 s into the clip, where the camera has left the hero's framing. */
const FRAMES = 96;
const frameSrc = (n: number) => `/visuals/system/descent/${String(n).padStart(3, "0")}.avif`;

/**
 * Chapter titles over the film, each held for one beat of the scroll:
 * [fade in from, fully in, start out, gone]. Facts about the work only.
 */
const BEATS = [
  { at: [0.28, 0.33, 0.42, 0.47], title: "Every system has a core.", line: "The data and the rules a business runs on." },
  { at: [0.5, 0.55, 0.64, 0.69], title: "Then the logic.", line: "Permissions, scheduled jobs, the rules written into code." },
  { at: [0.71, 0.75, 0.82, 0.86], title: "Down through every layer.", line: "" },
] as const;

/** The five planes of the stack, top to bottom, at the end of the film. */
const LAYERS = [
  { name: "Interface", y: 18 },
  { name: "API", y: 32 },
  { name: "Services", y: 49 },
  { name: "Data", y: 65 },
  { name: "Infrastructure", y: 81 },
];

function Beat({ p, at, title, line }: { p: MotionValue<number>; at: readonly number[]; title: string; line: string }) {
  const opacity = useTransform(p, [...at], [0, 1, 1, 0]);
  const y = useTransform(p, [at[0], at[1]], [24, 0]);
  return (
    <motion.div style={{ opacity, y }} className="descent-caption absolute inset-x-0 bottom-[14vh] text-center">
      <p className="type-section [text-shadow:0_2px_30px_rgb(0_0_0/0.8)]">{title}</p>
      {line ? <p className="type-lead mx-auto mt-4 max-w-xl text-foreground/80 [text-shadow:0_2px_20px_rgb(0_0_0/0.9)]">{line}</p> : null}
    </motion.div>
  );
}

function Stack({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.9, 0.96], [0, 1]);
  return (
    <motion.div style={{ opacity }} className="descent-caption absolute inset-0">
      {LAYERS.map((l, i) => (
        <div key={l.name} className="absolute right-[74%] flex items-center gap-3" style={{ top: `${l.y}%` }}>
          <span className="meta text-foreground">{l.name}</span>
          <span className="h-px bg-brand" style={{ width: `${48 - i * 4}px` }} />
        </div>
      ))}
      <p className="type-title absolute bottom-[12vh] right-[9%] max-w-xs text-right">Built top to bottom.</p>
    </motion.div>
  );
}

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

  return (
    <>
      <div ref={box} aria-hidden="true" className="descent pointer-events-none relative hidden lg:block">
        <motion.div style={{ opacity }} className="descent-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <Image src="/visuals/system/stack.webp" alt="" fill sizes="100vw" className={`art object-cover ${MASK}`} />
          {load ? (
            // Hold the first frame while the hero hands over, then descend.
            <FrameScrub progress={scrollYProgress} count={FRAMES} src={frameSrc} start={0.15} className={`art absolute inset-0 h-full w-full ${MASK}`} />
          ) : null}
          {BEATS.map((b) => (
            <Beat key={b.title} p={scrollYProgress} {...b} />
          ))}
          <Stack p={scrollYProgress} />
        </motion.div>
      </div>
      <div aria-hidden="true" className="container py-10 lg:hidden">
        <Image src="/visuals/system/stack.webp" alt="" width={1600} height={900} sizes="100vw" className="art h-auto w-full [mask-image:radial-gradient(70%_70%_at_50%_50%,#000_55%,transparent)]" />
      </div>
    </>
  );
}

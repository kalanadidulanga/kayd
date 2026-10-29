"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

type Connection = { saveData?: boolean; effectiveType?: string; downlink?: number };

/**
 * A film scrubbed by the scroll, drawn from still frames on a canvas, the
 * way product pages do it: seeking a video on every scroll event makes the
 * browser decode from the last keyframe each time and re-request byte
 * ranges, which stutters on slow machines and wastes data on slow networks.
 *
 * Frames load coarse to fine (every 12th, then 6th, 3rd, all), four at a
 * time, so the scroll works from the first few hundred kilobytes and only
 * sharpens as the rest arrive. On a slow connection it stops at every 4th
 * frame. The canvas always shows the nearest frame it has.
 */
export function FrameScrub({
  progress,
  count,
  src,
  start,
  className,
}: {
  progress: MotionValue<number>;
  /** Number of frames, 1-based file names: 001, 002 ... */
  count: number;
  src: (n: number) => string;
  /** Progress at which the film begins to move. */
  start: number;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const want = useRef(0);
  const shown = useRef(-1);
  const raf = useRef(0);

  function draw() {
    raf.current = 0;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    // The nearest loaded frame to the one the scroll asks for.
    let i = -1;
    for (let d = 0; d < count; d++) {
      if (frames.current[want.current - d]) { i = want.current - d; break; }
      if (frames.current[want.current + d]) { i = want.current + d; break; }
    }
    if (i < 0 || i === shown.current) return;
    shown.current = i;
    const img = frames.current[i]!;
    // object-fit: cover, by hand.
    const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }

  const request = () => { if (!raf.current) raf.current = requestAnimationFrame(draw); };

  useMotionValueEvent(progress, "change", (p) => {
    const t = Math.min(1, Math.max(0, (p - start) / (1 - start)));
    want.current = Math.round(t * (count - 1));
    request();
  });

  useEffect(() => {
    const c = canvas.current!;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      shown.current = -1;
      request();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);

    const conn = (navigator as Navigator & { connection?: Connection }).connection;
    const slow = conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "") || (conn?.downlink ?? 10) < 3;
    const strides = slow ? [12, 4] : [12, 6, 3, 1];
    const order: number[] = [];
    for (const s of strides) for (let i = 0; i < count; i += s) if (!order.includes(i)) order.push(i);
    if (!order.includes(count - 1)) order.splice(1, 0, count - 1);

    let cancelled = false;
    let next = 0;
    const load = () => {
      if (cancelled || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.src = src(i + 1);
      img.decode().then(
        () => {
          if (cancelled) return;
          frames.current[i] = img;
          if (Math.abs(i - want.current) < Math.abs(shown.current - want.current) || shown.current < 0) { shown.current = -1; request(); }
          load();
        },
        () => load()
      );
    };
    for (let k = 0; k < 4; k++) load();

    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return <canvas ref={canvas} aria-hidden="true" className={className} />;
}

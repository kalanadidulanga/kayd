"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

// Not downlink: Chrome rounds its estimate down hard (1.5 on a 4g link), so it
// marked real fast connections as slow. Data Saver and 2g/3g only.
type Connection = { saveData?: boolean; effectiveType?: string };

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

  function cover(ctx: CanvasRenderingContext2D, c: HTMLCanvasElement, img: HTMLImageElement) {
    // object-fit: cover, by hand.
    const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }

  /**
   * Draws the exact point the scroll asks for, between frames: the loaded
   * frame below it, then the loaded frame above it on top, as much as the
   * point has moved toward it. A crossfade instead of a jump, so the film
   * moves continuously however few frames have arrived.
   */
  function draw() {
    raf.current = 0;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const at = want.current;
    let lo = Math.floor(at), hi = Math.ceil(at);
    while (lo >= 0 && !frames.current[lo]) lo--;
    while (hi < count && !frames.current[hi]) hi++;
    const below = lo >= 0 ? frames.current[lo] : null;
    const above = hi < count ? frames.current[hi] : null;
    if (!below && !above) return;
    const key = Math.round(at * 100);
    if (key === shown.current) return;
    shown.current = key;
    ctx.globalAlpha = 1;
    cover(ctx, c, (below ?? above)!);
    if (below && above && hi !== lo) {
      ctx.globalAlpha = (at - lo) / (hi - lo);
      cover(ctx, c, above);
      ctx.globalAlpha = 1;
    }
  }

  const request = () => { if (!raf.current) raf.current = requestAnimationFrame(draw); };

  useMotionValueEvent(progress, "change", (p) => {
    const t = Math.min(1, Math.max(0, (p - start) / (1 - start)));
    want.current = t * (count - 1);
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
    const slow = conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
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
          // Each new frame may be a closer neighbour of the playhead: redraw.
          shown.current = -1;
          request();
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

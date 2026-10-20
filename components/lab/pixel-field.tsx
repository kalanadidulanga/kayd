"use client";

import { useEffect, useRef } from "react";

const CELL = 14;

/**
 * Cursor field: a grid of green pixels that wakes up around the pointer and
 * settles again when it leaves. Canvas, driven by requestAnimationFrame only
 * while something is changing. Under reduced motion it draws one still frame
 * and ignores the pointer. The canvas is decoration; the experiment is
 * described in text beside it.
 */
export function PixelField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0, rows = 0, frame = 0;
    let heat = new Float32Array(0);
    let seed = new Float32Array(0);
    const pointer = { x: -1e4, y: -1e4, on: false };

    const color = () => getComputedStyle(canvas).getPropertyValue("--brand").trim() || "#67e39b";

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      heat = new Float32Array(cols * rows);
      seed = Float32Array.from({ length: cols * rows }, (_, i) => {
        // A fixed, gentle pattern: brighter towards one corner, with noise.
        const x = (i % cols) / cols, y = Math.floor(i / cols) / rows;
        return 0.05 + 0.25 * Math.max(0, 1 - Math.hypot(x - 0.8, y - 0.3) * 1.6) * ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) / 2;
      });
      draw();
    }

    function draw() {
      const fill = color();
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.fillStyle = fill;
      let active = false;
      for (let i = 0; i < heat.length; i++) {
        const cx = (i % cols) * CELL + CELL / 2, cy = Math.floor(i / cols) * CELL + CELL / 2;
        if (pointer.on) {
          const d = Math.hypot(cx - pointer.x, cy - pointer.y);
          if (d < 120) heat[i] = Math.max(heat[i], 1 - d / 120);
        }
        heat[i] *= 0.94;
        if (heat[i] > 0.01) active = true;
        const a = Math.min(1, seed[i] + heat[i]);
        if (a < 0.04) continue;
        ctx!.globalAlpha = a;
        const s = 3 + heat[i] * (CELL - 6);
        ctx!.fillRect(cx - s / 2, cy - s / 2, s, s);
      }
      ctx!.globalAlpha = 1;
      frame = active || pointer.on ? requestAnimationFrame(draw) : 0;
    }

    function move(e: PointerEvent) {
      if (still) return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
      if (!frame) frame = requestAnimationFrame(draw);
    }
    const leave = () => (pointer.on = false);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} style={{ touchAction: "pan-y" }} />;
}

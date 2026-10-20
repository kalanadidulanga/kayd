"use client";

import { useEffect, useRef } from "react";

const CHARS = " .·:-=+*<>/{};01#";
const CW = 14;
const CH = 18;

/**
 * Code soil: a field of characters at the foot of the hero that the Atlas
 * grows out of. Brightness is a slow, shifting mound, so characters change
 * as it breathes; a fine pointer stirs it. About twenty frames a second, and
 * only while the hero is on screen and the tab is visible. Under reduced
 * motion it draws one still frame.
 */
export function HeroSoil({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = canvas.parentElement!;
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, visible = true;
    const pointer = { x: -1e4, y: -1e4, heat: 0 };
    let color = "#67e39b";

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CW);
      rows = Math.ceil(h / CH);
      color = getComputedStyle(canvas).getPropertyValue("--brand").trim() || color;
      ctx!.font = `12px ${getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace"}, monospace`;
      ctx!.textBaseline = "middle";
      ctx!.textAlign = "center";
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = color;
      // Centred on the Atlas trunk (69% across the artwork).
      const cx = w * 0.69;
      for (let r = 0; r < rows; r++) {
        const y = r * CH + CH / 2;
        for (let c = 0; c < cols; c++) {
          const x = c * CW + CW / 2;
          // A mound rising toward the Atlas's trunk, breathing slowly.
          const dx = (x - cx) / (w * 0.42);
          const dy = (h - y) / (h * 0.95);
          const mound = Math.max(0, 1 - dx * dx - dy * dy);
          const wave = 0.5 + 0.5 * Math.sin(x * 0.021 + t * 0.0007) * Math.cos(y * 0.035 - t * 0.0005 + c * 0.13);
          const near = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 140) * pointer.heat;
          const v = Math.min(1, mound * (0.25 + 0.75 * wave) + near * 0.8);
          if (v < 0.12) continue;
          ctx!.globalAlpha = v * 0.6;
          ctx!.fillText(CHARS[Math.min(CHARS.length - 1, Math.floor(v * CHARS.length))], x, y);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (t - last < 50) return;
      last = t;
      pointer.heat *= 0.96;
      draw(t);
    }

    function start() {
      if (still) return draw(0);
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const onMove = (e: PointerEvent) => {
      if (still || e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.heat = 1;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    host.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

"use client";

import { cn } from "@/lib/utils";

/**
 * A surface with a soft accent light that follows the pointer. The light is
 * pure CSS; this component only feeds it the pointer position.
 */
export function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group/spot relative overflow-hidden rounded-[22px] border border-border-strong bg-surface",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--x,50%)_var(--y,50%),var(--brand-soft),transparent_45%)]",
        className
      )}
    >
      {children}
    </div>
  );
}

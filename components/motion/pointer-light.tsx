"use client";

import { cn } from "@/lib/utils";

/**
 * A soft local light that follows a fine pointer across its children. The
 * position goes straight into CSS variables, never into React state, and the
 * light itself is CSS (.pointer-light), which hides it on touch screens and
 * under reduced motion.
 */
export function PointerLight({
  children,
  className,
  ...rest
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn("relative", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--px", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--py", `${e.clientY - r.top}px`);
        e.currentTarget.style.setProperty("--pl-on", "1");
      }}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--pl-on", "0")}
    >
      <span aria-hidden="true" className="pointer-light" />
      {children}
    </div>
  );
}

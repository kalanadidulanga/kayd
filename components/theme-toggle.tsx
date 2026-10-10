"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

/**
 * One button between light and dark. Where the browser has View
 * Transitions, the new theme opens as a circle from the button; elsewhere,
 * and under reduced motion, it switches at once.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const apply = () => {
      // Apply the class directly so the transition's "new" snapshot has it;
      // next-themes then persists the same value.
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    const box = e.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => flushSync(apply));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 700,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={mounted ? `Switch to ${next} theme` : "Switch theme"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:bg-brand-soft",
        className
      )}
    >
      {isDark ? <Icons.sun className="h-4 w-4" /> : <Icons.moon className="h-4 w-4" />}
    </button>
  );
}

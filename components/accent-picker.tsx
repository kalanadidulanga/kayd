"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Keep in step with accentScript in app/layout.tsx and the data-accent
// blocks in app/globals.css.
const ACCENTS = [
  { id: "indigo", label: "Indigo", swatch: "#8b7cf6" },
  { id: "emerald", label: "Emerald", swatch: "#34d399" },
  { id: "ember", label: "Ember", swatch: "#ff8a4c" },
] as const;

type AccentId = (typeof ACCENTS)[number]["id"];

/** Lets the visitor choose the one accent colour; remembered per browser. */
export function AccentPicker({ className }: { className?: string }) {
  const [accent, setAccent] = React.useState<AccentId>("indigo");

  React.useEffect(() => {
    // The pre-paint script already applied the stored choice; mirror it.
    const current = document.documentElement.dataset.accent as AccentId;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ACCENTS.some((a) => a.id === current)) setAccent(current);
  }, []);

  function choose(id: AccentId) {
    document.documentElement.setAttribute("data-accent", id);
    try {
      localStorage.setItem("kayd-accent", id);
    } catch {
      // Storage can be blocked; the choice then lasts for this page only.
    }
    setAccent(id);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Accent colour"
      className={cn(
        "glass shadow-soft flex items-center gap-2 rounded-full border border-border-strong px-3 py-2",
        className
      )}
    >
      <span className="hidden font-mono text-[11px] text-subtle sm:inline">accent</span>
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={accent === a.id}
          aria-label={a.label}
          onClick={() => choose(a.id)}
          className={cn(
            "h-5 w-5 rounded-full border-2 border-border-strong transition-transform duration-200 ease-cine hover:scale-110",
            accent === a.id && "outline-2 outline-offset-2 outline-foreground"
          )}
          style={{ background: a.swatch, outlineStyle: accent === a.id ? "solid" : undefined }}
        />
      ))}
    </div>
  );
}

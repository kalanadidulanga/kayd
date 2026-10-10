import { Fragment } from "react";

import { cn } from "@/lib/utils";

/**
 * A line of words that rise out of a blur one after another: on load for
 * the hero, or when scrolled into view for section titles. Pure CSS, like
 * Reveal (see [data-rise] in globals.css).
 */
export function Words({
  text,
  className,
  wordClassName,
  delay = 0,
  onView = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  /** seconds before the first word */
  delay?: number;
  /** start when scrolled into view instead of on load */
  onView?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span
            data-rise={onView ? "" : "load"}
            data-word=""
            className={cn("inline-block", wordClassName)}
            style={{ "--rise-delay": `${Math.round((delay + i * 0.08) * 1000)}ms` } as React.CSSProperties}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

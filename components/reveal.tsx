export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Rises out of a soft blur the first time it scrolls into view, or at once
 * with `immediate`, for content on screen at load. CSS does the motion (see
 * [data-rise] in globals.css) and RevealObserver only marks what came into
 * view, so nothing waits on hydration: above-the-fold text paints early.
 * The hidden state needs the `js` class on <html>, so with JavaScript off
 * everything simply shows.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  /** milliseconds */
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  return (
    <div
      data-rise={immediate ? "load" : ""}
      className={className}
      style={delay ? ({ "--rise-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

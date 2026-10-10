"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type Token = { text: string; kind?: "key" | "str" | "comment" };
export type CodeLine = Token[];

const COLOR: Record<NonNullable<Token["kind"]>, string> = {
  key: "text-brand",
  str: "text-foreground",
  comment: "text-subtle",
};

const TOTAL_OF = (lines: CodeLine[]) =>
  lines.reduce((n, l) => n + l.reduce((m, t) => m + t.text.length, 0) + 1, 0);

/** The first `count` characters of the code, line by line, colours kept. */
function visibleLines(lines: CodeLine[], count: number): CodeLine[] {
  const out: CodeLine[] = [];
  let left = count;
  for (const line of lines) {
    if (left <= 0) break;
    const shownLine: CodeLine = [];
    for (const t of line) {
      if (left <= 0) break;
      shownLine.push({ ...t, text: t.text.slice(0, left) });
      left -= t.text.length;
    }
    out.push(shownLine);
    left -= 1; // the newline
  }
  return out;
}

function Code({ lines, partial = false }: { lines: CodeLine[]; partial?: boolean }) {
  return lines.map((line, i) => (
    <span key={i}>
      {line.map((t, j) => (
        <span key={j} className={t.kind ? COLOR[t.kind] : undefined}>
          {t.text}
        </span>
      ))}
      {i < lines.length - 1 || !partial ? "\n" : null}
    </span>
  ));
}

/**
 * A small editor window that types out a truthful object about Kalana.
 * The full text is in the HTML; typing starts only once it is on screen,
 * and not at all for visitors who prefer reduced motion.
 */
export function CodeWindow({ file, lines }: { file: string; lines: CodeLine[] }) {
  const total = TOTAL_OF(lines);
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(total);

  useEffect(() => {
    if (!inView || reduce) return;
    let n = 0;
    let raf = 0;
    const step = () => {
      n = Math.min(total, n + 2);
      setShown(n);
      if (n < total) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, total]);

  const visible = visibleLines(lines, shown);
  const all = visibleLines(lines, total);
  const caret = (
    <span className="inline-block h-4.25 w-2 translate-y-0.75 animate-[blink_1s_steps(1)_infinite] bg-brand motion-reduce:animate-none" />
  );
  return (
    <div className="shadow-soft overflow-hidden rounded-2xl border border-border-strong bg-surface text-left">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-2 font-mono text-xs text-subtle">{file}</span>
      </div>
      <pre
        ref={ref}
        className="overflow-x-auto whitespace-pre-wrap px-6 py-6 font-mono text-[13px] leading-7 text-muted-foreground md:text-sm"
      >
        {/* Both layers share one grid cell: the invisible full text holds the
            final size, so the page below never moves while the code types. */}
        <span aria-hidden="true" className="grid">
          <span className="invisible col-start-1 row-start-1">
            <Code lines={all} />
            {caret}
          </span>
          <span className="col-start-1 row-start-1">
            <Code lines={visible} partial={shown < total} />
            {caret}
          </span>
        </span>
        <span className="sr-only">{lines.map((l) => l.map((t) => t.text).join("")).join("\n")}</span>
      </pre>
    </div>
  );
}

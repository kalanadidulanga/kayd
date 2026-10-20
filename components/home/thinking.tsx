import Link from "next/link";

import { Scene, SceneHeading } from "@/components/scene";
import { StepObserver } from "@/components/motion/step-observer";
import { Experiences } from "@/config/experience";

/**
 * Four principles, each proven by a decision already documented on a real
 * project (config/experience.ts `decisions`). The quoted text is read from
 * the config, so it cannot drift from the project page.
 */
export const PRINCIPLES = [
  { title: "Understand the operation", line: "Model the business the way it really runs.", project: "hotel-management-system", decision: 3, tag: "operation" },
  { title: "Make complexity legible", line: "Say what the system knows, and what it does not.", project: "kendara", decision: 4, tag: "legibility" },
  { title: "Build for reliability", line: "Give every critical job a second way to run.", project: "operations-crm-platform", decision: 1, tag: "reliability" },
  { title: "Refine the last interaction", line: "Finish the work where a person meets it.", project: "kayd-invoice-studio", decision: 1, tag: "interaction" },
] as const;

// Stations on the schematic, and the path between them, in a 400 x 520 box.
const STATIONS = [
  [90, 70],
  [300, 190],
  [110, 330],
  [290, 450],
] as const;
const PATH = "M90 70 C 220 70, 300 110, 300 190 S 110 250, 110 330 S 290 380, 290 450";

/**
 * How I think: one schematic that changes state as each principle reaches
 * the middle of the screen (StepObserver). Without JavaScript, or with
 * reduced motion, the schematic is simply fully lit.
 */
export function Thinking() {
  return (
    <Scene id="how-i-think" tone="deep" texture="contour" light={[25, 40]} edge="fog">
      <div className="container">
        <SceneHeading title="How I think" lead="Four habits, each shown by a decision on a real project." />
        <div className="steps grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <StepObserver />
          <div className="hidden lg:block">
            <svg
              viewBox="0 0 400 520"
              role="img"
              aria-label="A path through four stations: operation, legibility, reliability and the last interaction."
              className="sticky top-32 w-full max-w-md text-brand"
            >
              <path d={PATH} fill="none" stroke="var(--border-strong)" strokeWidth="1" />
              <path className="step-path" d={PATH} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.5" />
              {STATIONS.map(([x, y], i) => (
                <g key={i} className="step-part" data-from={i}>
                  <circle cx={x} cy={y} r="22" fill="var(--fog-strong)" />
                  <circle cx={x} cy={y} r="5" fill="currentColor" />
                  <circle cx={x} cy={y} r="34" fill="none" stroke="currentColor" strokeOpacity="0.35" />
                  <text x={x + (x > 200 ? -48 : 48)} y={y + 4} textAnchor={x > 200 ? "end" : "start"} className="fill-[var(--muted-foreground)] font-mono text-[11px]">
                    {PRINCIPLES[i].tag}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <ol className="space-y-6 lg:space-y-0">
            {PRINCIPLES.map((p, i) => {
              const project = Experiences.find((e) => e.id === p.project)!;
              return (
                <li key={p.title} data-step-at={i} className="step-text lg:flex lg:min-h-[62vh] lg:items-center">
                  <div data-rise="" className="max-w-xl border-l border-border-strong pl-6">
                    <h3 className="type-title">{p.title}</h3>
                    <p className="type-lead mt-3">{p.line}</p>
                    <blockquote className="mt-6 text-[17px] leading-relaxed">{project.decisions?.[p.decision]}</blockquote>
                    <Link href={`/work/${project.id}`} className="meta mt-3 inline-block text-brand hover:underline">
                      {project.companyName}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Scene>
  );
}

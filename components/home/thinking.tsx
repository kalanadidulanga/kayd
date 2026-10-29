import Link from "next/link";

import { Scene, SceneHeading } from "@/components/scene";
import { Experiences } from "@/config/experience";

/**
 * Four principles, each proven by a decision already documented on a real
 * project (config/experience.ts `decisions`). The quoted text is read from
 * the config, so it cannot drift from the project page.
 */
const PRINCIPLES = [
  { title: "Understand the operation", line: "Model the business the way it really runs.", project: "hotel-management-system", decision: 3 },
  { title: "Make complexity legible", line: "Say what the system knows, and what it does not.", project: "kendara", decision: 4 },
  { title: "Build for reliability", line: "Give every critical job a second way to run.", project: "operations-crm-platform", decision: 1 },
  { title: "Refine the last interaction", line: "Finish the work where a person meets it.", project: "kayd-invoice-studio", decision: 1 },
] as const;

/**
 * How I think: four rows, read at a glance. Each row is the habit, the real
 * decision that shows it, and the project it comes from. Nothing moves on
 * scroll; a row only answers the pointer.
 */
export function Thinking() {
  return (
    <Scene id="how-i-think" data-rail-label="How I think" tone="deep" light={[25, 40]} edge="fog">
      <div className="container">
        <SceneHeading tag={{ layer: "logic", name: "checks" }} title="How I think" lead="Four habits, each shown by a decision on a real project." />
        <ul className="border-t border-border">
          {PRINCIPLES.map((p) => {
            const project = Experiences.find((e) => e.id === p.project)!;
            return (
              <li key={p.title} data-principle="" data-rise="" className="border-b border-border">
                <Link
                  href={`/work/${project.id}`}
                  className="group grid gap-x-10 gap-y-3 py-8 md:grid-cols-12 md:py-10"
                >
                  <span className="flex gap-4 md:col-span-5">
                    {/* A check that closes into a tick as the row arrives. */}
                    <svg aria-hidden="true" viewBox="0 0 28 28" className="check mt-0.5 h-7 w-7 shrink-0 text-brand">
                      <circle className="check-ring" cx="14" cy="14" r="12" pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-90 14 14)" />
                      <path className="check-tick" d="M8.5 14.5l3.5 3.5 7.5-8" pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                    <span className="type-card block transition-colors group-hover:text-brand">{p.title}</span>
                    <span className="mt-1.5 block text-muted-foreground">{p.line}</span>
                    </span>
                  </span>
                  <blockquote className="text-[17px] leading-relaxed md:col-span-5">{project.decisions?.[p.decision]}</blockquote>
                  <span className="meta flex items-start gap-3 md:col-span-2 md:justify-end">
                    <span className="text-brand">{project.companyName}</span>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 hidden h-px w-4 shrink-0 bg-brand transition-[width] duration-300 ease-cine group-hover:w-7 md:block"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Scene>
  );
}

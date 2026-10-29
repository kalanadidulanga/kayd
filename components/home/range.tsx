import Link from "next/link";
import { Globe, Monitor, ShoppingBag, Smartphone, Users } from "lucide-react";

import { Scene, SceneHeading } from "@/components/scene";
import { Experiences, type ExperienceInterface } from "@/config/experience";
import { profile } from "@/config/profile";
import { siteStats } from "@/lib/stats";
import { projectPlatform } from "@/lib/work";

/**
 * Five lanes, one per discipline, each holding the listed projects that sit
 * in it. Leadership is the projects Kalana led a team on. A project can run
 * in more than one lane, as a store is both web and commerce.
 */
const LANES: { key: string; title: string; href: string; icon: typeof Globe; test: (e: ExperienceInterface) => boolean }[] = [
  { key: "web", title: "Web platforms", href: "/work?platform=web", icon: Globe, test: (e) => projectPlatform(e) === "web" },
  { key: "mobile", title: "Mobile apps", href: "/work?platform=mobile", icon: Smartphone, test: (e) => projectPlatform(e) === "mobile" },
  { key: "desktop", title: "Windows software", href: "/work?platform=desktop", icon: Monitor, test: (e) => projectPlatform(e) === "desktop" },
  { key: "commerce", title: "Commerce and POS", href: "/work?domain=commerce", icon: ShoppingBag, test: (e) => e.domain === "commerce" },
  { key: "team", title: "Technical leadership", href: "/work?ownership=team", icon: Users, test: (e) => e.team === "led" },
];

const dated = Experiences.filter((e) => e.startDate);
const firstYear = Math.min(...dated.map((e) => e.startDate!.getUTCFullYear()));
// The board ends at the month it was built (the home page rebuilds daily).
const today = new Date();
const from = Date.UTC(firstYear, 0, 1);
const to = Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1);
const lastYear = today.getUTCFullYear() + 1;
/** Where a date sits along the track, in percent. */
const x = (d: Date) => ((d.getTime() - from) / (to - from)) * 100;
const YEARS = Array.from({ length: lastYear - firstYear }, (_, i) => firstYear + i);

/** Blocks closer than this (in percent of the track) stack instead of overlapping. */
const GAP = 3.6;

function place(projects: ExperienceInterface[]) {
  const rows: number[] = [];
  return [...projects]
    .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime())
    .map((e) => {
      const at = x(e.startDate!);
      let row = rows.findIndex((end) => at - end >= GAP);
      if (row < 0) row = rows.push(-Infinity) - 1;
      rows[row] = at;
      return { e, at, row };
    });
}

/**
 * Range, as a release board: every project is a block in its discipline's
 * lane, placed at the month it started. Left to right it is the years; top
 * to bottom, the kinds of software. Pointing at a lane brings it forward and
 * dims the rest; pointing at a block names the project. CSS only.
 */
export function Range() {
  const lanes = LANES.map((l) => ({ ...l, blocks: place(dated.filter(l.test)), count: Experiences.filter(l.test).length }));

  return (
    <Scene id="range" data-rail-label="Range" light={[70, 50]}>
      <div className="container">
        <SceneHeading
          tag={{ layer: "services", name: "range" }}
          title="Range"
          lead={
            <>
              <span data-testid="stats-strip">
                {siteStats.projects} projects, {siteStats.clients} clients, {siteStats.technologies} technologies, since {profile.experienceSince}.
              </span>{" "}
              Each block is one project, in every lane it belongs to, at the month it started.
            </>
          }
        />

        <div className="range-board relative pt-8">
          {/* A faint column at the start of each year, behind the lanes. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:left-[calc(17rem+2rem)] md:block">
            <div className="absolute inset-y-0 inset-x-3">
              {YEARS.map((y) => (
                <span key={y} className="absolute inset-y-0 border-l border-dashed border-border" style={{ left: `${x(new Date(Date.UTC(y, 0, 1)))}%` }} />
              ))}
            </div>
          </div>
          <ul className="range-lanes relative">
            {lanes.map((l) => {
              const Icon = l.icon;
              const rows = Math.max(1, ...l.blocks.map((b) => b.row + 1));
              const reach = Math.max(0, ...l.blocks.map((b) => b.at));
              return (
                <li key={l.key} data-lane={l.key} className="range-lane group/lane grid items-center gap-x-8 gap-y-4 border-b border-border py-6 transition-opacity duration-300 first:border-t md:grid-cols-[17rem_minmax(0,1fr)]">
                  <Link href={l.href} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border-strong text-brand transition-colors group-hover/lane:border-brand group-hover/lane:bg-brand group-hover/lane:text-on-brand">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="type-card flex-1 transition-colors group-hover/lane:text-brand">{l.title}</span>
                    <span className="meta tabular-nums">{l.count}</span>
                  </Link>
                  <ol aria-label={`${l.title}: ${l.count} projects`} className="range-track relative mx-3 h-[calc(var(--rows)*16px)] md:h-[calc(var(--rows)*24px)]" style={{ "--rows": rows } as React.CSSProperties}>
                    {/* The lane's line, lit from the first year to its latest project. */}
                    <span aria-hidden="true" className="range-line absolute left-0 top-[5px] md:top-[9px] h-px origin-left bg-brand/45" style={{ width: `${reach}%` }} />
                    {l.blocks.map(({ e, at, row }) => (
                      <li key={e.id} className="absolute top-[calc(var(--r)*16px)] -translate-x-1/2 md:top-[calc(var(--r)*24px)]" style={{ left: `${at}%`, "--r": row } as React.CSSProperties}>
                        <Link
                          href={`/work/${e.id}`}
                          className="group/block relative block h-[11px] w-[11px] rounded-[3px] md:h-[18px] md:w-[18px] md:rounded-[5px] border border-brand/70 bg-brand/25 transition-[background-color,scale] duration-200 hover:scale-125 hover:bg-brand focus-visible:scale-125 focus-visible:bg-brand"
                        >
                          <span className="sr-only">{e.companyName}</span>
                          <span
                            aria-hidden="true"
                            className="glass pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-border-strong px-3 py-1 text-[12px] opacity-0 transition-opacity duration-200 group-hover/block:opacity-100 group-focus-visible/block:opacity-100"
                          >
                            {e.companyName}
                            <span className="meta ml-2 text-[11px]">{e.startDate!.getUTCFullYear()}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>

          {/* Year marks under the tracks. */}
          <div aria-hidden="true" className="relative mt-3 h-5 md:ml-[calc(17rem+2rem)]">
            <div className="absolute inset-x-3">
              {YEARS.map((y) => (
                <span key={y} className="meta absolute -translate-x-1/2" style={{ left: `${x(new Date(Date.UTC(y, 0, 1)))}%` }}>
                  {y}
                </span>
              ))}
              <span className="meta absolute right-0 translate-x-1/2 text-brand">now</span>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}

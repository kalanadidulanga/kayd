import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PointerLight } from "@/components/motion/pointer-light";
import { HeroVideo } from "@/components/home/hero-video";
import { Experiences } from "@/config/experience";
import { projectPlatform } from "@/lib/work";

type Node = {
  label: string;
  href: string;
  /** One real project that lives in this domain. */
  project: string;
  /** Centre and width of the matching module cluster, in percent of the 16:9 frame, measured on the video poster. */
  x: number;
  y: number;
  d: number;
  count: number;
};

const count = (test: (e: (typeof Experiences)[number]) => boolean) => Experiences.filter(test).length;

/**
 * The six module clusters around the core of the running system, named as
 * the domains Kalana works across. Counts come from the project config;
 * each node opens the Work explorer already filtered to it. The core itself
 * is left unnamed: it is the system as a whole.
 */
export const ATLAS_NODES: Node[] = [
  { label: "Web platforms", href: "/work?platform=web", project: "kendara", x: 66.6, y: 11.7, d: 11, count: count((e) => projectPlatform(e) === "web") },
  { label: "Mobile apps", href: "/work?platform=mobile", project: "student-partner-mobile-app", x: 48.3, y: 27.8, d: 11, count: count((e) => projectPlatform(e) === "mobile") },
  { label: "Windows software", href: "/work?platform=desktop", project: "project-mouse", x: 87.5, y: 25, d: 11, count: count((e) => projectPlatform(e) === "desktop") },
  { label: "Commerce", href: "/work?domain=commerce", project: "cloud-erp-pos", x: 49.4, y: 60.5, d: 11, count: count((e) => e.domain === "commerce") },
  { label: "Experiments", href: "/lab", project: "snake-game", x: 90.6, y: 52.2, d: 11, count: count((e) => e.domain === "experiments") },
  { label: "Business operations", href: "/work?domain=operations", project: "operations-crm-platform", x: 71.6, y: 75, d: 11, count: count((e) => e.domain === "operations") },
];

function plural(n: number) {
  return `${n} ${n === 1 ? "project" : "projects"}`;
}

/**
 * The running system: its poster as the page image, the silent loop over it
 * on wide screens, and each module cluster made a real, focusable node. Hovering or focusing a node
 * reveals one real project from that domain (CSS only, so it works without
 * JavaScript); a fine pointer adds a soft local light. Nodes wake in
 * sequence after the headline, and not at all under reduced motion.
 */
export function Atlas({ className }: { className?: string }) {
  return (
    <PointerLight className={cn("atlas-compress aspect-video", className)}>
      <Image
        src="/visuals/system/hero-poster.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="art object-cover [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_92%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_70%,transparent)] [mask-composite:intersect]"
      />
      <HeroVideo className="hero-video art absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_92%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_70%,transparent)] [mask-composite:intersect]" />
      <ul aria-label="Domains" className="absolute inset-0 hidden lg:block">
        {ATLAS_NODES.map((n, i) => {
          const project = Experiences.find((e) => e.id === n.project);
          const align = n.x > 80 ? "right-0" : n.x < 50 ? "left-0" : "left-1/2 -translate-x-1/2";
          return (
            <li
              key={n.label}
              className="atlas-node group/node absolute -translate-x-1/2 -translate-y-1/2 focus-within:z-20 hover:z-20"
              style={{ left: `${n.x}%`, top: `${n.y}%`, width: `${n.d}%`, "--wake": `${900 + i * 140}ms` } as React.CSSProperties}
            >
              <Link
                href={n.href}
                className="relative block aspect-square w-full rounded-[28%] outline-offset-4 transition-[box-shadow] duration-300 focus-visible:shadow-[0_0_0_1px_var(--brand),0_0_60px_var(--fog-strong)]"
              >
                <span className="glass absolute left-1/2 top-[calc(100%+0.5rem)] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground transition-colors group-hover/node:border-brand group-focus-within/node:border-brand">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {n.label}
                  <span className="meta text-[11px]">{n.count}</span>
                  <span className="sr-only">: {plural(n.count)}</span>
                </span>
              </Link>
              {project ? (
                <div
                  className={cn(
                    "glass shadow-soft invisible absolute top-[calc(100%+3.25rem)] w-64 rounded-2xl border border-border-strong p-4 opacity-0 transition-[opacity,visibility,translate] duration-300 ease-cine translate-y-1 group-hover/node:visible group-hover/node:translate-y-0 group-hover/node:opacity-100 group-focus-within/node:visible group-focus-within/node:translate-y-0 group-focus-within/node:opacity-100",
                    align
                  )}
                >
                  <p className="meta">For example</p>
                  <Link href={`/work/${project.id}`} className="mt-1 block font-medium text-foreground hover:text-brand">
                    {project.companyName}
                  </Link>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{project.shortDescription}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </PointerLight>
  );
}

/** The same domains as a plain list, for phones and tablets. */
export function AtlasList() {
  return (
    <ul aria-label="Domains" className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:hidden">
      {ATLAS_NODES.map((n) => (
        <li key={n.label}>
          <Link href={n.href} className="flex items-baseline justify-between gap-3 border-b border-border py-3 text-[15px] hover:text-brand">
            {n.label}
            <span className="meta">{n.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

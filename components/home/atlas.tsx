import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PointerLight } from "@/components/motion/pointer-light";
import { HeroSoil } from "@/components/home/hero-soil";
import { Experiences } from "@/config/experience";
import { projectPlatform } from "@/lib/work";

type Node = {
  label: string;
  href: string;
  /** One real project that lives in this domain. */
  project: string;
  /** Centre and diameter of the matching sphere, in percent of the artwork, measured on the 1586 x 992 source. */
  x: number;
  y: number;
  d: number;
  count: number;
};

const count = (test: (e: (typeof Experiences)[number]) => boolean) => Experiences.filter(test).length;

/**
 * The six spheres of the generated artwork, named as the domains Kalana
 * works across. Counts come from the project config; each node opens the
 * Work explorer already filtered to it.
 */
export const ATLAS_NODES: Node[] = [
  { label: "Business operations", href: "/work?domain=operations", project: "operations-crm-platform", x: 67.15, y: 47.18, d: 12.11, count: count((e) => e.domain === "operations") },
  { label: "Web platforms", href: "/work?platform=web", project: "kendara", x: 66.83, y: 11.29, d: 10.09, count: count((e) => projectPlatform(e) === "web") },
  { label: "Mobile apps", href: "/work?platform=mobile", project: "student-partner-mobile-app", x: 45.52, y: 26.41, d: 10.09, count: count((e) => projectPlatform(e) === "mobile") },
  { label: "Windows software", href: "/work?platform=desktop", project: "project-mouse", x: 89.66, y: 25.2, d: 9.96, count: count((e) => projectPlatform(e) === "desktop") },
  { label: "Commerce", href: "/work?domain=commerce", project: "cloud-erp-pos", x: 44.83, y: 63.31, d: 10.85, count: count((e) => e.domain === "commerce") },
  { label: "Experiments", href: "/lab", project: "snake-game", x: 89.03, y: 61.69, d: 10.34, count: count((e) => e.domain === "experiments") },
];

/**
 * Root paths traced over the artwork (1586 x 992), trunk first, then the
 * five branches from the core. Light pulses travel along them.
 */
const TRUNK = "M1100 992 C 1105 880, 1095 760, 1088 690 S 1070 600, 1066 566";
const BRANCHES = [
  "M1062 372 C 1058 320, 1058 250, 1056 195",
  "M975 428 C 930 385, 870 350, 800 322",
  "M1160 405 C 1215 370, 1285 335, 1355 302",
  "M972 505 C 915 530, 850 575, 795 610",
  "M1160 512 C 1220 540, 1280 578, 1332 602",
];

/**
 * One pulse of light along a path: a bright core in a soft halo. It travels
 * for `travel` seconds, then rests unseen until the period comes round.
 */
function Pulse({ path, travel, period, begin }: { path: string; travel: number; period: number; begin: number }) {
  const f = +(travel / period).toFixed(3);
  const timing = { dur: `${period}s`, begin: `${begin}s`, repeatCount: "indefinite" as const };
  return (
    <g opacity="0">
      <circle r="11" fill="var(--brand)" opacity="0.25" />
      <circle r="4" fill="var(--brand-bright)" />
      <animateMotion path={path} keyPoints="0;1;1" keyTimes={`0;${f};1`} calcMode="spline" keySplines="0.45 0 0.55 1;0 0 1 1" {...timing} />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes={`0;${+(f * 0.15).toFixed(3)};${+(f * 0.8).toFixed(3)};${f};1`} {...timing} />
    </g>
  );
}

function plural(n: number) {
  return `${n} ${n === 1 ? "project" : "projects"}`;
}

/**
 * The Living Systems Atlas: the generated artwork as the static base, with
 * each sphere made a real, focusable node. Hovering or focusing a node
 * reveals one real project from that domain (CSS only, so it works without
 * JavaScript); a fine pointer adds a soft local light. Nodes wake in
 * sequence after the headline, and not at all under reduced motion.
 */
export function Atlas({ className }: { className?: string }) {
  return (
    <PointerLight className={cn("atlas-compress aspect-[1586/992]", className)}>
      <Image
        src="/visuals/atlas/living-systems-atlas.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="art object-cover [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_92%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_70%,transparent)] [mask-composite:intersect]"
      />
      {/* The roots grow out of code: a field of characters under the trunk. */}
      <HeroSoil className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] w-full [mask-image:linear-gradient(to_bottom,transparent,#000_45%,#000_72%,transparent)]" />
      {/* Light rising through the roots: up the trunk, then out to each domain. */}
      <svg aria-hidden="true" viewBox="0 0 1586 992" className="atlas-pulses pointer-events-none absolute inset-0 h-full w-full">
        {[0, 2.2].map((b) => (
          <Pulse key={b} path={TRUNK} travel={2.2} period={4.4} begin={b} />
        ))}
        {BRANCHES.map((p, i) => (
          <Pulse key={p} path={p} travel={1.6} period={4.4} begin={2 + i * 0.4} />
        ))}
      </svg>
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
                className="relative block aspect-square w-full rounded-full outline-offset-4 ring-brand/0 transition-[box-shadow] duration-300 hover:shadow-[0_0_0_1px_var(--brand),0_0_60px_var(--fog-strong)] focus-visible:shadow-[0_0_0_1px_var(--brand),0_0_60px_var(--fog-strong)]"
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

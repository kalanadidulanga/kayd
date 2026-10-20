"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Monitor, ShoppingBag, Smartphone, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { PointerLight } from "@/components/motion/pointer-light";

const ICONS = { web: Globe, mobile: Smartphone, desktop: Monitor, commerce: ShoppingBag, team: Users };

export type FieldNode = { id: string; title: string; x: number; y: number; in: number[] };
export type FieldDiscipline = {
  key: keyof typeof ICONS;
  title: string;
  href: string;
  count: number;
  offers: string;
  proof: { id: string; title: string }[];
};
export type FieldRing = { r: number; year: number };

const C = 300;

/**
 * Range as one living field: every project is a node, planted by year from
 * the centre outward. Pointing at (or tabbing to) a discipline lights its
 * projects and draws their roots to the core; the rest dim. Each discipline
 * is also a plain link to the filtered Work index, so nothing depends on
 * the field.
 */
export function RangeField({ nodes, disciplines, rings }: { nodes: FieldNode[]; disciplines: FieldDiscipline[]; rings: FieldRing[] }) {
  const [active, setActive] = useState(0);
  const d = disciplines[active];
  const proof = new Set(d.proof.map((p) => p.id));

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <ul className="lg:col-span-5" aria-label="Disciplines">
        {disciplines.map((x, i) => {
          const Icon = ICONS[x.key];
          const on = i === active;
          return (
            <li key={x.key} className="border-b border-border first:border-t">
              <Link
                href={x.href}
                aria-current={on ? "true" : undefined}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-center gap-4 py-5"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    on ? "border-brand bg-brand text-on-brand" : "border-border-strong text-muted-foreground"
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className={cn("type-title flex-1 transition-colors duration-300", on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                  {x.title}
                </span>
                <span className={cn("meta tabular-nums", on && "text-brand")}>{x.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="lg:col-span-7">
        <PointerLight className="relative mx-auto aspect-square w-full max-w-[640px]">
          <svg viewBox="0 0 600 600" className="h-full w-full" role="img" aria-label={`${d.title}: ${d.count} of ${nodes.length} projects lit.`}>
            {rings.map((ring, i) => {
              // Each year's label sits at its own angle, so close rings stay readable.
              const angle = ((-90 + i * 30) * Math.PI) / 180;
              return (
                <g key={ring.year}>
                  <circle cx={C} cy={C} r={ring.r} fill="none" stroke="var(--border)" strokeDasharray="2 6" />
                  <text
                    x={C + (ring.r + 6) * Math.cos(angle)}
                    y={C + (ring.r + 6) * Math.sin(angle)}
                    className="fill-[var(--muted-foreground)] font-mono text-[11px]"
                  >
                    {ring.year}
                  </text>
                </g>
              );
            })}
            {nodes.map((n) => (
              <line
                key={`root-${n.id}`}
                x1={C}
                y1={C}
                x2={n.x}
                y2={n.y}
                stroke="var(--brand)"
                strokeWidth="1"
                className="transition-opacity duration-500"
                style={{ opacity: n.in.includes(active) ? 0.28 : 0 }}
              />
            ))}
            <circle cx={C} cy={C} r="26" fill="var(--fog-strong)" />
            <circle cx={C} cy={C} r="6" fill="var(--brand)" />
            {nodes.map((n) => {
              const lit = n.in.includes(active);
              const named = proof.has(n.id);
              return (
                <a key={n.id} href={`/work/${n.id}`} tabIndex={-1} aria-hidden="true" className="group/node">
                  <circle cx={n.x} cy={n.y} r="16" fill="transparent" />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={lit ? 7 : 3.5}
                    fill={lit ? "var(--brand)" : "var(--muted-foreground)"}
                    className="transition-[r,fill,opacity] duration-500 ease-cine"
                    style={{ opacity: lit ? 1 : 0.35 }}
                  />
                  {lit ? <circle cx={n.x} cy={n.y} r="14" fill="none" stroke="var(--brand)" strokeOpacity="0.35" /> : null}
                  <text
                    x={n.x + (n.x > C ? -14 : 14)}
                    y={n.y + 4}
                    textAnchor={n.x > C ? "end" : "start"}
                    className={cn(
                      "fill-[var(--foreground)] text-[13px] transition-opacity duration-300",
                      named ? "opacity-100" : "opacity-0 group-hover/node:opacity-100"
                    )}
                  >
                    {n.title}
                  </text>
                </a>
              );
            })}
          </svg>
        </PointerLight>
        <div className="mx-auto mt-6 max-w-[640px]" aria-live="polite">
          {d.offers ? <p className="text-[15px] text-muted-foreground">{d.offers}</p> : null}
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px]">
            {d.proof.map((p) => (
              <Link key={p.id} href={`/work/${p.id}`} className="text-brand hover:underline">
                {p.title}
              </Link>
            ))}
            <Link href={d.href} className="text-foreground hover:text-brand">
              All {d.count}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

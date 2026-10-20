"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEPTHS, DOMAINS, OWNERSHIP, PLATFORMS, type ProjectSummary } from "@/lib/work";

type Filters = {
  q: string;
  ownership: string;
  platform: string;
  domain: string;
  tech: string;
  year: string;
  depth: string;
};
const KEYS = ["q", "ownership", "platform", "domain", "tech", "year", "depth"] as const;
const EMPTY: Filters = { q: "", ownership: "", platform: "", domain: "", tech: "", year: "", depth: "" };

const OWNERSHIP_CHIPS: Record<string, string> = { ...OWNERSHIP, team: "Team" };

function haystack(p: ProjectSummary) {
  return [
    p.title,
    p.summary,
    DOMAINS[p.domain],
    PLATFORMS[p.platform],
    OWNERSHIP[p.ownership],
    p.team ? "team" : "",
    p.role ?? "",
    p.years,
    DEPTHS[p.depth],
    ...p.stack,
  ]
    .join(" ")
    .toLowerCase();
}

function apply(projects: ProjectSummary[], f: Filters) {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  return projects.filter((p) => {
    if (f.ownership === "team" ? !p.team : f.ownership && p.ownership !== f.ownership) return false;
    if (f.platform && p.platform !== f.platform) return false;
    if (f.domain && p.domain !== f.domain) return false;
    if (f.tech && !p.stack.includes(f.tech)) return false;
    if (f.year && String(p.year) !== f.year) return false;
    if (f.depth && p.depth !== f.depth) return false;
    const text = haystack(p);
    return terms.every((t) => text.includes(t));
  });
}

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      {Object.entries(options).map(([key, text]) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(value === key ? "" : key)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[14px] transition-[background-color,border-color,color,transform] duration-300 ease-cine active:scale-[0.98]",
            value === key
              ? "border-brand bg-brand text-on-brand"
              : "border-border-strong text-muted-foreground hover:border-brand hover:text-foreground"
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function Row({ p }: { p: ProjectSummary }) {
  return (
    <li>
      <Link
        href={`/work/${p.id}`}
        className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-border py-6 transition-colors duration-300 md:grid-cols-[4.5rem_minmax(0,1fr)_13rem] md:gap-x-8 md:px-3 md:hover:bg-brand-soft"
      >
        <span className="meta pt-1 tabular-nums">{p.year}</span>
        <span className="min-w-0">
          <span className="type-card block transition-transform duration-500 ease-cine md:group-hover:translate-x-1.5">{p.title}</span>
          <span className="mt-1.5 block text-[15px] leading-snug text-muted-foreground">{p.summary}</span>
          {p.role ? <span className="mt-2 block text-[14px]">{p.role}</span> : null}
        </span>
        <span className="meta col-start-2 flex flex-wrap gap-x-4 md:col-start-auto md:block md:space-y-1 md:pt-1">
          <span className="block">{PLATFORMS[p.platform]}, {DOMAINS[p.domain].toLowerCase()}</span>
          <span className="block">{DEPTHS[p.depth]}</span>
          <span className="block truncate">{p.stack.slice(0, 3).join(", ")}</span>
        </span>
        {p.cover ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-60 top-1/2 z-10 hidden w-72 -translate-y-1/2 scale-95 opacity-0 transition-[opacity,scale] duration-500 ease-cine group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 xl:block"
          >
            <Image
              src={p.cover}
              alt=""
              width={1440}
              height={900}
              sizes="288px"
              className="shadow-soft aspect-[16/10] w-full rounded-lg border border-border-strong object-cover object-top"
            />
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/** The explorer, its state read from and written back to the URL. */
export function ExplorerView({ projects, initial }: { projects: ProjectSummary[]; initial: Partial<Filters> }) {
  const [f, setF] = React.useState<Filters>({ ...EMPTY, ...initial });
  const results = apply(projects, f);

  function update(patch: Partial<Filters>) {
    const next = { ...f, ...patch };
    setF(next);
    const params = new URLSearchParams();
    for (const k of KEYS) if (next[k]) params.set(k, next[k]);
    const qs = params.toString();
    written = qs;
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  const techCounts = new Map<string, number>();
  for (const p of projects) for (const t of p.stack) techCounts.set(t, (techCounts.get(t) ?? 0) + 1);
  const techs = [...techCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const years = [...new Set(projects.map((p) => p.year).filter(Boolean))].sort((a, b) => b! - a!);
  const advanced = Boolean(f.tech || f.year || f.depth);
  const active = KEYS.some((k) => f[k]);

  return (
    <div>
      <div className="space-y-5">
        <label className="relative block max-w-2xl">
          <span className="sr-only">Search projects</span>
          <Search aria-hidden="true" className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search by name, technology, domain, role or year"
            className="h-14 w-full rounded-full border border-border-strong bg-transparent pl-12 pr-5 text-[16px] outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </label>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8">
          <Chips label="Ownership" options={OWNERSHIP_CHIPS} value={f.ownership} onChange={(v) => update({ ownership: v })} />
          <Chips label="Platform" options={PLATFORMS} value={f.platform} onChange={(v) => update({ platform: v })} />
          <Chips label="Domain" options={DOMAINS} value={f.domain} onChange={(v) => update({ domain: v })} />
        </div>
        <details open={advanced || undefined} className="group/adv">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
            More filters
            <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-open/adv:rotate-180" />
          </summary>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-8">
            <label className="flex items-center gap-3 text-[15px]">
              Technology
              <select
                value={f.tech}
                onChange={(e) => update({ tech: e.target.value })}
                className="h-10 rounded-full border border-border-strong bg-background px-4 text-[15px]"
              >
                <option value="">Any</option>
                {techs.map(([t, n]) => (
                  <option key={t} value={t}>
                    {t} ({n})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 text-[15px]">
              Year
              <select
                value={f.year}
                onChange={(e) => update({ year: e.target.value })}
                className="h-10 rounded-full border border-border-strong bg-background px-4 text-[15px]"
              >
                <option value="">Any</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <Chips label="Depth" options={DEPTHS} value={f.depth} onChange={(v) => update({ depth: v })} />
          </div>
        </details>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 border-b border-border pb-4">
        <p aria-live="polite" className="meta">
          {results.length === projects.length ? `All ${projects.length} projects` : `${results.length} of ${projects.length} projects`}
        </p>
        {active ? (
          <button type="button" onClick={() => update(EMPTY)} className="inline-flex items-center gap-1.5 text-[14px] text-brand hover:underline">
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length ? (
        <ul data-testid="work-index">
          {results.map((p) => (
            <Row key={p.id} p={p} />
          ))}
        </ul>
      ) : (
        <div className="py-16">
          <p className="type-card">No project matches these filters.</p>
          <p className="mt-3 text-muted-foreground">Clear them, or start from a domain:</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => update(EMPTY)} className="rounded-full bg-brand px-5 py-2 text-[15px] font-medium text-on-brand">
              Clear filters
            </button>
            {Object.entries(DOMAINS).map(([key, label]) => (
              <button key={key} type="button" onClick={() => update({ ...EMPTY, domain: key })} className="text-[15px] text-brand hover:underline">
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <section aria-labelledby="relationships" className="mt-28">
        <h2 id="relationships" className="type-title">
          Across projects
        </h2>
        <p className="type-lead mt-4 max-w-2xl">Which projects share a technology. Choose one to see them together.</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {techs.map(([t, n]) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => {
                  update({ ...EMPTY, tech: t });
                  document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn("text-[15px] hover:text-brand", f.tech === t ? "text-brand" : "text-foreground")}
              >
                {t} <span className="meta">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** The query string the explorer last wrote itself, so its own edits never reset it. */
let written: string | null = null;

/**
 * Reads the filters from the URL; until then (and without JavaScript) the
 * fallback lists everything. A new query from elsewhere, such as the command
 * palette, starts the explorer afresh; its own edits to the URL do not.
 */
export function Explorer({ projects }: { projects: ProjectSummary[] }) {
  const params = useSearchParams();
  const qs = params.toString();
  const [key, setKey] = React.useState(qs);
  if (qs !== key && qs !== written) setKey(qs);
  const initial = Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ""]));
  return <ExplorerView key={key} projects={projects} initial={initial} />;
}

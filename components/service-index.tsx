"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  AppWindow,
  ArrowUpRight,
  Globe,
  LayoutDashboard,
  Palette,
  ScanBarcode,
  SearchCode,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/reveal";
import type { Service } from "@/config/services";

export type ServiceItem = Omit<Service, "proof"> & { proof: { id: string; name: string }[] };

const ICONS: Record<Service["icon"], typeof Wrench> = {
  webapp: LayoutDashboard,
  website: Globe,
  mobile: Smartphone,
  pos: ScanBarcode,
  software: AppWindow,
  store: ShoppingBag,
  ai: Sparkles,
  design: Palette,
  support: Wrench,
  review: SearchCode,
};

// How long each service stays up while the index plays by itself.
const DWELL = 4.5;

function Detail({ item, n, total }: { item: ServiceItem; n: number; total: number }) {
  const Icon = ICONS[item.icon];
  return (
    <div className="relative">
      <Icon aria-hidden="true" className="pointer-events-none absolute -right-6 top-16 h-36 w-36 text-brand opacity-[0.07]" strokeWidth={1} />
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand/25 bg-brand-soft text-brand">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="font-mono text-xs text-subtle">
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-7 text-3xl font-semibold tracking-[-0.035em]">{item.title}</h3>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">{item.blurb}</p>
      {item.proof.length ? (
        <div className="mt-7">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">In the work</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {item.proof.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/work/${p.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border-strong px-3 py-1 text-[13px] transition-colors hover:border-brand hover:text-brand"
                >
                  {p.name}
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Services as an index: names on the left, the chosen one's detail on the
 * right (inline, as an accordion, on narrow screens). Until someone points
 * at it, it steps through the list by itself while on screen, with the
 * underline as its timer; reduced motion keeps it still. Without
 * JavaScript the first service shows and every name is still listed.
 */
export function ServiceIndex({ items, cta }: { items: ServiceItem[]; cta: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(root, { amount: 0.35 });
  const reduce = useReducedMotion();
  const playing = inView && !touched && !reduce;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % items.length), DWELL * 1000);
    return () => clearTimeout(t);
  }, [playing, active, items.length]);

  function choose(i: number) {
    setActive(i);
    setTouched(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = items.length - 1;
    const next =
      e.key === "ArrowDown" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowUp" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  }

  const swap = {
    initial: { opacity: 0, y: 12, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(6px)" },
    transition: { duration: 0.45, ease: EASE },
  };

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div role="tablist" aria-orientation="vertical" aria-label="Services" onKeyDown={onKeyDown} className="border-t border-border">
        {items.map((s, i) => {
          const on = i === active;
          return (
            <div key={s.title}>
              <button
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`service-tab-${i}`}
                aria-selected={on}
                aria-controls="service-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => choose(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}
                className="group relative flex w-full items-center gap-5 border-b border-border py-4 text-left md:py-[18px]"
              >
                <span className={cn("w-6 font-mono text-xs transition-colors", on ? "text-brand" : "text-subtle")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex-1 text-xl font-semibold tracking-[-0.03em] transition-[color,translate] duration-500 ease-cine md:text-2xl",
                    on ? "translate-x-1 text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {s.title}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 text-brand transition-[opacity,translate] duration-500 ease-cine",
                    on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                  )}
                />
                {on ? (
                  playing ? (
                    <motion.span
                      key={`timer-${active}`}
                      aria-hidden="true"
                      className="absolute -bottom-px left-0 h-px w-full origin-left bg-brand"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: DWELL, ease: "linear" }}
                    />
                  ) : (
                    <motion.span
                      layoutId="service-underline"
                      aria-hidden="true"
                      className="absolute -bottom-px left-0 h-px w-full bg-brand"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )
                ) : null}
              </button>

              {/* Narrow screens: the detail opens under its own name. */}
              <AnimatePresence initial={false}>
                {on ? (
                  <motion.div
                    key={s.title}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden lg:hidden"
                  >
                    <div className="py-6">
                      <Detail item={s} n={i + 1} total={items.length} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
        <div className="pt-8 lg:hidden">{cta}</div>
      </div>

      <div className="hidden lg:block">
        <div
          role="tabpanel"
          id="service-panel"
          aria-labelledby={`service-tab-${active}`}
          className="shadow-soft sticky top-28 flex min-h-[460px] flex-col overflow-hidden rounded-[26px] border border-border-strong bg-surface p-9"
        >
          <div aria-hidden="true" className="glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-60" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} {...swap} className="relative flex-1">
              <Detail item={items[active]} n={active + 1} total={items.length} />
            </motion.div>
          </AnimatePresence>
          <div className="relative mt-8 border-t border-border pt-7">{cta}</div>
        </div>
      </div>
    </div>
  );
}

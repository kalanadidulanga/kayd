import Link from "next/link";
import {
  AppWindow,
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

import { Section, SectionHeading } from "@/components/section";
import { Spotlight } from "@/components/motion/spotlight";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/reveal";
import { btnPrimary } from "@/components/home/hero";
import { Experiences } from "@/config/experience";
import { services, type Service } from "@/config/services";

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

/**
 * What a client can hire Kalana for, each service with the projects that
 * show it, and an open door for custom work. "What I do" says how he
 * builds; this says what you can order.
 */
export function Services() {
  return (
    <Section id="services" band>
      <SectionHeading
        eyebrow="Services"
        title="What I can build"
        serif="for you."
        lead="Tell me what your business needs and I'll build it. These are the usual starting points."
      />

      <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s, i) => {
          const proof = (s.proof ?? []).flatMap((id) => Experiences.filter((e) => e.id === id));
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.title} delay={(i % 4) * 70} className="h-full">
              <Spotlight className="flex h-full flex-col p-7">
                <div className="relative flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand/25 bg-brand-soft text-brand">
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="type-card relative mt-6">{s.title}</h3>
                <p className="relative mt-2 text-muted-foreground">{s.blurb}</p>
                {proof.length ? (
                  <div className="relative mt-auto pt-6">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">In the work</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {proof.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/work/${p.id}`}
                            className="inline-flex rounded-full border border-border-strong px-2.5 py-1 text-[12.5px] transition-colors hover:border-brand hover:text-brand"
                          >
                            {p.companyName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Spotlight>
            </Reveal>
          );
        })}

        {/* Two cells wide, so the grid closes evenly at two, three and four columns. */}
        <Reveal delay={services.length * 40} className="h-full md:col-span-2">
          <div className="flex h-full flex-col justify-between gap-8 rounded-[22px] border border-dashed border-brand/40 bg-brand-soft p-7 sm:flex-row sm:items-end">
            <div className="max-w-md">
              <h3 className="type-card">Custom solutions</h3>
              <p className="mt-2 text-muted-foreground">
                Not on the list? If your business needs it, I&apos;ll build it. Tell me the problem and we&apos;ll work out the software.
              </p>
            </div>
            <div className="shrink-0">
              <Magnetic>
                <Link href="/contact" className={btnPrimary}>
                  Start a project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

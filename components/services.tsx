import Link from "next/link";
import { Palette, SearchCode, ShoppingBag, Sparkles, Wrench } from "lucide-react";

import { Section, SectionHeading } from "@/components/section";
import { Spotlight } from "@/components/motion/spotlight";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/reveal";
import { btnPrimary } from "@/components/home/hero";
import { Experiences } from "@/config/experience";
import { services, type Service } from "@/config/services";

const ICONS: Record<Service["icon"], typeof Wrench> = {
  store: ShoppingBag,
  ai: Sparkles,
  design: Palette,
  support: Wrench,
  review: SearchCode,
};

/**
 * What else a client can hire Kalana for, beyond the builds "What I do"
 * shows, each with the projects that show it, and an open door for the rest.
 */
export function Services() {
  return (
    <Section id="services" band>
      <SectionHeading
        eyebrow="Services"
        title="More ways"
        serif="I can help."
        lead="More than web, mobile and desktop builds. Here is what else I take on, and if you need something that is not here, ask."
      />

      <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const proof = (s.proof ?? []).flatMap((id) => Experiences.filter((e) => e.id === id));
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.title} delay={i * 70} className="h-full">
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

        <Reveal delay={services.length * 70} className="h-full">
          <div className="flex h-full flex-col justify-between rounded-[22px] border border-dashed border-brand/40 bg-brand-soft p-7">
            <div>
              <h3 className="type-card">Something else?</h3>
              <p className="mt-2 text-muted-foreground">
                If your business needs it, I&apos;ll build it. Tell me the problem and we&apos;ll work out the software.
              </p>
            </div>
            <div className="mt-8">
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

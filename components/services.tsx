import Link from "next/link";

import { Section, SectionHeading } from "@/components/section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/reveal";
import { ServiceIndex, type ServiceItem } from "@/components/service-index";
import { btnPrimary } from "@/components/home/hero";
import { Experiences } from "@/config/experience";
import { services } from "@/config/services";

// Only the names of the proof projects cross into the client bundle.
const items: ServiceItem[] = services.map((s) => ({
  ...s,
  proof: (s.proof ?? []).flatMap((id) =>
    Experiences.filter((e) => e.id === id).map((e) => ({ id: e.id, name: e.companyName }))
  ),
}));

/** What a client can hire Kalana for, each service with the projects that show it. */
export function Services() {
  return (
    <Section id="services" band>
      <SectionHeading
        eyebrow="Services"
        title="What I can build"
        serif="for you."
        lead="Tell me what your business needs and I'll build it. Pick a service to see the work behind it."
      />
      <Reveal>
        <ServiceIndex
          items={items}
          cta={
            <div className="flex flex-wrap items-center justify-between gap-5">
              <p className="max-w-xs text-muted-foreground">
                <span className="font-medium text-foreground">Not on the list?</span> If your business needs it,
                I&apos;ll build it.
              </p>
              <Magnetic>
                <Link href="/contact" className={btnPrimary}>
                  Start a project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
            </div>
          }
        />
      </Reveal>
    </Section>
  );
}

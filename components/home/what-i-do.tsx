import { Section, SectionHeading } from "@/components/section";
import { Spotlight } from "@/components/motion/spotlight";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/motion/count-up";
import { DashboardViz, DesktopViz, GraphViz, PhoneViz } from "@/components/home/bento-visuals";
import { siteStats } from "@/lib/stats";

function Tile({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <Spotlight className="h-full p-7">
        <div className="relative">{children}</div>
      </Spotlight>
    </Reveal>
  );
}

/** What Kalana builds, as a bento: each tile a claim the work below backs. */
export function WhatIDo() {
  return (
    <Section id="what-i-do" band>
      <SectionHeading eyebrow="What I do" title="From the database" serif="to the last pixel." />
      <div className="grid gap-3.5 md:grid-cols-6">
        <Tile className="md:col-span-4">
          <p className="eyebrow">Web platforms</p>
          <h3 className="type-card mt-4">Operations systems, CRMs, stores</h3>
          <p className="mt-2 text-muted-foreground">
            Next.js and Supabase platforms with role-based access, scheduled jobs and real users behind them.
          </p>
          <DashboardViz />
        </Tile>
        <Tile className="md:col-span-2" delay={80}>
          <CountUp value={siteStats.projects} className="font-mono text-6xl font-semibold tracking-tighter" />
          <p className="mt-3 text-muted-foreground">
            projects on this site, every one listed with its stack.
          </p>
        </Tile>
        <Tile className="md:col-span-2" delay={60}>
          <h3 className="type-card">Mobile</h3>
          <p className="mt-2 text-muted-foreground">Expo and React Native apps with push notifications and typed APIs.</p>
          <PhoneViz />
        </Tile>
        <Tile className="md:col-span-2" delay={120}>
          <h3 className="type-card">Desktop</h3>
          <p className="mt-2 text-muted-foreground">Windows software in Rust and Tauri, Electron and .NET.</p>
          <DesktopViz />
        </Tile>
        <Tile className="md:col-span-2" delay={180}>
          <h3 className="type-card">Teams</h3>
          <p className="mt-2 text-muted-foreground">
            I lead developers who build for my clients, and manage projects at C-Lento.
          </p>
          <GraphViz />
        </Tile>
      </div>
    </Section>
  );
}

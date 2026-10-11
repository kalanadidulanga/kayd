import { Bell, Database } from "lucide-react";
import type { IconType } from "react-icons";
import { SiDotnet, SiElectron, SiExpo, SiNextdotjs, SiReact, SiRust, SiSupabase, SiTauri, SiTypescript } from "react-icons/si";

import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/section";
import { Spotlight } from "@/components/motion/spotlight";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/motion/count-up";
import { DesktopArt, MobileArt, StackArt, TeamsArt, WebArt } from "@/components/home/iso-art";
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
        <div className="relative flex h-full flex-col">{children}</div>
      </Spotlight>
    </Reveal>
  );
}

type Chip = { name: string; icon: IconType | typeof Bell };

/** The stack behind a tile, as a row or column of icon chips. */
function Chips({ items, vertical = false }: { items: Chip[]; vertical?: boolean }) {
  return (
    <ul className={cn("flex gap-2", vertical ? "flex-col" : "flex-row")}>
      {items.map(({ name, icon: Icon }) => (
        <li
          key={name}
          title={name}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border-strong bg-surface text-muted-foreground transition-colors duration-300 hover:border-brand hover:text-brand"
        >
          <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
          <span className="sr-only">{name}</span>
        </li>
      ))}
    </ul>
  );
}

/** What Kalana builds, as a bento: each tile a claim the work below backs. */
export function WhatIDo() {
  return (
    <Section id="what-i-do" band>
      <SectionHeading eyebrow="What I do" title="From the database" serif="to the last pixel." />
      <div className="grid gap-3.5 md:grid-cols-6">
        <Tile className="md:col-span-4">
          <div className="grid h-full gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center">
            <div className="flex h-full flex-col">
              <p className="eyebrow">Web platforms</p>
              <h3 className="type-card mt-4">Operations systems, CRMs, stores</h3>
              <p className="mt-2 text-muted-foreground">
                Next.js and Supabase platforms with role-based access, scheduled jobs and real users behind them.
              </p>
              <div className="mt-6 md:mt-auto md:pt-8">
                <Chips
                  items={[
                    { name: "Next.js", icon: SiNextdotjs },
                    { name: "Supabase", icon: SiSupabase },
                    { name: "TypeScript", icon: SiTypescript },
                    { name: "Databases", icon: Database },
                  ]}
                />
              </div>
            </div>
            <WebArt className="h-auto w-full max-w-[520px] justify-self-center md:-mr-4 md:w-[calc(100%+1rem)]" />
          </div>
        </Tile>
        <Tile className="md:col-span-2" delay={80}>
          <CountUp value={siteStats.projects} className="font-mono text-6xl font-semibold tracking-tighter" />
          <p className="mt-3 text-muted-foreground">
            projects on this site, every one listed with its stack.
          </p>
          <StackArt className="mt-auto ml-auto h-auto w-full max-w-[320px] pt-4" />
        </Tile>
        <Tile className="md:col-span-2" delay={60}>
          <h3 className="type-card">Mobile</h3>
          <p className="mt-2 text-muted-foreground">Expo and React Native apps with push notifications and typed APIs.</p>
          <div className="mt-6 flex flex-1 items-end gap-3">
            <Chips
              vertical
              items={[
                { name: "Expo", icon: SiExpo },
                { name: "React Native", icon: SiReact },
                { name: "TypeScript", icon: SiTypescript },
                { name: "Push notifications", icon: Bell },
              ]}
            />
            <MobileArt className="h-auto min-w-0 flex-1" />
          </div>
        </Tile>
        <Tile className="md:col-span-2" delay={120}>
          <h3 className="type-card">Desktop</h3>
          <p className="mt-2 text-muted-foreground">Windows software in Rust and Tauri, Electron and .NET.</p>
          <div className="mt-6 flex flex-1 items-end gap-3">
            <Chips
              vertical
              items={[
                { name: "Rust", icon: SiRust },
                { name: "Tauri", icon: SiTauri },
                { name: "Electron", icon: SiElectron },
                { name: ".NET", icon: SiDotnet },
              ]}
            />
            <DesktopArt className="h-auto min-w-0 flex-1" />
          </div>
        </Tile>
        <Tile className="md:col-span-2" delay={180}>
          <h3 className="type-card">Teams</h3>
          <p className="mt-2 text-muted-foreground">
            I lead developers who build for my clients, and manage projects at C-Lento.
          </p>
          <TeamsArt className="mt-auto h-auto w-full pt-4" />
        </Tile>
      </div>
    </Section>
  );
}

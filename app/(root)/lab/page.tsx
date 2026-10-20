import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Scene, SceneHeading, Cue } from "@/components/scene";
import { PixelField } from "@/components/lab/pixel-field";
import { Experiences } from "@/config/experience";
import { lab, type LabEntry } from "@/config/lab";
import { skillLabel } from "@/lib/skills";
import { projectYears } from "@/lib/work";

export const metadata: Metadata = {
  title: "Lab",
  description: "Games, animations and small tools, built to learn and to play.",
  alternates: { canonical: "/lab" },
};

const entries = lab.flatMap((l) => Experiences.filter((e) => e.id === l.project).map((e) => ({ ...l, e })));

function Entry({ e, input, why }: LabEntry & { e: (typeof Experiences)[number] }) {
  return (
    <li data-rise="" className="grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <h3 className="type-card">{e.companyName}</h3>
        <p className="meta mt-2">{e.websiteLink ? "Online" : "No live version"}, {projectYears(e)}</p>
      </div>
      <div className="md:col-span-5">
        <p>{e.shortDescription}</p>
        {why ? <p className="mt-3 text-[15px] text-muted-foreground">Why: {why}</p> : null}
        <dl className="meta mt-4 grid gap-1">
          {input ? (
            <div className="flex gap-2">
              <dt>Input:</dt>
              <dd>{input}</dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt>Built with:</dt>
            <dd>{e.techStack.map(skillLabel).join(", ")}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-3 md:flex-col md:items-end">
        {e.websiteLink ? (
          <Link href={e.websiteLink} target="_blank" rel="noreferrer" className="text-brand">
            <Cue>Open it</Cue>
          </Link>
        ) : null}
        {e.githubLink ? (
          <Link href={e.githubLink} target="_blank" rel="noreferrer" className="text-[15px] hover:text-brand">
            Source
          </Link>
        ) : null}
        <Link href={`/work/${e.id}`} className="text-[15px] text-muted-foreground hover:text-brand">
          Project page
        </Link>
      </div>
    </li>
  );
}

const SECTIONS: { kind: LabEntry["kind"]; title: string; lead: string }[] = [
  { kind: "experiment", title: "Running experiments", lead: "Games and animations you can open and use." },
  { kind: "tool", title: "Small tools", lead: "Utilities that do one job." },
  { kind: "archive", title: "Archive", lead: "Earlier practice, kept for what it taught." },
];

export default function LabPage() {
  return (
    <>
      <Scene as="header" light={[70, 40]} edge="fog" className="pb-8 pt-36 md:pt-44">
        <div className="container grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 data-rise="load" className="type-display">
              Lab
            </h1>
            <p data-rise="load" className="type-lead mt-6 max-w-md">
              Small things I build to learn and to play. The field here is one of them: move a pointer across it and it
              wakes up around you.
            </p>
          </div>
          <div data-rise="load" className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:col-span-7">
            <Image src="/lab/lab-poster.webp" alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="art object-cover opacity-45" />
            <PixelField className="absolute inset-0 h-full w-full" />
            <p className="meta absolute bottom-4 left-4">Cursor field, canvas. Still under reduced motion.</p>
          </div>
        </div>
      </Scene>

      {SECTIONS.map((s, i) => {
        const items = entries.filter((x) => x.kind === s.kind);
        if (!items.length) return null;
        return (
          <Scene key={s.kind} id={s.kind} tone={i === 1 ? "deep" : "canvas"} light={[i % 2 ? 20 : 80, 30]} className="py-20 md:py-28">
            <div className="container">
              <SceneHeading title={s.title} lead={s.lead} className="mb-8 md:mb-10" />
              <ul className="border-b border-border">
                {items.map((x) => (
                  <Entry key={x.project} {...x} />
                ))}
              </ul>
            </div>
          </Scene>
        );
      })}
    </>
  );
}

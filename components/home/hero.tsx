import Link from "next/link";

import { Words } from "@/components/motion/words";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/reveal";
import { OutputBeam } from "@/components/home/output-beam";
import { CodeWindow, type CodeLine } from "@/components/home/code-window";
import { FloatingStats } from "@/components/home/floating-stats";
import { Marquee } from "@/components/home/marquee";
import { profile } from "@/config/profile";
import { roles } from "@/config/work-history";
import { now } from "@/config/now";
import { siteStats } from "@/lib/stats";
import { skillLabel, skillUsage } from "@/lib/skills";

const str = (text: string) => ({ text: `"${text}"`, kind: "str" as const });

/** The kalana.ts object, built only from config so it cannot drift. */
function codeLines(): CodeLine[] {
  const jobs = roles.filter((r) => !r.end && r.title && r.company !== "Freelance");
  const freelance = roles.some((r) => !r.end && r.company === "Freelance");
  const list = (items: string[]): CodeLine =>
    items.flatMap((t, i) => [str(t), ...(i < items.length - 1 ? [{ text: ", " }] : [])]);

  return [
    [{ text: "const", kind: "key" }, { text: " kalana = {" }],
    [{ text: "  role: " }, str(profile.headline.split(".")[0]), { text: "," }],
    [{ text: "  now: [" }],
    ...jobs.map((r): CodeLine => [{ text: "    " }, str(`${r.title} @ ${r.company}`), { text: "," }]),
    [{ text: "  ]," }],
    ...(freelance ? [[{ text: "  freelance: " }, { text: "true", kind: "key" as const }, { text: "," }]] : []),
    [{ text: "  ships: [" }, ...list(profile.ships), { text: "]," }],
    [{ text: "  stack: [" }, ...list(profile.signatureStack.map(skillLabel)), { text: "]," }],
    [{ text: "  since: " }, { text: String(profile.experienceSince), kind: "key" }, { text: "," }],
    [{ text: "};" }],
    [{ text: `// ${siteStats.projects} projects on this site. Keep scrolling.`, kind: "comment" }],
  ];
}

export const btnPrimary =
  "inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background shadow-[0_0_0_5px_var(--brand-soft)] transition-transform duration-200 ease-cine active:scale-[0.97]";
export const btnGhost =
  "glass inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-6 text-[15px] font-medium text-foreground transition-transform duration-200 ease-cine active:scale-[0.97]";

export function Hero() {
  const job = roles.find((r) => !r.end && r.title && r.company !== "Freelance");
  const groups = skillUsage();
  // A Set, because two skills can share a label (Java on web and desktop).
  const stack = [
    ...new Set(
      groups
        .flatMap((g) => g.skills)
        .sort((a, b) => b.projects.length - a.projects.length)
        .map((s) => s.name)
        .concat(groups.flatMap((g) => g.stated))
        .map(skillLabel)
    ),
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-32 md:pt-44">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div aria-hidden="true" className="glow absolute left-1/2 top-[6%] h-[600px] w-[900px] max-w-full -translate-x-1/2" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-28 hidden h-[430px] border border-b-0 border-dashed border-border-strong lg:block"
      />

      <div className="container relative text-center">
        {job ? (
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full border border-border-strong py-1.5 pl-2 pr-3.5 text-[13px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_4px_var(--brand-soft)]" />
              {job.title} at {job.company}
            </span>
          </Reveal>
        ) : null}

        <h1 className="type-hero mx-auto mt-7 max-w-6xl">
          <Words text="I build software" delay={0.15} />
          <br className="hidden sm:block" />{" "}
          <Words text="that" delay={0.39} />{" "}
          <Words text="runs real businesses." delay={0.47} wordClassName="serif-accent serif-gradient" />
        </h1>

        <Reveal delay={550}>
          <p className="type-lead mx-auto mt-7 max-w-xl">
            {profile.name}, full stack engineer. Web platforms, mobile apps and
            Windows software, from the database to the last pixel.
          </p>
          {now.text.trim() ? (
            <p id="now" className="mx-auto mt-4 max-w-xl font-mono text-sm text-subtle">
              Now: {now.text}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={700}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Link href="/work" className={btnPrimary}>
                See my work <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className={btnGhost}>
                Get in touch
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-3xl md:mt-24">
          <OutputBeam />
          <Reveal delay={850}>
            <CodeWindow file="kalana.ts" lines={codeLines()} />
          </Reveal>
          <FloatingStats
            stats={[
              { value: siteStats.projects, label: "Projects", icon: "projects" },
              { value: siteStats.clients, label: "Clients", icon: "clients" },
              { value: profile.yearsOfExperience, label: "Years", note: `since ${profile.experienceSince}`, icon: "years" },
              { value: siteStats.technologies, label: "Technologies", icon: "tech" },
            ]}
          />
        </div>
      </div>

      <div className="mt-24 md:mt-32">
        <Marquee items={stack} />
      </div>
    </section>
  );
}

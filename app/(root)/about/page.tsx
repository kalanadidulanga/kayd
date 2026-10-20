import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Avatar from "@/public/Avatar.png";
import { Scene, SceneHeading, Cue } from "@/components/scene";
import { ClientLogos } from "@/components/client-logos";
import { SkillTable } from "@/components/skill-groups";
import { Testimonials } from "@/components/testimonials";
import { Experiences } from "@/config/experience";
import { contributionsUnsorted } from "@/config/contributions";
import { educations } from "@/config/educations";
import { lab } from "@/config/lab";
import { profile } from "@/config/profile";
import { services } from "@/config/services";
import { formatRange, roles } from "@/config/work-history";
import { projectPlatform } from "@/lib/work";

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, where I have worked, how I work, and every skill with the projects behind it.",
  alternates: { canonical: "/about" },
};

const find = (id: string) => Experiences.find((e) => e.id === id)!;

/**
 * Five stages of how Kalana works, each shown by text already on a real
 * project. `quote` reads the config, so the example cannot drift.
 */
const STAGES = [
  { title: "Discovery", line: "Start from what the business already has.", project: "operations-crm-platform", quote: (id: string) => find(id).caseStudy?.problem },
  { title: "Architecture", line: "Agree the contracts before the screens.", project: "cloud-erp-pos", quote: (id: string) => find(id).decisions?.[0] },
  { title: "Collaboration", line: "Lead the team, and say plainly who built what.", project: "college-lms", quote: (id: string) => find(id).contribution },
  { title: "Implementation", line: "Let the pipeline refuse what is not ready.", project: "project-mouse", quote: (id: string) => find(id).decisions?.[1] },
  {
    title: "Refinement",
    line: "Finish in the reader's own language.",
    project: "kendara",
    quote: (id: string) => find(id).descriptionDetails?.bullets?.find((b) => b.includes("translation parity")),
  },
] as const;

const count = (test: (e: (typeof Experiences)[number]) => boolean) => Experiences.filter(test).length;

const AREAS = [
  { title: "Web", line: "Platforms, portals, stores and sites, in Next.js and React with Postgres or MySQL.", href: "/work?platform=web", n: count((e) => projectPlatform(e) === "web") },
  { title: "Mobile", line: "iOS and Android apps in React Native and Expo, connected to their platform.", href: "/work?platform=mobile", n: count((e) => projectPlatform(e) === "mobile") },
  { title: "Windows", line: "Rust and Tauri, Electron and .NET, for work a browser is not right for.", href: "/work?platform=desktop", n: count((e) => projectPlatform(e) === "desktop") },
  { title: "APIs", line: "REST and GraphQL between all of the above, and Go behind a contract-first spec.", href: "/work?tech=REST%20API", n: count((e) => e.techStack.includes("REST API") || e.techStack.includes("GraphQL")) },
  { title: "Leadership", line: "Developers on my team build for my clients, under my lead.", href: "/work?ownership=team", n: count((e) => e.team === "led") },
];

export default function AboutPage() {
  const resumePdf = process.env.NEXT_PUBLIC_RESUME_LINK;
  const experiments = lab.flatMap((l) => Experiences.filter((e) => e.id === l.project).map((e) => ({ ...l, e })));

  return (
    <>
      <Scene as="header" id="about" data-rail-label="About" light={[85, 30]} edge="fog" className="pb-16 pt-36 md:pt-44">
        <div className="container grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 data-rise="load" className="type-display">
              {profile.name}
            </h1>
            <p data-rise="load" className="type-title type-soft mt-6">
              {profile.headline}
            </p>
            <div data-rise="load" className="mt-8 max-w-2xl space-y-5 text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-relaxed">
              {profile.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div data-rise="load" className="order-first w-48 md:order-none md:col-span-4 md:col-start-9 md:w-full">
            <Image
              src={Avatar}
              alt={profile.name}
              priority
              sizes="(min-width: 768px) 30vw, 192px"
              className="portrait aspect-[4/5] w-full rounded-lg object-cover object-[50%_30%]"
            />
          </div>
        </div>
      </Scene>

      <Scene id="path" data-rail-label="The path" tone="deep" light={[10, 40]}>
        <div className="container">
          <SceneHeading title="The path" lead="Several of these run at the same time." />
          <ol id="roles" className="relative max-w-3xl">
            <span aria-hidden="true" className="thread left-[7px]" />
            {roles.map((r) => {
              const projects = Experiences.filter((e) => e.client && r.company.startsWith(e.client));
              const current = !r.end;
              return (
                <li key={r.company} data-rise="" className="relative pb-12 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={
                      current
                        ? "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-brand bg-brand shadow-[0_0_0_5px_var(--brand-soft)]"
                        : "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-border-strong bg-background"
                    }
                  />
                  <p className="meta">{formatRange(r)}</p>
                  <h3 className={current ? "type-card mt-1" : "type-card mt-1 text-muted-foreground"}>{r.title ?? r.company}</h3>
                  {r.title ? <p className="mt-1 text-muted-foreground">{r.company}</p> : null}
                  {r.note ? <p className="mt-1.5 text-[15px] text-muted-foreground">{r.note}</p> : null}
                  {projects.length ? (
                    <details className="group/ch mt-3">
                      <summary className="cursor-pointer list-none text-[15px] text-brand [&::-webkit-details-marker]:hidden">
                        {projects.length} projects here
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {projects.map((p) => (
                          <li key={p.id}>
                            <Link href={`/work/${p.id}`} className="text-[15px] hover:text-brand">
                              {p.companyName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="mt-24 grid gap-16 md:grid-cols-2">
            <section id="education" aria-labelledby="education-title" className="scroll-mt-28" data-rise="">
              <h3 id="education-title" className="type-title">
                Education
              </h3>
              <ul className="mt-6 border-t border-border">
                {educations.map((e) => (
                  <li key={e.title} className="border-b border-border py-5">
                    <p className="font-medium">{e.title}</p>
                    <p className="meta mt-1">{e.where}</p>
                    <p className="mt-1.5 text-[15px] text-muted-foreground">{e.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section id="contributions" aria-labelledby="contributions-title" className="scroll-mt-28" data-rise="">
              <h3 id="contributions-title" className="type-title">
                Built with others
              </h3>
              <ul className="mt-6 border-t border-border">
                {contributionsUnsorted.map((c) => (
                  <li key={c.repo} className="border-b border-border py-5">
                    {c.link ? (
                      <Link href={c.link} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">
                        {c.repo}
                      </Link>
                    ) : (
                      <p className="font-medium">{c.repo}</p>
                    )}
                    <p className="meta mt-1">{c.repoOwner}</p>
                    <p className="mt-1.5 text-[15px] text-muted-foreground">{c.contibutionDescription}</p>
                  </li>
                ))}
              </ul>
              <ClientLogos className="mt-14" />
            </section>
          </div>
        </div>
      </Scene>

      <Scene id="how-i-work" data-rail-label="How I work" texture="contour" light={[70, 30]}>
        <div className="container">
          <SceneHeading title="How I work" lead="Five stages, each shown by something on a real project." />
          <ol className="relative grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
            <span aria-hidden="true" className="absolute inset-x-0 top-[7px] hidden h-px bg-gradient-to-r from-brand via-brand/40 to-transparent lg:block" />
            {STAGES.map((s) => {
              const quote = s.quote(s.project);
              return (
                <li key={s.title} data-rise="" className="relative">
                  <span aria-hidden="true" className="block h-[15px] w-[15px] rounded-full border-2 border-brand bg-background" />
                  <h3 className="type-card mt-5">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.line}</p>
                  {quote ? <blockquote className="mt-5 border-l border-border-strong pl-4 text-[15px] leading-relaxed">{quote}</blockquote> : null}
                  <Link href={`/work/${s.project}`} className="meta mt-2 inline-block pl-4 text-brand hover:underline">
                    {find(s.project).companyName}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Scene>

      <Scene id="skills" data-rail-label="Platforms" tone="deep" light={[30, 20]} edge="fog">
        <div className="container">
          <SceneHeading title="Across platforms" lead="How the pieces fit, and every technology with the projects that use it. No ratings." />
          <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
            {AREAS.map((a) => (
              <li key={a.title} data-rise="">
                <Link href={a.href} className="group/a block">
                  <span className="flex items-baseline gap-3">
                    <span className="type-title group-hover/a:text-brand">{a.title}</span>
                    <span className="meta">{a.n}</span>
                  </span>
                  <span className="mt-3 block text-[15px] text-muted-foreground">{a.line}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-24">
            <h3 className="type-title">Every technology, with its proof</h3>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              A counted skill lists the projects on this site that use it. The rest come from work that is not listed here.
            </p>
            <div className="mt-10">
              <SkillTable />
            </div>
          </div>

          <div className="mt-24">
            <h3 className="type-title">What I can build for you</h3>
            <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {services.map((s) => (
                <div key={s.title} className="border-t border-border pt-5">
                  <dt className="font-medium">{s.title}</dt>
                  <dd className="mt-1.5 text-[15px] text-muted-foreground">{s.blurb}</dd>
                  {s.proof?.length ? (
                    <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {s.proof.map((id) => (
                        <Link key={id} href={`/work/${id}`} className="text-[15px] text-brand hover:underline">
                          {find(id).companyName}
                        </Link>
                      ))}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Scene>

      <Scene id="beyond" data-rail-label="Beyond" light={[75, 50]}>
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-rise="">
            <h2 className="type-section">Beyond client work</h2>
            <p className="type-lead mt-6">Games, animations and small tools, built to learn and to play. They live in the Lab.</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/lab" className="text-brand">
                <Cue>Visit the Lab</Cue>
              </Link>
              <Link href="/notes" className="text-foreground hover:text-brand">
                <Cue>Read the notes</Cue>
              </Link>
            </div>
          </div>
          <ul className="border-t border-border lg:col-span-6 lg:col-start-7">
            {experiments.map(({ e, kind }) => (
              <li key={e.id} className="border-b border-border">
                <Link href={`/work/${e.id}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-brand">
                  <span className="font-medium">{e.companyName}</span>
                  <span className="meta capitalize">{kind}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Scene>

      <Testimonials />

      <Scene id="resume-actions" data-rail-label="Resume" light={[50, 80]} className="text-center">
        <div className="container" data-rise="">
          <h2 className="type-section">The short version</h2>
          <p className="type-lead mx-auto mt-5 max-w-md">The same facts on one printable page.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="/resume" className="inline-flex h-12 items-center rounded-full bg-brand px-6 text-[15px] font-medium text-on-brand transition-transform active:scale-[0.98]">
              View resume
            </Link>
            {resumePdf ? (
              <a href={resumePdf} className="text-foreground hover:text-brand">
                <Cue>Download PDF</Cue>
              </a>
            ) : null}
            <Link href="/contact" className="text-foreground hover:text-brand">
              <Cue>Contact me</Cue>
            </Link>
          </div>
        </div>
      </Scene>
    </>
  );
}

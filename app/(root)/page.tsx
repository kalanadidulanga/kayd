import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Scene, SceneHeading, Cue } from "@/components/scene";
import { Atlas, AtlasList } from "@/components/home/atlas";
import { Thinking } from "@/components/home/thinking";
import { Range } from "@/components/home/range";
import { PixelField } from "@/components/lab/pixel-field";
import { Words } from "@/components/motion/words";
import { Experiences, featuredCaseStudies, type ExperienceInterface } from "@/config/experience";
import { lab } from "@/config/lab";
import { now } from "@/config/now";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/config/socials";
import { currentRoles } from "@/config/work-history";
import { skillLabel, skillUsage } from "@/lib/skills";
import { PLATFORMS, projectCover, projectPlatform, projectYears } from "@/lib/work";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Tells search engines who the site is about, from the same config the
// page renders. Escaped so no value can close the script tag.
const jobs = currentRoles.filter((r) => r.title && r.company !== "Freelance");
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: profile.name,
      alternateName: ["Kalana Didulanga", "KayD"],
      url: siteConfig.url,
      image: `${siteConfig.url}/Avatar.png`,
      jobTitle: jobs[0]?.title,
      worksFor: jobs.map((r) => ({ "@type": "Organization", name: r.company })),
      sameAs: SocialLinks.filter((s) => !s.link.startsWith("mailto:")).map((s) => s.link),
      knowsAbout: skillUsage()
        .flatMap((g) => g.skills)
        .sort((a, b) => b.projects.length - a.projects.length)
        .slice(0, 15)
        .map((s) => skillLabel(s.name)),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      author: { "@id": `${siteConfig.url}/#person` },
    },
  ],
}).replace(/</g, "\\u003c");

const email = SocialLinks.find((s) => s.link.startsWith("mailto:"))!.link;
const btnPrimary =
  "inline-flex h-12 items-center gap-3 rounded-full bg-brand px-6 text-[15px] font-medium text-on-brand transition-transform duration-200 ease-cine active:scale-[0.98]";

/** Year, platform and role, each a separate fact. */
function Facts({ e }: { e: ExperienceInterface }) {
  return (
    <dl className="meta flex flex-wrap gap-x-5 gap-y-1">
      <div>
        <dt className="sr-only">Year</dt>
        <dd>{projectYears(e)}</dd>
      </div>
      <div>
        <dt className="sr-only">Platform</dt>
        <dd>{PLATFORMS[projectPlatform(e)]}</dd>
      </div>
      {e.role ? (
        <div>
          <dt className="sr-only">Role</dt>
          <dd>{e.role}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function Hero() {
  const job = jobs[0];
  return (
    <Scene as="section" id="hero" edge="fog" light={[78, 40]} className="flex min-h-[100dvh] flex-col justify-center overflow-x-clip pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="container pointer-events-none relative z-10">
        <div className="pointer-events-auto max-w-[min(100%,46rem)] lg:max-w-[52%]">
          <p data-rise="load" className="text-[15px] text-muted-foreground">
            {profile.name}
          </p>
          <h1 className="type-hero mt-6 lg:whitespace-nowrap">
            <Words text="I build software" delay={0.1} />
            <br className="hidden lg:block" />{" "}
            <Words text="for the real world." delay={0.34} />
          </h1>
          <div data-rise="load" style={{ "--rise-delay": "500ms" } as React.CSSProperties}>
            <p className="type-lead mt-8 max-w-xl">
              Web platforms, mobile apps, Windows software and the operational systems behind a business, from the
              database to the last interaction.
            </p>
            {job ? (
              <p className="mt-5 text-[15px] text-muted-foreground">
                {job.title} at {job.company}.
              </p>
            ) : null}
            {now.text.trim() ? (
              <p id="now" className="meta mt-3">
                Now: {now.text}
              </p>
            ) : null}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/work" className={btnPrimary}>
                Explore work
              </Link>
              <Link href="/about" className="py-3 text-foreground hover:text-brand">
                <Cue>About Kalana</Cue>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-14 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:flex lg:w-[64vw] lg:items-center">
        <Atlas className="w-full" />
      </div>
      <div className="container relative mt-10 lg:hidden">
        <AtlasList />
      </div>
    </Scene>
  );
}

function SelectedSystems() {
  // The operations platform anchors the scene; the others follow as signals.
  const anchor = featuredCaseStudies.find((e) => e.id === "operations-crm-platform") ?? featuredCaseStudies[0];
  const signals = featuredCaseStudies.filter((e) => e !== anchor);
  if (!anchor) return null;
  const anchorCover = projectCover(anchor);
  return (
    <Scene id="selected-work" light={[20, 20]} className="pt-12 md:pt-20">
      {/* The Atlas's root line continues down into the anchor project. */}
      <span aria-hidden="true" className="thread hidden lg:block" style={{ left: "79vw", bottom: "auto", height: "16rem", background: "linear-gradient(var(--brand), transparent)" }} />
      <div className="container">
        <SceneHeading
          title="Selected systems"
          lead="Told in depth: what each system does, what I owned, and the decisions behind it."
          action={
            <Link href="/work" className="text-brand">
              <Cue>All {Experiences.length} projects</Cue>
            </Link>
          }
        />
        <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div data-rise="" className="lg:col-span-5">
            <Facts e={anchor} />
            <h3 className="type-display mt-5">{anchor.companyName}</h3>
            <p className="type-lead mt-6">{anchor.shortDescription}</p>
            {anchor.caseStudy?.outcome ? <p className="mt-6 font-medium text-brand">{anchor.caseStudy.outcome}</p> : null}
            <Link href={`/work/${anchor.id}`} className="mt-8 inline-block text-foreground hover:text-brand">
              <Cue>Read the case study</Cue>
            </Link>
          </div>
          {anchorCover ? (
            <div data-rise="" className="mask-reveal lg:col-span-7 lg:-mr-[4vw]">
              <Image
                src={anchorCover}
                alt={`${anchor.companyName} screenshot`}
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="shadow-soft aspect-[16/10] w-full rounded-lg border border-border-strong object-cover object-left-top"
              />
            </div>
          ) : null}
        </article>
        <div className="mt-24 grid gap-16 md:mt-32 md:grid-cols-12">
          {signals.map((e, i) => {
            const cover = projectCover(e);
            return (
              <article key={e.id} data-rise="" className={i === 0 ? "md:col-span-6" : "md:col-span-5 md:col-start-8 md:mt-24"}>
                {cover ? (
                  <Image
                    src={cover}
                    alt={`${e.companyName} screenshot`}
                    width={1440}
                    height={900}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="mb-8 aspect-[16/9] w-full rounded-lg border border-border object-cover object-top"
                  />
                ) : null}
                <Facts e={e} />
                <h3 className="type-title mt-4">{e.companyName}</h3>
                {e.caseStudy?.outcome && !cover ? <p className="type-title type-soft mt-2">{e.caseStudy.outcome}</p> : null}
                <p className="mt-4 text-muted-foreground">{e.shortDescription}</p>
                <Link href={`/work/${e.id}`} className="mt-6 inline-block text-foreground hover:text-brand">
                  <Cue>Read the case study</Cue>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}

function LabSignal() {
  const experiments = lab
    .filter((l) => l.kind === "experiment")
    .flatMap((l) => Experiences.filter((e) => e.id === l.project));
  return (
    <Scene id="lab-signal" light={[80, 50]} overlap>
      <div className="container grid items-center gap-12 lg:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:col-span-7">
          <Image src="/lab/lab-poster.webp" alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="art object-cover opacity-40" />
          <PixelField className="absolute inset-0 h-full w-full" />
          <p className="meta absolute bottom-4 left-4">Cursor field. Move a pointer across it.</p>
        </div>
        <div data-rise="" className="lg:col-span-5">
          <h2 className="type-section">From the Lab</h2>
          <p className="type-lead mt-6">Small things I build to learn and to play: games, animations and small tools.</p>
          <ul className="mt-8 border-t border-border">
            {experiments.map((e) => (
              <li key={e.id} className="border-b border-border">
                <Link href={`/work/${e.id}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-brand">
                  <span className="font-medium">{e.companyName}</span>
                  <span className="meta">{e.techStack.map(skillLabel).join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/lab" className="mt-8 inline-block text-brand">
            <Cue>Visit the Lab</Cue>
          </Link>
        </div>
      </div>
    </Scene>
  );
}

function PersonalNote() {
  return (
    <Scene id="personal" tone="deep" light={[15, 50]} edge="fog">
      <div className="container grid items-center gap-12 md:grid-cols-12">
        <div data-rise="" className="mx-auto w-56 md:col-span-4 md:w-full lg:col-span-3 lg:col-start-2">
          <Image
            src="/Avatar.png"
            alt={profile.name}
            width={600}
            height={600}
            sizes="(min-width: 768px) 25vw, 224px"
            className="portrait aspect-[4/5] w-full rounded-lg object-cover object-[50%_30%]"
          />
        </div>
        <div data-rise="" className="md:col-span-8 lg:col-span-6 lg:col-start-6">
          <h2 className="type-title">A note from me</h2>
          <div className="mt-6 space-y-5 text-[clamp(1.0625rem,1.5vw,1.3125rem)] leading-relaxed">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link href="/about" className="mt-8 inline-block text-brand">
            <Cue>More about me</Cue>
          </Link>
        </div>
      </div>
    </Scene>
  );
}

function Closing() {
  return (
    <Scene id="contact" light={[50, 100]} className="pb-10 text-center md:pb-16">
      <div aria-hidden="true" className="glow absolute inset-x-0 -bottom-64 mx-auto h-[90%] max-w-5xl" />
      <div className="container relative">
        <h2 className="type-display mx-auto max-w-4xl">
          <Words text="Have a system worth building?" onView />
        </h2>
        <p data-rise="" className="type-lead mx-auto mt-7 max-w-md">
          A product idea, an operational problem, an engineering role, or simply hello.
        </p>
        <div data-rise="" className="mt-10 flex flex-col items-center gap-5">
          <Link href="/contact" className={btnPrimary}>
            Start a conversation
          </Link>
          <a href={email} className="text-[15px] text-muted-foreground hover:text-brand">
            or email {email.replace("mailto:", "")}
          </a>
        </div>
        {/* Every line on the page arrives here: one quiet source. */}
        <span aria-hidden="true" className="mx-auto mt-20 block h-24 w-px bg-gradient-to-b from-transparent to-brand" />
        <span aria-hidden="true" className="mx-auto block h-2 w-2 rounded-full bg-brand shadow-[0_0_24px_6px_var(--fog-strong)]" />
      </div>
    </Scene>
  );
}

export default function IndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <Hero />
      <SelectedSystems />
      <Thinking />
      <Range />
      <LabSignal />
      <PersonalNote />
      <Closing />
    </>
  );
}

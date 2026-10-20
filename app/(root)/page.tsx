import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Scene, Cue } from "@/components/scene";
import { Atlas, AtlasList } from "@/components/home/atlas";
import { Thinking } from "@/components/home/thinking";
import { Range } from "@/components/home/range";
import { GitHubField } from "@/components/home/github-field";
import { PixelField } from "@/components/lab/pixel-field";
import { Words } from "@/components/motion/words";
import { ScrubText } from "@/components/motion/scrub-text";
import { Experiences } from "@/config/experience";
import { lab } from "@/config/lab";
import { now } from "@/config/now";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/config/socials";
import { currentRoles } from "@/config/work-history";
import { skillLabel, skillUsage } from "@/lib/skills";

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
      alternateName: profile.alternateNames,
      givenName: "Kalana",
      additionalName: "Didulanga",
      familyName: "Koralegedara",
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

function Hero() {
  const job = jobs[0];
  return (
    <Scene as="section" id="hero" data-rail-label="Start" edge="fog" light={[78, 40]} className="flex min-h-[100dvh] flex-col justify-center overflow-x-clip pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="container pointer-events-none relative z-10">
        <div className="hero-copy pointer-events-auto max-w-[min(100%,46rem)] lg:max-w-[52%]">
          <p data-rise="load" className="text-[15px] text-muted-foreground">
            {profile.displayName}
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
      <div className="relative mt-14 lg:absolute lg:inset-y-0 lg:right-[3vw] lg:mt-0 lg:flex lg:w-[62vw] lg:items-center">
        <Atlas className="w-full" />
      </div>
      <div className="container relative mt-10 lg:hidden">
        <AtlasList />
      </div>
    </Scene>
  );
}

function LabSignal() {
  const experiments = lab
    .filter((l) => l.kind === "experiment")
    .flatMap((l) => Experiences.filter((e) => e.id === l.project));
  return (
    <Scene id="lab-signal" data-rail-label="Lab" light={[80, 50]} overlap>
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
    <Scene id="personal" data-rail-label="A note" tone="deep" light={[15, 50]} edge="fog">
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
              <p key={p}>
                <ScrubText text={p} />
              </p>
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
    <Scene id="contact" data-rail-label="Contact" light={[50, 100]} className="pb-10 text-center md:pb-16">
      <div aria-hidden="true" className="glow absolute inset-x-0 bottom-0 mx-auto h-[80%] max-w-5xl" />
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
      <GitHubField />
      <Thinking />
      <Range />
      <LabSignal />
      <PersonalNote />
      <Closing />
    </>
  );
}

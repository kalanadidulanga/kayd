import Link from "next/link";

import { Section, SectionHeading, ArrowLink } from "@/components/section";
import { Hero, btnPrimary } from "@/components/home/hero";
import { Deck, type DeckCard } from "@/components/home/deck";
import { WhatIDo } from "@/components/home/what-i-do";
import { ClientLogos } from "@/components/client-logos";
import { Services } from "@/components/services";
import { WorkList } from "@/components/work-row";
import { Testimonials } from "@/components/testimonials";
import { GitLog } from "@/components/git-log";
import { SkillChips } from "@/components/skill-groups";
import { Magnetic } from "@/components/motion/magnetic";
import { Words } from "@/components/motion/words";
import { Reveal } from "@/components/reveal";
import { Experiences, featuredCaseStudies } from "@/config/experience";
import { logEntries } from "@/config/work-history";
import { skillLabel } from "@/lib/skills";
import { projectCover, projectKind, projectYears } from "@/lib/work";

const HOME_ROWS = 8;

// Only what a card shows crosses into the client bundle.
const deck: DeckCard[] = featuredCaseStudies.map((e) => ({
  id: e.id,
  name: e.companyName,
  meta: [projectYears(e), projectKind(e)].join(" · "),
  short: e.shortDescription,
  outcome: e.caseStudy?.outcome,
  problem: e.caseStudy?.problem,
  stack: e.techStack.slice(0, 4).map(skillLabel),
  cover: projectCover(e),
}));

export default function IndexPage() {
  return (
    <>
      <Hero />

      {deck.length ? (
        <Section id="selected-work">
          <SectionHeading eyebrow="Case studies" title="Selected work," serif="in depth." />
          <Deck cards={deck} />
        </Section>
      ) : null}

      <WhatIDo />
      <ClientLogos />

      <Section id="work">
        <SectionHeading
          eyebrow="Index"
          title="All work,"
          serif="newest first."
          action={
            <Link href="/work" className="text-brand">
              <ArrowLink>See all {Experiences.length}</ArrowLink>
            </Link>
          }
        />
        <Reveal>
          <WorkList projects={Experiences.slice(0, HOME_ROWS)} />
        </Reveal>
      </Section>

      <Testimonials />

      <Section id="experience" band>
        <SectionHeading
          eyebrow="git log --author=kalana"
          title="Experience,"
          serif="newest first."
          action={
            <Link href="/experience" className="text-brand">
              <ArrowLink>More about me</ArrowLink>
            </Link>
          }
        />
        <GitLog entries={logEntries()} />
      </Section>

      <Section id="skills">
        <SectionHeading
          eyebrow="Stack"
          title="Skills,"
          serif="counted from the work."
          lead="A number is how many projects on this site use it. The rest come from work not listed here."
          action={
            <Link href="/skills" className="text-brand">
              <ArrowLink>All skills</ArrowLink>
            </Link>
          }
        />
        <Reveal>
          <SkillChips />
        </Reveal>
      </Section>

      <Services />

      <section id="contact" className="relative overflow-hidden py-32 text-center md:py-44">
        <div aria-hidden="true" className="glow absolute inset-x-0 -bottom-1/3 mx-auto h-[600px] max-w-5xl" />
        <div className="container relative">
          <Reveal>
            <p className="eyebrow">Contact</p>
          </Reveal>
          <h2 className="type-hero mx-auto mt-6 max-w-4xl">
            <Words text="Let's build" onView />
            <br />
            <Words text="something real." onView delay={0.16} wordClassName="serif-accent serif-gradient" />
          </h2>
          <Reveal delay={300}>
            <p className="type-lead mx-auto mt-7 max-w-md">A project, a role, or a question: send a message.</p>
            <div className="mt-10 flex justify-center">
              <Magnetic>
                <Link href="/contact" className={btnPrimary}>
                  Get in touch <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

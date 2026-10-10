import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Avatar from "@/public/avatar.svg";
import { Section, SectionHeading } from "@/components/section";
import { GitLog } from "@/components/git-log";
import { Reveal } from "@/components/reveal";
import { profile } from "@/config/profile";
import { logEntries } from "@/config/work-history";
import { educations } from "@/config/educations";
import { contributionsUnsorted } from "@/config/contributions";

export const metadata: Metadata = {
  title: "Experience",
  description: "Where I have worked, what I studied, and what I have contributed to.",
};

function Row({ side, title, body, href }: { side: string; title: string; body: string; href?: string }) {
  return (
    <li className="grid gap-1 border-b border-border py-7 md:grid-cols-[14rem_1fr] md:gap-10">
      <span className="font-mono text-[13px] text-subtle">{side}</span>
      <div>
        {href ? (
          <Link href={href} target="_blank" rel="noreferrer" className="type-card text-brand hover:underline">
            {title}
          </Link>
        ) : (
          <p className="type-card">{title}</p>
        )}
        <p className="mt-1.5 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

export default function ExperiencePage() {
  return (
    <>
      <section id="about" className="relative overflow-hidden pb-24 pt-36 md:pb-36 md:pt-48">
        <div aria-hidden="true" className="glow absolute -right-40 top-10 h-[520px] w-[620px]" />
        <div className="container relative grid items-center gap-12 md:grid-cols-[1fr_17rem] md:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">About</p>
              <h1 className="type-hero mt-6">
                Experience,{" "}
                <span className="serif-accent serif-gradient">
                  {profile.yearsOfExperience} years in.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <div className="type-lead mt-8 max-w-2xl space-y-5">
                {profile.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={250} className="order-first md:order-0">
            <div className="relative mx-auto w-36 md:w-full">
              <div aria-hidden="true" className="absolute -inset-3 rounded-[2.2rem] bg-brand-soft blur-xl" />
              <Image
                src={Avatar}
                alt={profile.name}
                width={272}
                height={272}
                priority
                className="relative aspect-square w-full rounded-[2rem] border border-border-strong bg-band object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Section id="roles" band>
        <SectionHeading eyebrow="git log --author=kalana" title="Roles," serif="newest first." lead="Several run at the same time." />
        <GitLog entries={logEntries()} />
      </Section>

      <Section id="education">
        <SectionHeading eyebrow="Education" title="Where I" serif="studied." />
        <Reveal>
          <ul className="border-t border-border">
            {educations.map((e) => (
              <Row key={e.title} side={e.where} title={e.title} body={e.description} />
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section id="contributions" band>
        <SectionHeading eyebrow="Contributions" title="Built with" serif="others." />
        <Reveal>
          <ul className="border-t border-border">
            {contributionsUnsorted.map((c) => (
              <Row
                key={c.repo}
                side={c.repoOwner}
                title={c.repo}
                body={c.contibutionDescription}
                href={c.link || undefined}
              />
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}

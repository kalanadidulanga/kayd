import { Metadata } from "next";

import { Section, SectionHeading } from "@/components/section";
import { SkillTable } from "@/components/skill-groups";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Skills",
  description: "Every skill, with the projects on this site that use it.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <Section className="pt-36 md:pt-48">
      <SectionHeading
        as="h1"
        eyebrow="Stack"
        title="Skills,"
        serif="proven by the work."
        lead="A counted skill lists the projects on this site that use it. The rest come from work not listed here. No ratings."
      />
      <Reveal>
        <SkillTable />
      </Reveal>
    </Section>
  );
}

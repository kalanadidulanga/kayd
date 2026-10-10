import { Metadata } from "next";

import { Section, SectionHeading } from "@/components/section";
import { WorkList } from "@/components/work-row";
import { Reveal } from "@/components/reveal";
import { Experiences } from "@/config/experience";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Client platforms, products of my own, and work I lead: every project, newest first.",
};

const professional = Experiences.filter((e) => e.type === "Professional");
const personal = Experiences.filter((e) => e.type === "Personal Project");
const firstYear = Math.min(
  ...Experiences.map((e) => e.startDate?.getUTCFullYear() ?? Infinity)
);

export default function WorkPage() {
  return (
    <Section className="pt-36 md:pt-48">
      <SectionHeading
        as="h1"
        eyebrow="Index"
        title="Work,"
        serif="every project."
        lead={`${Experiences.length} projects since ${firstYear}: client platforms, products of my own, and work I lead.`}
      />
      <Reveal>
        <Tabs defaultValue="all">
          <TabsList aria-label="Filter projects">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-10">
            <WorkList projects={Experiences} />
          </TabsContent>
          <TabsContent value="professional" className="mt-10">
            <WorkList projects={professional} />
          </TabsContent>
          <TabsContent value="personal" className="mt-10">
            <WorkList projects={personal} />
          </TabsContent>
        </Tabs>
      </Reveal>
    </Section>
  );
}

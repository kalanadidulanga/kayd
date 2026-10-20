import { Suspense } from "react";
import type { Metadata } from "next";

import { Scene, SceneHeading } from "@/components/scene";
import { Explorer, ExplorerView } from "@/components/work/explorer";
import { Experiences } from "@/config/experience";
import { summarize } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Client platforms, products of my own, and work I lead: every project, searchable by technology, domain and platform.",
  alternates: { canonical: "/work" },
};

const projects = Experiences.map(summarize);
const firstYear = Math.min(...Experiences.map((e) => e.startDate?.getUTCFullYear() ?? Infinity));

export default function WorkPage() {
  return (
    <Scene as="div" texture="grid" light={[80, 10]} className="pt-36 md:pt-44">
      <div id="explorer" className="container scroll-mt-28">
        <SceneHeading
          as="h1"
          title="Work"
          lead={`${projects.length} projects since ${firstYear}: client platforms, products of my own, and work I lead. Every one is here, with or without pictures.`}
        />
        <Suspense fallback={<ExplorerView projects={projects} initial={{}} />}>
          <Explorer projects={projects} />
        </Suspense>
      </div>
    </Scene>
  );
}

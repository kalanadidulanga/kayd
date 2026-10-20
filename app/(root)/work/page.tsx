import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { Scene, SceneHeading } from "@/components/scene";
import { Explorer, ExplorerView } from "@/components/work/explorer";
import { Experiences } from "@/config/experience";
import { domainArt, workFieldArt } from "@/lib/art";
import { summarize } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Client platforms, products of my own, and work I lead: every project, searchable by technology, domain and platform.",
  alternates: { canonical: "/work" },
};

const projects = Experiences.map(summarize);
const firstYear = Math.min(...Experiences.map((e) => e.startDate?.getUTCFullYear() ?? Infinity));

export default function WorkPage() {
  const art = domainArt();
  const field = workFieldArt();
  return (
    <Scene as="div" light={[80, 8]} edge="fog" className="overflow-x-clip pt-36 md:pt-44">
      {field ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(90vh,820px)]">
          <Image
            src={field}
            alt=""
            fill
            priority
            sizes="100vw"
            className="art object-cover object-right opacity-80 [mask-image:linear-gradient(to_right,transparent_15%,#000_60%),linear-gradient(to_bottom,#000_55%,transparent)] [mask-composite:intersect]"
          />
        </div>
      ) : null}
      <div id="explorer" className="container scroll-mt-28">
        <SceneHeading
          as="h1"
          title="Work"
          lead={`${projects.length} projects since ${firstYear}: client platforms, products of my own, and work I lead. Every one is here, with or without pictures.`}
        />
        <Suspense fallback={<ExplorerView projects={projects} initial={{}} art={art} />}>
          <Explorer projects={projects} art={art} />
        </Suspense>
      </div>
    </Scene>
  );
}

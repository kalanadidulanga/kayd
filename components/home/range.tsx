import Link from "next/link";
import { Globe, Monitor, ShoppingBag, Smartphone, Users } from "lucide-react";

import { Scene, SceneHeading } from "@/components/scene";
import { Experiences, type ExperienceInterface } from "@/config/experience";
import { services } from "@/config/services";
import { profile } from "@/config/profile";
import { siteStats } from "@/lib/stats";
import { projectPlatform } from "@/lib/work";

const byId = (ids: string[]) => ids.flatMap((id) => Experiences.filter((e) => e.id === id));
const proofOf = (...icons: string[]) =>
  byId(services.filter((s) => icons.includes(s.icon)).flatMap((s) => s.proof ?? []));
const servicesOf = (...icons: string[]) => services.filter((s) => icons.includes(s.icon)).map((s) => s.title);

type Discipline = {
  title: string;
  icon: typeof Globe;
  href: string;
  /** The services from config/services.ts this discipline covers. */
  offers: string[];
  projects: ExperienceInterface[];
  count: number;
  /** Position on the desktop field map, in percent. */
  at: [number, number];
};

/**
 * Five disciplines, each pulled from the config: the services it covers,
 * the projects those services cite as proof, and how many listed projects
 * sit in it. Leadership has no service of its own; its projects are the
 * ones Kalana led a team on.
 */
export const DISCIPLINES: Discipline[] = [
  {
    title: "Web platforms",
    icon: Globe,
    href: "/work?platform=web",
    offers: servicesOf("webapp", "website"),
    projects: proofOf("webapp", "website"),
    count: Experiences.filter((e) => projectPlatform(e) === "web").length,
    at: [6, 10],
  },
  {
    title: "Mobile apps",
    icon: Smartphone,
    href: "/work?platform=mobile",
    offers: servicesOf("mobile"),
    projects: proofOf("mobile"),
    count: Experiences.filter((e) => projectPlatform(e) === "mobile").length,
    at: [56, 2],
  },
  {
    title: "Windows software",
    icon: Monitor,
    href: "/work?platform=desktop",
    offers: servicesOf("software"),
    projects: [...proofOf("software"), ...Experiences.filter((e) => projectPlatform(e) === "desktop" && e.id !== "project-mouse")],
    count: Experiences.filter((e) => projectPlatform(e) === "desktop").length,
    at: [74, 44],
  },
  {
    title: "Commerce and POS",
    icon: ShoppingBag,
    href: "/work?domain=commerce",
    offers: servicesOf("pos", "store"),
    projects: proofOf("pos", "store"),
    count: Experiences.filter((e) => e.domain === "commerce").length,
    at: [4, 58],
  },
  {
    title: "Technical leadership",
    icon: Users,
    href: "/work?ownership=team",
    offers: [],
    projects: Experiences.filter((e) => e.team === "led"),
    count: Experiences.filter((e) => e.team === "led").length,
    at: [44, 76],
  },
];

function Field({ d }: { d: Discipline }) {
  const Icon = d.icon;
  return (
    <div data-rise="" className="max-w-xs">
      <Link href={d.href} className="group/d inline-flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-border-strong bg-background text-brand transition-colors group-hover/d:border-brand">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="type-card group-hover/d:text-brand">{d.title}</span>
        <span className="meta">{d.count}</span>
      </Link>
      {d.offers.length ? <p className="mt-3 text-[15px] text-muted-foreground">{d.offers.join(", ")}</p> : null}
      {d.title === "Technical leadership" ? (
        <p className="mt-3 text-[15px] text-muted-foreground">Developers on my team build for my clients, under my lead.</p>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {d.projects.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link href={`/work/${p.id}`} className="text-[15px] text-brand hover:underline">
              {p.companyName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Range: the disciplines as a field map on desktop, a list on phones. */
export function Range() {
  return (
    <Scene id="range" tone="clear" texture="grid" light={[50, 60]}>
      <div className="container">
        <SceneHeading
          title="Range"
          soft="across the stack."
          lead={
            <span data-testid="stats-strip">
              {siteStats.projects} projects, {siteStats.clients} clients, {siteStats.technologies} technologies, since {profile.experienceSince}.
            </span>
          }
        />
        <div className="relative lg:h-[600px]">
          <svg aria-hidden="true" className="absolute inset-0 hidden h-full w-full text-border lg:block" preserveAspectRatio="none" viewBox="0 0 100 100">
            {DISCIPLINES.map((d, i) => {
              // A ring through the five, joined at their icons.
              const o = DISCIPLINES[(i + 1) % DISCIPLINES.length];
              return <line key={d.title} x1={d.at[0] + 1.6} y1={d.at[1] + 3.5} x2={o.at[0] + 1.6} y2={o.at[1] + 3.5} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
          <ul className="grid gap-12 sm:grid-cols-2 lg:block">
            {DISCIPLINES.map((d) => (
              <li key={d.title} className="lg:absolute" style={{ left: `${d.at[0]}%`, top: `${d.at[1]}%` }}>
                <Field d={d} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  );
}

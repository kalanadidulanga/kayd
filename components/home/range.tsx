import { Scene, SceneHeading } from "@/components/scene";
import { RangeField, type FieldDiscipline, type FieldNode, type FieldRing } from "@/components/home/range-field";
import { Experiences, type ExperienceInterface } from "@/config/experience";
import { services } from "@/config/services";
import { profile } from "@/config/profile";
import { siteStats } from "@/lib/stats";
import { projectPlatform } from "@/lib/work";

const servicesOf = (...icons: string[]) => services.filter((s) => icons.includes(s.icon));
const proofOf = (...icons: string[]) =>
  servicesOf(...icons)
    .flatMap((s) => s.proof ?? [])
    .flatMap((id) => Experiences.filter((e) => e.id === id));

/**
 * Five disciplines, each pulled from the config: the services it covers,
 * the projects those services cite as proof, and which listed projects sit
 * in it. Leadership has no service of its own; its projects are the ones
 * Kalana led a team on.
 */
const DISCIPLINES: (Omit<FieldDiscipline, "count" | "proof" | "offers"> & {
  test: (e: ExperienceInterface) => boolean;
  icons: string[];
  proof: ExperienceInterface[];
})[] = [
  { key: "web", title: "Web platforms", href: "/work?platform=web", icons: ["webapp", "website"], test: (e) => projectPlatform(e) === "web", proof: proofOf("webapp", "website") },
  { key: "mobile", title: "Mobile apps", href: "/work?platform=mobile", icons: ["mobile"], test: (e) => projectPlatform(e) === "mobile", proof: proofOf("mobile") },
  { key: "desktop", title: "Windows software", href: "/work?platform=desktop", icons: ["software"], test: (e) => projectPlatform(e) === "desktop", proof: proofOf("software") },
  { key: "commerce", title: "Commerce and POS", href: "/work?domain=commerce", icons: ["pos", "store"], test: (e) => e.domain === "commerce", proof: proofOf("pos", "store") },
  { key: "team", title: "Technical leadership", href: "/work?ownership=team", icons: [], test: (e) => e.team === "led", proof: Experiences.filter((e) => e.team === "led") },
];

const C = 300;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/**
 * Plants every project on a phyllotaxis spiral, oldest at the centre, and
 * draws a ring where each year ends. Deterministic, so the server and the
 * client agree on every position.
 */
function plant() {
  const byAge = [...Experiences].reverse();
  const k = 215 / Math.sqrt(Math.max(byAge.length - 1, 1));
  const radius = (i: number) => 42 + k * Math.sqrt(i);
  const nodes: FieldNode[] = byAge.map((e, i) => ({
    id: e.id,
    title: e.companyName,
    x: Math.round((C + radius(i) * Math.cos(i * GOLDEN)) * 10) / 10,
    y: Math.round((C + radius(i) * Math.sin(i * GOLDEN)) * 10) / 10,
    in: DISCIPLINES.flatMap((d, j) => (d.test(e) ? [j] : [])),
    ring: 0,
  }));
  const rings: FieldRing[] = [];
  byAge.forEach((e, i) => {
    const year = e.startDate?.getUTCFullYear();
    const next = byAge[i + 1]?.startDate?.getUTCFullYear();
    nodes[i].ring = rings.length;
    if (year && year !== next) rings.push({ year, r: Math.round(radius(i) + 12) });
  });
  return { nodes, rings };
}

/** Range: one field of every project, lit by discipline. */
export function Range() {
  const { nodes, rings } = plant();
  const disciplines: FieldDiscipline[] = DISCIPLINES.map((d) => ({
    key: d.key,
    title: d.title,
    href: d.href,
    count: Experiences.filter(d.test).length,
    offers: d.icons.length ? servicesOf(...d.icons).map((s) => s.title).join(", ") : "Developers on my team build for my clients, under my lead.",
    proof: d.proof.slice(0, 3).map((e) => ({ id: e.id, title: e.companyName })),
  }));

  return (
    <Scene id="range" data-rail-label="Range" light={[70, 50]}>
      <div className="container">
        <SceneHeading
          title="Range"
          lead={
            <>
              <span data-testid="stats-strip">
                {siteStats.projects} projects, {siteStats.clients} clients, {siteStats.technologies} technologies, since {profile.experienceSince}.
              </span>{" "}
              Each dot is one, planted by year from the centre out. Choose a discipline to light its work.
            </>
          }
        />
        <RangeField nodes={nodes} disciplines={disciplines} rings={rings} />
      </div>
    </Scene>
  );
}

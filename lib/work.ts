import { Experiences, type Domain, type ExperienceInterface, type Presentation } from "@/config/experience";
import { skillLabel } from "@/lib/skills";

/** A real screenshot for the project, or undefined. Never a stand-in. */
export function projectCover(e: ExperienceInterface): string | undefined {
  return e.coverImg ?? e.pagesInfoArr?.find((p) => p.imgArr?.length)?.imgArr?.[0];
}

/**
 * "2024" or "2024 to 2025". A project with no end date shows its start year
 * only: an open end is not a claim that the work is still going.
 */
export function projectYears(e: ExperienceInterface): string {
  const start = e.startDate?.getUTCFullYear();
  const end = e.endDate?.getUTCFullYear();
  if (!start) return "";
  return end && end !== start ? `${start} to ${end}` : String(start);
}

export type Platform = "web" | "mobile" | "desktop";
export type Ownership = "professional" | "personal";

export const PLATFORMS: Record<Platform, string> = { web: "Web", mobile: "Mobile", desktop: "Desktop" };
export const OWNERSHIP: Record<Ownership, string> = { professional: "Professional", personal: "Personal" };
export const DOMAINS: Record<Domain, string> = {
  operations: "Operations",
  hospitality: "Hospitality",
  education: "Education",
  commerce: "Commerce",
  tools: "Tools",
  experiments: "Experiments",
};
export const DEPTHS: Record<Presentation, string> = {
  "case-study": "Case study",
  story: "Project story",
  note: "Project note",
};

/** Where the project runs, read from its categories: one platform each. */
export function projectPlatform(e: ExperienceInterface): Platform {
  if (e.category.includes("Desktop App")) return "desktop";
  if (e.category.includes("Mobile Dev")) return "mobile";
  return "web";
}

export function projectOwnership(e: ExperienceInterface): Ownership {
  return e.type === "Professional" ? "professional" : "personal";
}

export function projectDepth(e: ExperienceInterface): Presentation {
  return e.presentation ?? "note";
}

/** One row of the Work index: only what the list shows crosses to the client. */
export type ProjectSummary = {
  id: string;
  title: string;
  summary: string;
  year?: number;
  years: string;
  role?: string;
  team?: "led" | "member";
  platform: Platform;
  ownership: Ownership;
  domain: Domain;
  depth: Presentation;
  stack: string[];
  cover?: string;
};

export function summarize(e: ExperienceInterface): ProjectSummary {
  return {
    id: e.id,
    title: e.companyName,
    summary: e.shortDescription,
    year: e.startDate?.getUTCFullYear(),
    years: projectYears(e),
    role: e.role,
    team: e.team,
    platform: projectPlatform(e),
    ownership: projectOwnership(e),
    domain: e.domain,
    depth: projectDepth(e),
    stack: e.techStack.map(skillLabel),
    cover: projectCover(e),
  };
}

/**
 * Other projects that share the most with this one: the same domain counts
 * most, then each shared technology. Ties keep the newest first.
 */
export function relatedProjects(e: ExperienceInterface, count = 3): ExperienceInterface[] {
  const score = (o: ExperienceInterface) =>
    (o.domain === e.domain ? 3 : 0) +
    (o.client && o.client === e.client ? 2 : 0) +
    o.techStack.filter((t) => e.techStack.includes(t)).length;
  return Experiences.filter((o) => o.id !== e.id)
    .map((o) => ({ o, s: score(o) }))
    .filter(({ s }) => s > 1)
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map(({ o }) => o);
}

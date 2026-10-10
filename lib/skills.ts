import { Experiences, type ExperienceInterface } from "@/config/experience";
import { declaredSkills, skillGroups } from "@/config/skills";
import type { ValidSkills } from "@/config/constants";

export interface SkillUse {
  name: ValidSkills;
  projects: ExperienceInterface[];
}

/**
 * Every grouped skill with the projects that use it, most used first, then
 * the skills Kalana states with no listed project behind them (`stated`,
 * shown without a count). Anything else is dropped, and so is a group left
 * empty: the page only claims what the work or his word backs.
 */
export function skillUsage(): { title: string; skills: SkillUse[]; stated: ValidSkills[] }[] {
  const used = new Set(Experiences.flatMap((e) => e.techStack));
  return skillGroups
    .map((g) => ({
      title: g.title,
      skills: g.skills
        .map((name) => ({
          name,
          projects: Experiences.filter((e) => e.techStack.includes(name)),
        }))
        .filter((s) => s.projects.length > 0)
        .sort((a, b) => b.projects.length - a.projects.length),
      stated: g.skills.filter((s) => !used.has(s) && declaredSkills.includes(s)),
    }))
    .filter((g) => g.skills.length + g.stated.length > 0);
}

const LABELS: Partial<Record<ValidSkills, string>> = {
  Typescript: "TypeScript",
  Javascript: "JavaScript",
  "express.js": "Express",
  JAVA: "Java",
  "Java desktop": "Java",
  Android: "Android (Java)",
};

/** The display name: the config keys predate consistent casing. */
export function skillLabel(name: ValidSkills): string {
  return LABELS[name] ?? name;
}

/** A stable id for linking to a skill on the Skills page. */
export function skillId(name: ValidSkills): string {
  const slug = name
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `skill-${slug}`;
}

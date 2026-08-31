import { Experiences } from "@/config/experience";

/**
 * Every number shown on the site is computed here, never written by hand,
 * so a stale figure cannot silently become a false claim.
 *
 * Deliberately absent: years of experience. The config documents
 * 2023-11 to 2024-09 only, so any derived figure would count undocumented
 * years as continuous work.
 */
export const siteStats = {
  projects: Experiences.length,

  // Keyed on client where several projects belong to one client, so a client
  // with two projects counts once.
  clients: new Set(
    Experiences.filter((e) => e.type === "Professional").map(
      (e) => e.client ?? e.companyName
    )
  ).size,

  technologies: new Set(Experiences.flatMap((e) => e.techStack)).size,
};

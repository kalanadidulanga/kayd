import type { ExperienceInterface } from "@/config/experience";

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

export function projectKind(e: ExperienceInterface): string {
  return e.type === "Professional" ? "Professional" : "Personal project";
}

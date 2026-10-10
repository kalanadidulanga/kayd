import type { ValidSkills } from "./constants";

/**
 * Facts about Kalana, as he stated them. Every value is a literal he gave
 * or approved, so nothing here can drift into being false.
 *
 * yearsOfExperience and experienceSince come from the owner on 2026-10-09
 * ("about 3 years", freelancing since 2023). They are never derived from
 * today's date: that would invent a new number on every build.
 */
export const profile = {
  name: "Kalana Didulanga",
  headline: "Full stack engineer. Web, mobile and desktop.",
  yearsOfExperience: 3,
  experienceSince: 2023,
  /** What the hero code window lists. Each is used by a listed project (tested). */
  ships: ["web platforms", "mobile apps", "Windows software"],
  signatureStack: ["Next.js", "Supabase", "Go", "Rust", "Expo"] as ValidSkills[],
  about: [
    "I'm a full stack engineer with three years of experience. I work as a Software Engineer at TwinCoreTech and as a project manager and engineer at C-Lento, and I have freelanced since 2023.",
    "I build web platforms with Next.js and Supabase, mobile apps with Expo, Windows software with Rust, Tauri, Electron and .NET, and APIs in Node.js and Go. I also lead developers who build for my clients.",
  ],
};

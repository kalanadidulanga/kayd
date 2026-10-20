/**
 * What the Lab shows, by project id from config/experience.ts. Titles,
 * stacks and links come from the project itself; this file only sorts each
 * one and says how it is used. `why` is quoted from the project's own text
 * and left out where that text gives no reason. No planned or imagined
 * experiments: add one here only once it exists.
 */
export interface LabEntry {
  project: string;
  kind: "experiment" | "tool" | "archive";
  /** How a visitor uses it. */
  input?: string;
  why?: string;
}

export const lab: LabEntry[] = [
  { project: "snake-game", kind: "experiment", input: "Arrow keys, or swipe on a phone" },
  {
    project: "2048-game",
    kind: "experiment",
    input: "Arrow keys, or swipe on a phone",
    why: "A way to dive into game mechanics.",
  },
  {
    project: "ascii-donut-animation",
    kind: "experiment",
    input: "Watch it spin",
    why: "An exploration of how simple characters can create engaging visual experiences on the web.",
  },
  { project: "kayd-invoice-studio", kind: "tool", input: "In the browser, no account" },
  { project: "project-mouse", kind: "tool", input: "Windows tray app and command line" },
  { project: "hilink", kind: "archive", why: "A personal project for improving my frontend skills." },
];

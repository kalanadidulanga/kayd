import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { Experiences } from "../config/experience";
import { declaredSkills, skillGroups } from "../config/skills";
import { skillUsage } from "../lib/skills";
import { roles } from "../config/work-history";
import { services } from "../config/services";
import { isSpam } from "../lib/contact";

// Pure data checks: no page is loaded. They pin the nothing-invented rule
// for the skills and work history that the pages render.

test("every skill a project uses sits in exactly one group", () => {
  // Fails when a project lists a technology nobody mapped to a group, which
  // would otherwise drop it from the Skills page without a sound.
  const used = new Set(Experiences.flatMap((e) => e.techStack));
  for (const s of used) {
    const homes = skillGroups.filter((g) => g.skills.includes(s));
    expect(homes.length, `${s} is in ${homes.length} groups`).toBe(1);
  }
});

test("every skill Kalana states sits in exactly one group", () => {
  // A stated skill with no group would vanish from the site without a sound.
  for (const s of declaredSkills) {
    const homes = skillGroups.filter((g) => g.skills.includes(s));
    expect(homes.length, `${s} is in ${homes.length} groups`).toBe(1);
  }
});

test("skill counts equal the projects that list them", () => {
  for (const g of skillUsage()) {
    for (const s of g.skills) {
      const expected = Experiences.filter((e) => e.techStack.includes(s.name));
      expect(s.projects.length, s.name).toBe(expected.length);
      expect(s.projects.length, s.name).toBeGreaterThan(0);
    }
  }
});

test("roles have valid dates and never end before they start", () => {
  expect(roles.length).toBeGreaterThan(0);
  for (const r of roles) {
    expect(r.start, r.company).toMatch(/^\d{4}(-\d{2})?$/);
    if (r.end) {
      expect(r.end, r.company).toMatch(/^\d{4}(-\d{2})?$/);
      // "2025" sorts before "2025-07" as a string, so compare years only
      // when one side is year-precision.
      expect(r.end.slice(0, 4) >= r.start.slice(0, 4), r.company).toBe(true);
    }
  }
});

test("years of experience is a stated literal, never computed", () => {
  const src = readFileSync(
    path.join(__dirname, "..", "config", "profile.ts"),
    "utf-8"
  );
  expect(src).toMatch(/yearsOfExperience:\s*\d+,/);
  expect(src).not.toMatch(/new Date\(/);
});

test("every stack name in the hero code window is used by a listed project", async () => {
  const { profile } = await import("../config/profile");
  const used = new Set(Experiences.flatMap((e) => e.techStack));
  expect(profile.signatureStack.length).toBeGreaterThan(0);
  for (const s of profile.signatureStack) expect(used.has(s), s).toBe(true);
});

test("every service's proof is a real project", () => {
  // A renamed or removed project would otherwise drop out of its service
  // without a sound, leaving a claim with less behind it than it shows.
  const ids = new Set(Experiences.map((e) => e.id));
  for (const s of services) for (const id of s.proof ?? []) expect(ids.has(id), `${s.title}: ${id}`).toBe(true);
});

test("each logo sits on its own company's projects", () => {
  // A Langford crest once landed on the Uniguru Operations Platform: an
  // edit meant for the LMS matched the first Uniguru entry instead.
  const langford = Experiences.filter((e) => e.companyLogoImg === "/experience/college-lms/logo.png").map((e) => e.id);
  expect(langford).toEqual(["college-lms"]);
  for (const e of Experiences.filter((x) => x.companyName.startsWith("Uniguru"))) {
    expect(e.companyLogoImg, e.id).toBe("/experience/uniguru/logo.PNG");
    expect(e.brand, e.id).toBeUndefined();
  }
});

test("the contact spam checks catch bots and let people through", () => {
  const now = 1_000_000;
  const person = { name: "Ann Perera", email: "ann@example.com", mobile: "0771234567", message: "I would like a website for my shop.", startedAt: now - 60_000 };
  expect(isSpam(person, now)).toBe(false);
  expect(isSpam({ ...person, website: "http://spam.example" }, now)).toBe(true);
  expect(isSpam({ ...person, startedAt: now - 1000 }, now)).toBe(true);
  expect(isSpam({ ...person, message: "buy http://a.x http://b.x www.c.x https://d.x now" }, now)).toBe(true);
});

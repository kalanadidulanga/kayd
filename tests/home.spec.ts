import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences } from "../config/experience";

test.describe("computed stats", () => {
  test("the numbers are derived from the experience config", () => {
    expect(siteStats.projectsShipped).toBe(Experiences.length);

    const professionalCompanies = new Set(
      Experiences.filter((e) => e.type === "Professional").map((e) => e.companyName)
    );
    expect(siteStats.clients).toBe(professionalCompanies.size);

    const tech = new Set(Experiences.flatMap((e) => e.techStack));
    expect(siteStats.technologies).toBe(tech.size);
  });
});

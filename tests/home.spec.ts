import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences, featuredCaseStudies } from "../config/experience";
import { now } from "../config/now";
import { testimonials } from "../config/testimonials";

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

  test("the rendered numbers match the computed ones", async ({ page }) => {
    await page.goto("/");
    const strip = page.getByTestId("stats-strip");
    await expect(strip).toContainText(String(siteStats.projectsShipped));
    await expect(strip).toContainText(String(siteStats.clients));
    await expect(strip).toContainText(String(siteStats.technologies));
  });
});

test.describe("now section", () => {
  test("renders only when there is something real to say", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#now");

    if (now.text.trim() === "") {
      // Nothing invented: an empty config renders no section, not a placeholder.
      await expect(section).toHaveCount(0);
    } else {
      await expect(section).toBeVisible();
      await expect(section).toContainText(now.text);
    }
  });

  test("config/now.ts never sets updatedAt with a bare new Date()", () => {
    // A source check, not a value check: comparing the parsed updatedAt to
    // today's date would stay silent while text is empty, and would false
    // positive on a real update legitimately made today. Reading the file
    // and forbidding an argument-less new Date() catches the mistake
    // regardless of what text or the current date happen to be, since that
    // call evaluates at build time and would fabricate a freshness date.
    const source = readFileSync(
      path.join(__dirname, "..", "config", "now.ts"),
      "utf-8"
    );
    expect(source).not.toMatch(/updatedAt:\s*new Date\(\s*\)/);
  });
});

test.describe("testimonials", () => {
  test("renders only real attributed quotes", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#testimonials");

    if (testimonials.length === 0) {
      await expect(section).toHaveCount(0);
    } else {
      await expect(section).toBeVisible();
      for (const t of testimonials) {
        await expect(section).toContainText(t.name);
      }
    }
  });

  test("every quote carries a real attribution", () => {
    // A quote with no name or company is indistinguishable from an invented one.
    for (const t of testimonials) {
      expect(t.quote.trim()).not.toBe("");
      expect(t.name.trim()).not.toBe("");
      expect(t.company.trim()).not.toBe("");
    }
  });
});

test.describe("experience data", () => {
  test("no entry ends before it starts", () => {
    for (const e of Experiences) {
      if (e.startDate && e.endDate) {
        expect(
          e.endDate.getTime(),
          `${e.id}: endDate is before startDate`
        ).toBeGreaterThanOrEqual(e.startDate.getTime());
      }
    }
  });

  test("every featured entry has a case study", () => {
    for (const e of Experiences.filter((x) => x.featured)) {
      expect(e.caseStudy, `${e.id} is featured but has no caseStudy`).toBeDefined();
      expect(e.caseStudy?.problem.trim()).not.toBe("");
      expect(e.caseStudy?.approach.trim()).not.toBe("");
    }
  });
});

test.describe("selected work", () => {
  test("renders one entry per featured case study", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#selected-work");

    if (featuredCaseStudies.length === 0) {
      await expect(section).toHaveCount(0);
    } else {
      await expect(section).toBeVisible();
      await expect(section.locator("article")).toHaveCount(featuredCaseStudies.length);
      for (const e of featuredCaseStudies) {
        await expect(section).toContainText(e.companyName);
      }
    }
  });
});

test("client logos come from real professional entries", async ({ page }) => {
  await page.goto("/");
  const strip = page.getByTestId("client-logos");
  const expected = new Set(
    Experiences.filter((e) => e.type === "Professional").map((e) => e.companyName)
  );
  await expect(strip.locator("img")).toHaveCount(expected.size);
});

test.describe("home page structure", () => {
  test("section ids are unique", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    expect(new Set(ids).size, `duplicate section id in ${ids.join(", ")}`).toBe(
      ids.length
    );
  });

  test("sections appear in the intended order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    const expectedOrder = [
      "now",
      "selected-work",
      "experience",
      "about",
      "skills",
      "testimonials",
      "educations",
      "contributions",
    ];
    const present = expectedOrder.filter((id) => ids.includes(id));
    expect(ids.filter((id) => present.includes(id))).toEqual(present);
  });
});

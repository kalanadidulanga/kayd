import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences } from "../config/experience";
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

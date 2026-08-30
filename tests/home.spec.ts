import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences } from "../config/experience";
import { now } from "../config/now";

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

  test("the updated date is a fixed literal, not build time", () => {
    // A new Date() here would restamp on every deploy and fabricate freshness.
    const today = new Date();
    const sameDay =
      now.updatedAt.getFullYear() === today.getFullYear() &&
      now.updatedAt.getMonth() === today.getMonth() &&
      now.updatedAt.getDate() === today.getDate();
    expect(sameDay && now.text.trim() !== "").toBe(false);
  });
});

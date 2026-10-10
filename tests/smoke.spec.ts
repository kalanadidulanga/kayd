import { test, expect } from "@playwright/test";
import { roles } from "../config/work-history";
import { skillId, skillLabel, skillUsage } from "../lib/skills";

const pages = [
  { path: "/work", heading: "Work" },
  { path: "/experience", heading: "Experience" },
  { path: "/skills", heading: "Skills" },
  { path: "/contact", heading: "Contact" },
];

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/KayD/);
  await expect(page.locator("body")).not.toBeEmpty();
});

for (const { path, heading } of pages) {
  test(`${path} renders its heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  });
}

test("/resume renders", async ({ page }) => {
  const response = await page.goto("/resume");
  expect(response?.status()).toBe(200);
});

test.describe("work detail", () => {
  // Regression: Next 15 made route params a promise. Reading params.id
  // directly yielded undefined, so every detail page redirected to the index.
  test("a real id renders the detail page, not the index", async ({ page }) => {
    await page.goto("/work/uniguru");
    await expect(page).toHaveURL(/\/work\/uniguru$/);
    await expect(page.getByRole("heading", { name: "Uniguru", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /all work/i }).first()).toBeVisible();
  });

  test("an unknown id redirects back to the index", async ({ page }) => {
    await page.goto("/work/no-such-project");
    await expect(page).toHaveURL(/\/work$/);
  });
});

test("navigating from the index reaches a detail page", async ({ page }) => {
  await page.goto("/work");
  await page.locator('a[href^="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/.+/);
});

test.describe("old links still land somewhere real", () => {
  test("a project link from the old /experience/<id> moves to /work/<id>", async ({ page }) => {
    await page.goto("/experience/uniguru");
    await expect(page).toHaveURL(/\/work\/uniguru$/);
  });

  test("/educations and /contributions now live on the experience page", async ({ page }) => {
    for (const path of ["/educations", "/contributions"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/experience/);
      await expect(page.getByRole("heading", { name: "Experience", level: 1 })).toBeVisible();
    }
  });
});

test("contact form validates before submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /^submit$/i }).click();
  // zod + react-hook-form should block the submit and surface a message
  await expect(page.locator("form")).toContainText(/required|must|invalid/i);
});


test("the experience page lists every role", async ({ page }) => {
  await page.goto("/experience");
  const section = page.locator("#roles");
  for (const r of roles) {
    await expect(section).toContainText(r.company);
    if (r.title) await expect(section).toContainText(r.title);
  }
});

test("each skill shows the number of projects that use it", async ({ page }) => {
  // The count is the proof. If it ever drifts from the config, a skill is
  // claiming work that is not listed.
  await page.goto("/skills");
  for (const group of skillUsage()) {
    for (const s of group.skills) {
      await expect(page.locator(`#${skillId(s.name)} [data-count]`)).toHaveText(
        String(s.projects.length)
      );
    }
  }
  // A stated skill is shown, in its group, and never with a count.
  for (const group of skillUsage()) {
    for (const s of group.stated) {
      const row = page.locator(`#${skillId(s)}[data-stated]`);
      await expect(row).toContainText(skillLabel(s));
      await expect(row.locator("[data-count]")).toHaveCount(0);
    }
  }
});

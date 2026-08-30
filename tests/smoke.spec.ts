import { test, expect } from "@playwright/test";

const pages = [
  { path: "/skills", heading: "Skills" },
  { path: "/experience", heading: "Experience" },
  { path: "/contributions", heading: "Contributions" },
  { path: "/educations", heading: "Educations" },
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

test.describe("experience detail", () => {
  // Regression: Next 15 made route params a promise. Reading params.expId
  // directly yielded undefined, so every detail page redirected to the index.
  test("a real id renders the detail page, not the index", async ({ page }) => {
    await page.goto("/experience/uniguru");
    await expect(page).toHaveURL(/\/experience\/uniguru$/);
    await expect(page.getByRole("link", { name: /all experience/i }).first()).toBeVisible();
  });

  test("an unknown id redirects back to the index", async ({ page }) => {
    await page.goto("/experience/no-such-experience");
    await expect(page).toHaveURL(/\/experience$/);
  });
});

test("navigating from the index reaches a detail page", async ({ page }) => {
  await page.goto("/experience");
  const firstCard = page.locator('a[href^="/experience/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/experience\/.+/);
});

test("contact form validates before submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /^submit$/i }).click();
  // zod + react-hook-form should block the submit and surface a message
  await expect(page.locator("form")).toContainText(/required|must|invalid/i);
});

test("theme can be switched to dark", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /toggle theme/i }).click();
  await page.getByRole("menuitem", { name: /^dark$/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

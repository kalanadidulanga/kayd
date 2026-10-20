import { test, expect } from "@playwright/test";

const brand = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--brand").trim());

test("the garden opens dark, whatever the system prefers, and the toggle flips it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: /switch to light theme/i }).click();
  await expect(html).not.toHaveClass(/dark/);
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(html).toHaveClass(/dark/);
});

test("emerald is the one brand colour, in both themes", async ({ page }) => {
  // Green is the identity, not a setting: no accent picker, no data-accent,
  // and the brand token is the Living Emerald value in each theme.
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-accent", /.*/);
  await expect(page.getByRole("radiogroup", { name: /accent/i })).toHaveCount(0);
  expect(await brand(page)).toBe("#67e39b");
  await page.getByRole("button", { name: /switch to light theme/i }).click();
  expect(await brand(page)).toBe("#087a46");
});

test("an old stored accent changes nothing", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kayd-accent", "ember"));
  await page.goto("/");
  expect(await brand(page)).toBe("#67e39b");
});

test("the theme still switches where View Transitions are missing", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulate an older browser
    delete Document.prototype.startViewTransition;
  });
  await page.goto("/");
  await page.getByRole("button", { name: /switch to light theme/i }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

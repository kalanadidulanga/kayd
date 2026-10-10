import { test, expect } from "@playwright/test";

test("the theme toggle flips light and dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: /switch to light theme/i }).click();
  await expect(html).not.toHaveClass(/dark/);
});

test("the accent defaults to emerald, and a chosen one survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-accent", "emerald");
  // Not the default, so the reload proves the choice was stored.
  await page.getByRole("radio", { name: "Ember" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "ember");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "ember");
  await expect(page.getByRole("radio", { name: "Ember" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
});

test("a corrupt stored accent falls back to emerald, the default", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kayd-accent", "<script>"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-accent", "emerald");
});

test("the theme still switches where View Transitions are missing", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulate an older browser
    delete Document.prototype.startViewTransition;
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

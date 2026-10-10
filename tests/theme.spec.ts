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

test("the chosen accent survives a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Emerald" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "emerald");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "emerald");
  await expect(page.getByRole("radio", { name: "Emerald" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
});

test("a corrupt stored accent falls back to indigo", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kayd-accent", "<script>"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-accent", "indigo");
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

import { test, expect } from "@playwright/test";

// Regressions found in the final review of the redesign. Each pins what a
// visitor would actually see, not how the code produces it.

test.use({ viewport: { width: 1440, height: 900 } });

test("a full-page screenshot is framed, not shown at full length", async ({ page }) => {
  // Best Birder's screenshot is 1920x9612. Unframed, it pushed the content
  // five thousand pixels down the page.
  await page.goto("/work/bestbirdersl");
  const cover = page.getByRole("img", { name: "Best Birder SL screenshot" });
  await expect(cover).toBeVisible();
  const box = await cover.boundingBox();
  expect(box!.height).toBeLessThan(900);
});

test("hover previews add no scroll space below the footer", async ({ page }) => {
  await page.goto("/work");
  // Bring every lazy preview in, then measure.
  for (let y = 0; y < 8000; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(50);
  }
  await page.waitForLoadState("networkidle");
  const gap = await page.evaluate(() => {
    const footer = document.querySelector("footer")!;
    const bottom = footer.getBoundingClientRect().bottom + window.scrollY;
    return document.documentElement.scrollHeight - bottom;
  });
  expect(gap).toBeLessThanOrEqual(1);
});

test("the home skills lead does not claim the counts cover only the work shown above", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#skills")).not.toContainText("projects above");
});

test.describe("dark mode", () => {
  test.use({ colorScheme: "dark" });

  test("an outline button stays readable on hover", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("#hero").getByRole("link", { name: "Get in touch" });
    await button.hover();
    await page.waitForTimeout(300);
    const ratio = await button.evaluate((el) => {
      const parse = (c: string) => c.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const cs = getComputedStyle(el);
      const a = lum(parse(cs.color));
      const b = lum(parse(cs.backgroundColor));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test("every aria-labelledby on the skills page names a real element", async ({ page }) => {
  await page.goto("/skills");
  const broken = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[aria-labelledby]")).flatMap((el) =>
      el
        .getAttribute("aria-labelledby")!
        .split(/\s+/)
        .filter((id) => !document.getElementById(id))
    )
  );
  expect(broken).toEqual([]);
});

test("email links open the mail app, not a blank tab", async ({ page }) => {
  for (const path of ["/contact", "/"]) {
    await page.goto(path);
    const targets = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("target")));
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.every((t) => t === null), `${path}: ${targets}`).toBe(true);
  }
});

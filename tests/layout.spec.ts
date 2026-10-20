import { test, expect, type Page } from "@playwright/test";

// Regressions from earlier reviews, kept for what a visitor would see.

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

// Contrast of text against whatever paints behind it.
async function contrastOf(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number);
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    let bg = [255, 255, 255];
    for (let n: Element | null = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.length < 4 || c[3] > 0.95) {
        bg = c.slice(0, 3);
        break;
      }
    }
    const fg = parse(getComputedStyle(el).color).slice(0, 3);
    const [a, b] = [lum(fg), lum(bg)];
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`${scheme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), scheme);
    });

    test("small text and links pass AA", async ({ page }) => {
      await page.goto("/about");
      expect(await contrastOf(page, "#roles .meta")).toBeGreaterThanOrEqual(4.5);
      expect(await contrastOf(page, "#education .meta")).toBeGreaterThanOrEqual(4.5);
      expect(await contrastOf(page, "#skills a.text-brand")).toBeGreaterThanOrEqual(4.5);
    });

    test("the primary action stays readable", async ({ page }) => {
      await page.goto("/");
      const button = page.locator("#hero").getByRole("link", { name: "Explore work" });
      await button.hover();
      expect(await contrastOf(page, "#hero a[href='/work']")).toBeGreaterThanOrEqual(4.5);
    });
  });
}

test("form text stays readable over the contact artwork", async ({ page }) => {
  await page.goto("/contact");
  expect(await contrastOf(page, "form label")).toBeGreaterThanOrEqual(4.5);
});

test("every aria-labelledby names a real element", async ({ page }) => {
  for (const path of ["/about", "/work/hotel-management-system", "/work"]) {
    await page.goto(path);
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[aria-labelledby]")).flatMap((el) =>
        el
          .getAttribute("aria-labelledby")!
          .split(/\s+/)
          .filter((id) => !document.getElementById(id))
      )
    );
    expect(broken, path).toEqual([]);
  }
});

test("email links open the mail app, not a blank tab", async ({ page }) => {
  for (const path of ["/contact", "/"]) {
    await page.goto(path);
    const targets = await page.locator('a[href^="mailto:"]').evaluateAll((links) => links.map((a) => a.getAttribute("target")));
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.every((t) => t === null), `${path}: ${targets}`).toBe(true);
  }
});

for (const width of [768, 1280]) {
  test(`the contact email fits on one line at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    const box = await page.locator("main a[href^='mailto:']").boundingBox();
    expect(box!.height).toBeLessThan(36);
  });
}

test("Instagram is linked on the contact page and in the footer", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("a[href='https://www.instagram.com/i_m_kayd']")).toHaveCount(2);
});

test("the scroll rail stands in for the scrollbar and steps through the page", async ({ page }) => {
  await page.goto("/");
  // The browser's own bar is hidden; the rail is there instead.
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)).toBe("none");
  const up = page.getByRole("button", { name: "Scroll up" });
  const down = page.getByRole("button", { name: "Scroll down" });
  await expect(up).toBeDisabled();
  await down.click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeGreaterThan(200);
  await expect(up).toBeEnabled();
  await up.click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeLessThan(5);
  await expect(page.locator("#content")).toBeFocused();
});

for (const width of [390, 768, 1920]) {
  test(`no page scrolls sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/work", "/work/operations-crm-platform", "/about", "/lab", "/notes", "/contact", "/resume"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
}

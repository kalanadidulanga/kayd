import { test, expect, type Page } from "@playwright/test";

// Regressions from the final review of the cinematic redesign.

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  test("the floating nav is visible, not just focusable", async ({ page }) => {
    await page.goto("/");
    const opacity = await page
      .locator("header > div")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });
});

test("the home page makes no claim the config cannot back", async ({ page }) => {
  await page.goto("/");
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const claim of ["every single day", "projects shipped", "projects below"]) {
    expect(text, claim).not.toContain(claim);
  }
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("a project cover is fully shown, not stuck mid-zoom", async ({ page }) => {
    await page.goto("/work/bestbirdersl");
    const wrapper = page.locator("[data-reveal]:has(img[alt='Best Birder SL screenshot'])");
    await expect(wrapper).toHaveCount(1);
    await page.waitForTimeout(500);
    const style = await wrapper.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, transform: cs.transform };
    });
    expect(style.opacity).toBe("1");
    // No zoom left over: either no transform at all or the identity matrix.
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style.transform);
  });
});

async function deckBoxes(page: Page) {
  return page.locator("#selected-work").evaluate((section) => {
    const s = section.getBoundingClientRect();
    const cards = [...section.querySelectorAll("article")].map((a) => {
      const r = a.getBoundingClientRect();
      return { top: r.top + scrollY, bottom: r.bottom + scrollY, position: getComputedStyle(a).position };
    });
    return { sectionBottom: s.bottom + scrollY, cards };
  });
}

test.describe("deck on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("cards stack with even gaps and stay inside their section", async ({ page }) => {
    await page.goto("/");
    const { sectionBottom, cards } = await deckBoxes(page);
    const gaps = cards.slice(1).map((c, i) => Math.round(c.top - cards[i].bottom));
    expect(Math.max(...gaps) - Math.min(...gaps), `gaps ${gaps}`).toBeLessThanOrEqual(2);
    expect(cards[cards.length - 1].bottom).toBeLessThanOrEqual(sectionBottom);
  });
});

test.describe("deck on a short screen", () => {
  test.use({ viewport: { width: 1024, height: 600 } });

  test("cards do not stick when a card is taller than the screen", async ({ page }) => {
    await page.goto("/");
    const { cards } = await deckBoxes(page);
    expect(cards.every((c) => c.position !== "sticky"), JSON.stringify(cards)).toBe(true);
  });
});

test.describe("hero code window", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps its height while it types, so nothing below jumps", async ({ page }) => {
    await page.goto("/");
    const pre = page.locator("#hero pre");
    const heights: number[] = [];
    for (let i = 0; i < 40; i++) {
      heights.push(Math.round((await pre.boundingBox())!.height));
      await page.waitForTimeout(100);
    }
    expect(Math.max(...heights) - Math.min(...heights), `heights ${heights}`).toBeLessThanOrEqual(2);
  });
});

// Contrast of small text against whatever paints behind it.
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

for (const accent of ["indigo", "emerald", "ember"]) {
  test(`small text passes AA in light mode with the ${accent} accent`, async ({ page }) => {
    await page.addInitScript((a) => localStorage.setItem("kayd-accent", a), accent);
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/experience");
    // An accent-coloured git-log date on the band, and a grey side label.
    expect(await contrastOf(page, "#roles ol li p.font-mono")).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(page, "#education li > span")).toBeGreaterThanOrEqual(4.5);
  });
}

test("the nav is frosted glass, not just a tint", async ({ page }) => {
  // The build once merged backdrop-filter into its -webkit- twin only, which
  // Chrome ignores: the nav was see-through and text showed through it.
  await page.goto("/");
  const blur = await page
    .locator("header > div")
    .first()
    .evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(blur).toContain("blur");
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

import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences, featuredCaseStudies } from "../config/experience";
import { now } from "../config/now";
import { testimonials } from "../config/testimonials";

test.describe("computed stats", () => {
  // Literal expected numbers on purpose. Recomputing the same expression the
  // implementation uses only proves the code agrees with itself: that is how a
  // client counted twice shipped. These were counted by hand from the config
  // and must be updated by hand when the config changes.
  test("the numbers match the experience config, counted by hand", () => {
    expect(siteStats.projects).toBe(27);
    // Sixteen professional entries, eight clients: five entries are one
    // client (keyed "Uniguru"), two are Lapel and four are C-Lento.
    expect(siteStats.clients).toBe(8);
    expect(siteStats.technologies).toBe(35);
  });

  test("the rendered numbers match the computed ones", async ({ page }) => {
    await page.goto("/");
    const strip = page.getByTestId("stats-strip");
    await expect(strip).toContainText(String(siteStats.projects));
    await expect(strip).toContainText(String(siteStats.clients));
    await expect(strip).toContainText(String(siteStats.technologies));
  });
});

test.describe("now line", () => {
  test("renders only when there is something real to say", async ({ page }) => {
    await page.goto("/");
    const line = page.locator("#now");
    if (now.text.trim() === "") await expect(line).toHaveCount(0);
    else await expect(line).toContainText(now.text);
  });

  test("config/now.ts never sets updatedAt with a bare new Date()", () => {
    // That call evaluates at build time and would fabricate a freshness date.
    const source = readFileSync(path.join(__dirname, "..", "config", "now.ts"), "utf-8");
    expect(source).not.toMatch(/updatedAt:\s*new Date\(\s*\)/);
  });
});

test.describe("testimonials", () => {
  test("render only real attributed quotes", async ({ page }) => {
    await page.goto("/about");
    const section = page.locator("#testimonials");
    if (testimonials.length === 0) await expect(section).toHaveCount(0);
    else for (const t of testimonials) await expect(section).toContainText(t.name);
  });

  test("every quote carries a real attribution", () => {
    for (const t of testimonials) {
      expect(t.quote.trim()).not.toBe("");
      expect(t.name.trim()).not.toBe("");
      expect(t.company.trim()).not.toBe("");
    }
  });
});

test.describe("experience data", () => {
  test("no entry ends before it starts", () => {
    for (const e of Experiences) {
      if (e.startDate && e.endDate) {
        expect(e.endDate.getTime(), `${e.id}: endDate is before startDate`).toBeGreaterThanOrEqual(e.startDate.getTime());
      }
    }
  });

  test("every featured entry has a case study", () => {
    for (const e of Experiences.filter((x) => x.featured)) {
      expect(e.caseStudy, `${e.id} is featured but has no caseStudy`).toBeDefined();
      expect(e.caseStudy?.problem.trim()).not.toBe("");
      expect(e.caseStudy?.approach.trim()).not.toBe("");
    }
  });
});

test("selected systems shows each featured case study once, the operations platform first", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#selected-work");
  await expect(section.locator("article")).toHaveCount(featuredCaseStudies.length);
  for (const e of featuredCaseStudies) await expect(section).toContainText(e.companyName);
  await expect(section.locator("article h3").first()).toHaveText("Uniguru Operations Platform");
});

test("each principle quotes a decision from its project", async ({ page }) => {
  // The quote on the home page is read from the config, so it must match a
  // decision on the project it links to.
  await page.goto("/");
  const items = page.locator("#how-i-think li[data-step-at]");
  await expect(items).toHaveCount(4);
  for (const item of await items.all()) {
    const quote = (await item.locator("blockquote").textContent())!.trim();
    const href = await item.locator("a").getAttribute("href");
    const project = Experiences.find((e) => `/work/${e.id}` === href)!;
    expect(project.decisions, href!).toContain(quote);
  }
});

test("the logo strip shows each client and company once", async ({ page }) => {
  await page.goto("/about");
  const strip = page.getByTestId("client-logos");
  // Literal for the same reason as the stats oracle.
  await expect(strip.locator("img")).toHaveCount(8);
  for (const name of ["Langford College", "C-Lento", "Techseya (Pvt) Ltd", "Uniguru"]) {
    await expect(strip.getByRole("img", { name, exact: true })).toHaveCount(1);
  }
});

test.describe("home page structure", () => {
  const SCENES = ["hero", "selected-work", "how-i-think", "range", "lab-signal", "personal", "contact"];

  test("seven connected scenes at most, in the intended order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main [data-scene]").evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(ids.length).toBeLessThanOrEqual(7);
    expect(ids).toEqual(SCENES);
  });

  test("scenes are open fields, not painted rectangles", async ({ page }) => {
    // No scene paints its own background or a border on both edges: the
    // change from one scene to the next is light and shading only.
    await page.goto("/");
    const boxes = await page.locator("main [data-scene]").evaluateAll((nodes) =>
      nodes.map((n) => {
        const cs = getComputedStyle(n);
        return {
          id: n.id,
          bg: cs.backgroundColor,
          edges: parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderBottomWidth) > 0,
          fades: getComputedStyle(n.querySelector(".scene-atmos")!).maskImage.includes("gradient"),
        };
      })
    );
    for (const b of boxes) {
      expect(b.bg, b.id).toBe("rgba(0, 0, 0, 0)");
      expect(b.edges, b.id).toBe(false);
      expect(b.fades, b.id).toBe(true);
    }
  });
});

test.describe("home page with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the scene bodies instead of blank space", async ({ page }) => {
    await page.goto("/");
    const wrappers = page.locator("[data-reveal], [data-rise]");
    expect(await wrappers.count()).toBeGreaterThan(0);
    const opacities = await wrappers.evaluateAll((ns) => ns.map((n) => getComputedStyle(n).opacity));
    expect(opacities.every((o) => o === "1"), `reveal opacities: ${opacities}`).toBe(true);
    await expect(page.getByTestId("stats-strip")).toContainText(String(siteStats.projects));
    // The Atlas domains are still links to the work.
    await expect(page.locator("#hero a[href^='/work?']").first()).toBeAttached();
  });
});

test("the full name is on the page and in the title", async ({ page }) => {
  // Literal on purpose: the owner gave his full name on 2026-10-11.
  await page.goto("/");
  await expect(page.locator("#hero")).toContainText("Kalana Didulanga Koralegedara");
  await expect(page.locator("footer")).toContainText("Kalana Didulanga Koralegedara");
  await expect(page).toHaveTitle(/Kalana Didulanga Koralegedara/);
});

test("the home page makes no claim the config cannot back", async ({ page }) => {
  await page.goto("/");
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const claim of ["every single day", "projects shipped", "reply to every", "available for", "i read every"]) {
    expect(text, claim).not.toContain(claim);
  }
});

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
  // and must be updated by hand when the config changes. The
  // no-hand-written-numbers rule binds the site, not this oracle.
  test("the numbers match the experience config, counted by hand", () => {
    expect(siteStats.projects).toBe(25);
    // Fourteen professional entries, eight clients: five entries are one
    // client (keyed "Uniguru"), two are Lapel and two are C-Lento.
    expect(siteStats.clients).toBe(8);
    expect(siteStats.technologies).toBe(34);
  });

  test("the rendered numbers match the computed ones", async ({ page }) => {
    await page.goto("/");
    const strip = page.getByTestId("stats-strip");
    await expect(strip).toContainText(String(siteStats.projects));
    await expect(strip).toContainText(String(siteStats.clients));
    await expect(strip).toContainText(String(siteStats.technologies));
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

  test("config/now.ts never sets updatedAt with a bare new Date()", () => {
    // A source check, not a value check: comparing the parsed updatedAt to
    // today's date would stay silent while text is empty, and would false
    // positive on a real update legitimately made today. Reading the file
    // and forbidding an argument-less new Date() catches the mistake
    // regardless of what text or the current date happen to be, since that
    // call evaluates at build time and would fabricate a freshness date.
    const source = readFileSync(
      path.join(__dirname, "..", "config", "now.ts"),
      "utf-8"
    );
    expect(source).not.toMatch(/updatedAt:\s*new Date\(\s*\)/);
  });
});

test.describe("testimonials", () => {
  test("renders only real attributed quotes", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#testimonials");

    if (testimonials.length === 0) {
      await expect(section).toHaveCount(0);
    } else {
      await expect(section).toBeVisible();
      for (const t of testimonials) {
        await expect(section).toContainText(t.name);
      }
    }
  });

  test("every quote carries a real attribution", () => {
    // A quote with no name or company is indistinguishable from an invented one.
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
        expect(
          e.endDate.getTime(),
          `${e.id}: endDate is before startDate`
        ).toBeGreaterThanOrEqual(e.startDate.getTime());
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

test.describe("selected work", () => {
  test("renders one entry per featured case study", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#selected-work");

    if (featuredCaseStudies.length === 0) {
      await expect(section).toHaveCount(0);
    } else {
      await expect(section).toBeVisible();
      await expect(section.locator("article")).toHaveCount(featuredCaseStudies.length);
      for (const e of featuredCaseStudies) {
        await expect(section).toContainText(e.companyName);
      }
    }
  });
});

test("the logo strip shows each client and company once", async ({ page }) => {
  await page.goto("/");
  const strip = page.getByTestId("client-logos");
  // Literal for the same reason as the stats oracle: mirroring the component's
  // own filter here would have agreed with the duplicate Lapel logo.
  await expect(strip.locator("img")).toHaveCount(8);
  for (const name of ["Langford College", "C-Lento", "Techseya (Pvt) Ltd", "Uniguru"]) {
    await expect(strip.getByRole("img", { name, exact: true })).toHaveCount(1);
  }
});

test.describe("home page structure", () => {
  test("section ids are unique", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    expect(new Set(ids).size, `duplicate section id in ${ids.join(", ")}`).toBe(
      ids.length
    );
  });

  test("the unconditional sections are all present", async ({ page }) => {
    // These have no config gate (unlike selected-work, clients and
    // testimonials, which render null on empty config), so they must always
    // be in the DOM. Without this, the order test below only checks relative
    // order among whatever happens to exist, and a deleted section would pass
    // silently.
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    expect(ids).toEqual(
      expect.arrayContaining(["hero", "what-i-do", "work", "experience", "skills", "contact"])
    );
  });

  test("sections appear in the intended order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    const expectedOrder = [
      "hero",
      "selected-work",
      "what-i-do",
      "clients",
      "work",
      "testimonials",
      "experience",
      "skills",
      "contact",
    ];
    const present = expectedOrder.filter((id) => ids.includes(id));
    expect(ids.filter((id) => present.includes(id))).toEqual(present);
  });
});

test.describe("home page with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the section bodies instead of blank space", async ({ page }) => {
    // Reveal renders its wrapper at opacity 0 and only clears it on hydration,
    // so with no JavaScript the noscript rule in the root layout has to force
    // these visible. Existence proves nothing here, the text was always in the
    // HTML: the regression this guards against was 1738px of invisible page.
    await page.goto("/");
    const wrappers = page.locator("[data-reveal]");
    expect(await wrappers.count()).toBeGreaterThan(0);
    const opacities = await wrappers.evaluateAll((ns) =>
      ns.map((n) => getComputedStyle(n).opacity)
    );
    expect(opacities.every((o) => o === "1"), `reveal opacities: ${opacities}`).toBe(
      true
    );
    // Counters animate up from zero, but the HTML must carry the real figure.
    await expect(page.getByTestId("stats-strip")).toContainText(String(siteStats.projects));
  });
});

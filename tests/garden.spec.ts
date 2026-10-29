import { test, expect } from "@playwright/test";
import { Experiences } from "../config/experience";
import { lab } from "../config/lab";
import { notes } from "../config/notes";

// The Living Systems Garden: behaviour a visitor relies on.

test.describe("morphing navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("folds into a glass rail, recedes on the way down, returns on the way up, never leaves", async ({ page }) => {
    await page.goto("/about");
    const nav = page.locator("[data-nav]");
    await expect(nav).toHaveAttribute("data-nav", "top");

    await page.mouse.wheel(0, 900);
    await expect(nav).toHaveAttribute("data-nav", "receded");
    // Receded is still frosted: no opacity below 1 to let the sharp page through.
    await expect(nav).toHaveCSS("opacity", "1");
    await expect.poll(() => nav.evaluate((el) => getComputedStyle(el).backdropFilter)).toContain("blur");
    // Let the smooth scroll settle before turning back.
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(900);
    await page.mouse.wheel(0, -300);
    await expect(nav).toHaveAttribute("data-nav", "compact");
    await expect.poll(() => nav.evaluate((el) => getComputedStyle(el).backdropFilter)).toContain("blur");

    const box = await nav.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.height).toBeGreaterThan(30);
  });

  test("the logo takes you back to the top of the home page", async ({ page }) => {
    await page.goto("/");
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
    await page.getByRole("link", { name: "KayD, home" }).click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeLessThan(5);
  });

  test("marks the current page with aria-current", async ({ page }) => {
    await page.goto("/work/kendara");
    await expect(page.getByRole("navigation", { name: "Main" }).first().getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("the same object opens into the menu, and Escape closes it", async ({ page }) => {
      await page.goto("/");
      const button = page.getByRole("button", { name: "Menu" });
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      const menu = page.locator("#mobile-menu");
      await expect(menu.getByRole("link", { name: "Notes" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
    });
  });

  test.describe("with JavaScript off", () => {
    test.use({ javaScriptEnabled: false });

    test("is visible and links every page", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("[data-nav]");
      expect(await nav.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      for (const name of ["Work", "About", "Lab", "Notes", "Contact"]) {
        await expect(page.locator("header").getByRole("link", { name }).first()).toBeAttached();
      }
    });
  });
});

test.describe("work explorer", () => {
  test("searches across technology and filters by platform, keeping the URL", async ({ page }) => {
    await page.goto("/work");
    const index = page.getByTestId("work-index");
    await expect(index.locator("li")).toHaveCount(Experiences.length);

    await page.getByRole("searchbox", { name: "Search projects" }).fill("supabase");
    const supabase = Experiences.filter((e) => e.techStack.includes("Supabase"));
    await expect(index.locator("li")).toHaveCount(supabase.length);
    await expect(index).toContainText("Uniguru Operations Platform");
    await expect(page).toHaveURL(/q=supabase/);

    await page.getByRole("searchbox", { name: "Search projects" }).fill("");
    await page.getByRole("group", { name: "Platform" }).getByRole("button", { name: "Mobile" }).click();
    await expect(page.getByRole("group", { name: "Platform" }).getByRole("button", { name: "Mobile" })).toHaveAttribute("aria-pressed", "true");
    await expect(index.locator("li")).toHaveCount(1);
    await expect(index).toContainText("Uniguru Mobile App");
    await expect(page).toHaveURL(/platform=mobile/);
  });

  test("opens already filtered from a link, and recovers from no results", async ({ page }) => {
    await page.goto("/work?tech=Rust");
    await expect(page.getByTestId("work-index").locator("li")).toHaveCount(1);
    await expect(page.getByTestId("work-index")).toContainText("Project Mouse");

    await page.getByRole("searchbox", { name: "Search projects" }).fill("nothing could match this");
    await expect(page.getByText("No project matches these filters.")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).last().click();
    await expect(page.getByTestId("work-index").locator("li")).toHaveCount(Experiences.length);
    await expect(page).toHaveURL(/\/work$/);
  });

  test("the team filter lists work built with others", async ({ page }) => {
    await page.goto("/work?ownership=team");
    await expect(page.getByTestId("work-index").locator("li")).toHaveCount(Experiences.filter((e) => e.team).length);
  });

  test.describe("with JavaScript off", () => {
    test.use({ javaScriptEnabled: false });

    test("lists every project", async ({ page }) => {
      await page.goto("/work");
      await expect(page.getByTestId("work-index").locator("li")).toHaveCount(Experiences.length);
    });
  });
});

test.describe("project pages go as deep as their material", () => {
  test("a case study has its map, challenge, decisions, part and outcome", async ({ page }) => {
    await page.goto("/work/hotel-management-system");
    await expect(page.locator("article")).toHaveAttribute("data-depth", "case-study");
    for (const id of ["context", "system-map", "challenge", "decisions", "contribution", "outcome", "related"]) {
      await expect(page.locator(`#${id}`), id).toBeVisible();
    }
    // Generated art is labelled as such, next to real evidence.
    await expect(page.getByText("Illustration, not a screenshot of the product.")).toBeVisible();
  });

  test("a story leaves out what it does not have", async ({ page }) => {
    await page.goto("/work/zeropos");
    await expect(page.locator("article")).toHaveAttribute("data-depth", "story");
    await expect(page.locator("#contribution")).toBeVisible();
    for (const id of ["system-map", "challenge", "outcome"]) await expect(page.locator(`#${id}`), id).toHaveCount(0);
  });

  test("a note is short: one detail, no forced narrative", async ({ page }) => {
    await page.goto("/work/2048-game");
    await expect(page.locator("article")).toHaveAttribute("data-depth", "note");
    await expect(page.getByRole("heading", { name: "One detail" })).toBeVisible();
    await expect(page.locator("#focus li")).toHaveCount(1);
    for (const id of ["system-map", "decisions", "screens"]) await expect(page.locator(`#${id}`), id).toHaveCount(0);
  });
});

test.describe("atlas", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("each domain node is reachable by keyboard and shows a real project", async ({ page }) => {
    await page.goto("/");
    const node = page.locator(".atlas-node").first();
    await node.getByRole("link").first().focus();
    const card = node.locator("div").filter({ hasText: "For example" });
    await expect(card).toBeVisible();
    const href = await card.getByRole("link").getAttribute("href");
    expect(Experiences.some((e) => `/work/${e.id}` === href)).toBe(true);
  });

  test("the artwork is served and sized before it loads", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("#hero img").first();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("every node and line is there at once", async ({ page }) => {
      await page.goto("/");
      const opacities = await page.locator(".atlas-node").evaluateAll((ns) => ns.map((n) => getComputedStyle(n).opacity));
      expect(opacities.every((o) => o === "1"), `${opacities}`).toBe(true);
      // The footer name is whole at once, not waiting for the scroll.
      const clip = await page.locator("footer .footer-name-lit").evaluate((el) => getComputedStyle(el).clipPath);
      expect(clip).toBe("none");
      // Scroll-scrubbed words, heatmap days and Range nodes are all at full strength.
      for (const sel of [".scrub-word", ".heat-cell", ".range-line"]) {
        const values = await page.locator(sel).evaluateAll((ns) => ns.map((n) => getComputedStyle(n).opacity));
        expect(values.every((o) => o === "1" || o === "0.28" || o === "0"), `${sel}: ${values.slice(0, 5)}`).toBe(true);
        expect(values.filter((o) => o === "1").length, sel).toBeGreaterThan(0);
      }
      // The root pulses are off, and the hero copy does not lift away.
      // No video loads, in the hero or the descent; the stills stand in.
      await expect(page.locator("main video")).toHaveCount(0);
      expect(await page.locator(".hero-copy").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    });

    test("a project cover is fully shown", async ({ page }) => {
      await page.goto("/work/bestbirdersl");
      const wrapper = page.locator("[data-rise]:has(img[alt='Best Birder SL screenshot'])");
      await expect(wrapper).toHaveCount(1);
      const style = await wrapper.evaluate((el) => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }));
      expect(style.opacity).toBe("1");
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style.transform);
    });
  });
});

test.describe("command palette", () => {
  test("Ctrl+K finds a project and goes there", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: /search pages/i });
    await expect(input).toBeFocused();
    await input.fill("kendara");
    await expect(page.getByRole("option", { name: /Kendara/ }).first()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/kendara$/);
  });

  test("filters work by technology, and Escape closes it", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Search the site" }).click();
    const input = page.getByRole("combobox", { name: /search pages/i });
    await input.fill("supabase tech");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\?tech=Supabase/);
    await expect(page.getByTestId("work-index")).toContainText("Uniguru Operations Platform");
    await page.keyboard.press("Control+k");
    await expect(input).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(input).toBeHidden();
  });
});

test.describe("keyboard", () => {
  test("the skip link is first and lands on the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#content")).toBeFocused();
  });

  test("focus is visible in the brand green", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineColor);
    expect(outline).toBe("rgb(103, 227, 155)");
  });
});

test.describe("contact form", () => {
  test("checks each field once touched, before anything is sent", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Email").fill("not an email");
    await page.getByLabel("Email").blur();
    await expect(page.getByText("Please enter a valid email.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("form")).toContainText(/must|valid|descriptive/i);
  });

  test("keeps everything typed when sending fails, then confirms a real send", async ({ page }) => {
    let fail = true;
    await page.route("**/api/contact", (route) =>
      fail
        ? route.fulfill({ status: 500, contentType: "application/json", body: '{"error":"Mail is not configured"}' })
        : route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' })
    );
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Ann Perera");
    await page.getByLabel("Email").fill("ann@example.com");
    await page.getByText("A project").click();
    await page.getByLabel("Message").fill("I would like a booking system for my guest house.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("form [role=alert]")).toContainText("Everything you typed is still here");
    await expect(page.getByLabel("Name")).toHaveValue("Ann Perera");
    await expect(page.getByLabel("Message")).toHaveValue("I would like a booking system for my guest house.");

    fail = false;
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Message sent." })).toBeVisible();
  });
});

test.describe("lab and notes", () => {
  test("the lab lists every entry, each a real project", async ({ page }) => {
    await page.goto("/lab");
    for (const l of lab) {
      const e = Experiences.find((x) => x.id === l.project)!;
      await expect(page.getByRole("heading", { name: e.companyName, level: 3 })).toBeVisible();
    }
  });

  test("the notes index lists every note, and each one opens with its related work", async ({ page }) => {
    await page.goto("/notes");
    for (const n of notes) await expect(page.getByRole("link", { name: n.title })).toBeVisible();
    const first = notes[0];
    await page.goto(`/notes/${first.slug}`);
    await expect(page.getByRole("heading", { name: first.title, level: 1 })).toBeVisible();
    const project = Experiences.find((e) => e.id === first.related![0])!;
    await expect(page.getByRole("link", { name: project.companyName })).toBeVisible();
  });

  test("an unknown note is a 404", async ({ page }) => {
    const res = await page.goto("/notes/no-such-note");
    expect(res?.status()).toBe(404);
  });
});

import { test, expect } from "@playwright/test";
import { profile } from "../config/profile";
import { roles } from "../config/work-history";
import { skillId, skillLabel, skillUsage } from "../lib/skills";

const pages = [
  { path: "/work", heading: "Work" },
  { path: "/about", heading: profile.name },
  { path: "/lab", heading: "Lab" },
  { path: "/notes", heading: "Notes" },
  { path: "/contact", heading: "Tell me what needs to work better." },
  { path: "/resume", heading: profile.name },
];

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/KayD/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build software for the real world.");
});

for (const { path, heading } of pages) {
  test(`${path} renders its heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  });
}

test.describe("work detail", () => {
  // Regression: Next 15 made route params a promise. Reading params.id
  // directly yielded undefined, so every detail page redirected to the index.
  test("a real id renders the detail page, not the index", async ({ page }) => {
    await page.goto("/work/uniguru");
    await expect(page).toHaveURL(/\/work\/uniguru$/);
    await expect(page.getByRole("heading", { name: "Uniguru", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /all work/i }).first()).toBeVisible();
  });

  test("an unknown id redirects back to the index", async ({ page }) => {
    await page.goto("/work/no-such-project");
    await expect(page).toHaveURL(/\/work$/);
  });
});

test("navigating from the index reaches a detail page", async ({ page }) => {
  await page.goto("/work");
  await page.getByTestId("work-index").locator('a[href^="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/.+/);
});

test("an unknown address shows the disconnected node with routes back", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not connected");
  const nav = page.getByRole("navigation", { name: "Back into the site" });
  for (const name of ["Work", "Lab", "Home"]) await expect(nav.getByRole("link", { name })).toBeVisible();
  // The artwork is served, not a broken image.
  const img = page.locator("main img").first();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test.describe("old links still land somewhere real", () => {
  const moves: [string, string][] = [
    ["/experience", "/about"],
    ["/experience/uniguru", "/work/uniguru"],
    ["/skills", "/about#skills"],
    ["/educations", "/about#education"],
    ["/contributions", "/about#contributions"],
    ["/index.html", "/"],
  ];
  for (const [from, to] of moves) {
    test(`${from} moves permanently to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(res.headers()["location"]).toBe(to);
    });
  }

  test("the moved anchors exist on the About page", async ({ page }) => {
    await page.goto("/about");
    for (const id of ["skills", "education", "contributions", "roles"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });
});

test("the about page lists every role", async ({ page }) => {
  await page.goto("/about");
  const section = page.locator("#roles");
  for (const r of roles) {
    await expect(section).toContainText(r.company);
    if (r.title) await expect(section).toContainText(r.title);
  }
});

test("each skill shows the number of projects that use it", async ({ page }) => {
  // The count is the proof. If it ever drifts from the config, a skill is
  // claiming work that is not listed.
  await page.goto("/about");
  for (const group of skillUsage()) {
    for (const s of group.skills) {
      await expect(page.locator(`#${skillId(s.name)} [data-count]`)).toHaveText(String(s.projects.length));
    }
  }
  // A stated skill is shown, in its group, and never with a count.
  for (const group of skillUsage()) {
    for (const s of group.stated) {
      const row = page.locator(`#${skillId(s)}[data-stated]`);
      await expect(row).toContainText(skillLabel(s));
      await expect(row.locator("[data-count]")).toHaveCount(0);
    }
  }
});

test("the resume carries every role and prints", async ({ page }) => {
  await page.goto("/resume");
  for (const r of roles) await expect(page.locator("main")).toContainText(r.company);
  await expect(page.getByRole("button", { name: "Print or save as PDF" })).toBeVisible();
  // The site's chrome stays off the paper.
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("header").first()).toBeHidden();
  await expect(page.locator("footer").first()).toBeHidden();
});

test.describe("search engines", () => {
  test("pages carry their own canonical URL", async ({ page }) => {
    for (const path of ["/", "/work", "/about", "/lab", "/contact", "/resume", "/work/kendara"]) {
      await page.goto(path);
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(href, path).toBe(`https://www.kalanadidulanga.com${path === "/" ? "" : path}`);
    }
  });

  test("the home page describes the person behind it", async ({ page }) => {
    await page.goto("/");
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(raw!)["@graph"];
    const person = graph.find((n: { "@type": string }) => n["@type"] === "Person");
    expect(person.name).toBe("Kalana Didulanga Koralegedara");
    expect(person.sameAs).toContain("https://github.com/kalanadidulanga/");
    expect(person.image).toBe("https://www.kalanadidulanga.com/Avatar.png");
    expect(graph.some((n: { "@type": string }) => n["@type"] === "WebSite")).toBe(true);
  });

  test("the empty notes index asks not to be indexed", async ({ page }) => {
    await page.goto("/notes");
    await expect(page.getByTestId("notes-empty")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("the photo named in the structured data is served", async ({ request }) => {
    const res = await request.get("/Avatar.png");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("sitemap, robots and the share image are served", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/work/kendara", "/about", "/lab", "/resume"]) expect(sitemap).toContain(`https://www.kalanadidulanga.com${path}`);
    for (const gone of ["/skills", "/experience"]) expect(sitemap).not.toContain(gone);
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://www.kalanadidulanga.com/sitemap.xml");
    const og = await request.get("/opengraph-image");
    expect(og.ok()).toBe(true);
    expect(og.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("contact API", () => {
  // Only bad or bot-like requests here: with SMTP set in .env, a good one
  // would send a real email.
  const base = { name: "Ann Perera", email: "ann@example.com", message: "I would like a website for my shop.", intent: "project" };

  test("rejects a request that is not a valid form", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "A" } });
    expect(res.status()).toBe(400);
    const odd = await request.post("/api/contact", { data: { ...base, intent: "sales pitch", startedAt: Date.now() - 60_000 } });
    expect(odd.status()).toBe(400);
  });

  test("answers bots as if it worked, without trying to send", async ({ request }) => {
    // 200 here, where a real send with no mail set up would be a 500, shows
    // the request stopped before the mailer.
    for (const data of [
      { ...base, startedAt: Date.now() - 60_000, website: "http://spam.example" },
      { ...base, startedAt: Date.now() },
    ]) {
      const res = await request.post("/api/contact", { data });
      expect(res.status()).toBe(200);
    }
  });
});

test("the GitHub profile banners are served as SVG", async ({ request }) => {
  // docs/github-profile/README.md points GitHub at these URLs.
  for (const theme of ["dark", "light"]) {
    const res = await request.get(`/github/banner-${theme}.svg`);
    expect(res.ok(), theme).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/svg+xml");
  }
});

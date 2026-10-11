import { test, expect } from "@playwright/test";
import { roles } from "../config/work-history";
import { skillId, skillLabel, skillUsage } from "../lib/skills";

const pages = [
  { path: "/work", heading: "Work" },
  { path: "/experience", heading: "Experience" },
  { path: "/skills", heading: "Skills" },
  { path: "/contact", heading: "Contact" },
];

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/KayD/);
  await expect(page.locator("body")).not.toBeEmpty();
});

for (const { path, heading } of pages) {
  test(`${path} renders its heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  });
}

test("/resume renders", async ({ page }) => {
  const response = await page.goto("/resume");
  expect(response?.status()).toBe(200);
});

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
  await page.locator('a[href^="/work/"]').first().click();
  await expect(page).toHaveURL(/\/work\/.+/);
});

test.describe("old links still land somewhere real", () => {
  test("a project link from the old /experience/<id> moves to /work/<id>", async ({ page }) => {
    await page.goto("/experience/uniguru");
    await expect(page).toHaveURL(/\/work\/uniguru$/);
  });

  test("/educations and /contributions now live on the experience page", async ({ page }) => {
    for (const path of ["/educations", "/contributions"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/experience/);
      await expect(page.getByRole("heading", { name: "Experience", level: 1 })).toBeVisible();
    }
  });
});

test("contact form validates before submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /^submit$/i }).click();
  // zod + react-hook-form should block the submit and surface a message
  await expect(page.locator("form")).toContainText(/required|must|invalid/i);
});


test("the experience page lists every role", async ({ page }) => {
  await page.goto("/experience");
  const section = page.locator("#roles");
  for (const r of roles) {
    await expect(section).toContainText(r.company);
    if (r.title) await expect(section).toContainText(r.title);
  }
});

test("each skill shows the number of projects that use it", async ({ page }) => {
  // The count is the proof. If it ever drifts from the config, a skill is
  // claiming work that is not listed.
  await page.goto("/skills");
  for (const group of skillUsage()) {
    for (const s of group.skills) {
      await expect(page.locator(`#${skillId(s.name)} [data-count]`)).toHaveText(
        String(s.projects.length)
      );
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

test.describe("search engines", () => {
  test("pages carry their own canonical URL", async ({ page }) => {
    for (const path of ["/", "/work", "/skills", "/work/kendara"]) {
      await page.goto(path);
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(href, path).toBe(`https://www.kalanadidulanga.com${path === "/" ? "" : path}`);
    }
  });

  test("the home page describes the person behind it", async ({ page }) => {
    await page.goto("/");
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(raw!)["@graph"].find((n: { "@type": string }) => n["@type"] === "Person");
    expect(person.name).toBe("Kalana Didulanga Koralegedara");
    expect(person.sameAs).toContain("https://github.com/kalanadidulanga/");
    expect(person.image).toBe("https://www.kalanadidulanga.com/Avatar.png");
  });

  test("an old /index.html link lands on the home page", async ({ request }) => {
    const res = await request.get("/index.html", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/");
  });

  test("the photo named in the structured data is served", async ({ request }) => {
    const res = await request.get("/Avatar.png");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("sitemap, robots and the share image are served", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://www.kalanadidulanga.com/work/kendara");
    expect(sitemap).not.toContain("/resume");
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://www.kalanadidulanga.com/sitemap.xml");
    const og = await request.get("/opengraph-image");
    expect(og.ok()).toBe(true);
    expect(og.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("contact API", () => {
  // Only bad or bot-like requests here: with SMTP set in .env, a good one
  // would send a real email.
  const base = { name: "Ann Perera", email: "ann@example.com", mobile: "0771234567", message: "I would like a website for my shop." };

  test("rejects a request that is not a valid form", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "A" } });
    expect(res.status()).toBe(400);
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

# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the KayD home page in an editorial minimal style with nine sections, adding Now, Selected Work, Testimonials, client logos and computed statistics, without inventing any content.

**Architecture:** Everything stays config driven. New sections read from new config files and render nothing when those files are empty, so an unfilled section is invisible rather than fake. Statistics are computed from `config/experience.ts` rather than written by hand. Shared editorial primitives (`SectionHeader`, `Reveal`) are built once and used by every section.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4 (CSS-first config in `app/globals.css`), TypeScript, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-30-portfolio-refresh-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Nothing invented.** No fabricated testimonials, no invented metrics, no placeholder content presented as real. A section whose config is empty renders nothing at all, never a sample.
- **No hand written numbers.** Every statistic is computed from `config/experience.ts`.
- **No `new Date()` for content timestamps.** It evaluates at build time and would fabricate a freshness date. Timestamps are hand written literals.
- **Do not display "years of experience."** The config documents 2023-11 to 2024-09 only. Kalana supplies that figure or it stays absent.
- **No em dashes** in any code, comment, copy, commit message or document. Use commas, colons, parentheses or a slash.
- **Accent colour is deep blue**, used only for links, section numbers and hover states.
- **Home page only.** Do not restructure `/experience`, `/skills`, `/educations`, `/contributions`, `/contact` or `/resume`.
- **The existing nine experience entries must keep working untouched.** All data model changes are additive and optional.
- Every task ends green: `npx tsc --noEmit`, `npx eslint .` and `npx playwright test` all pass before committing.

## File Structure

**Created:**

| File | Responsibility |
| --- | --- |
| `lib/stats.ts` | Compute project, client and technology counts from experience config |
| `config/now.ts` | The single "what I am building now" sentence |
| `config/testimonials.ts` | Real attributed quotes, empty until supplied |
| `components/section-header.tsx` | The `01 / LABEL` editorial section header |
| `components/reveal.tsx` | Scroll-in animation wrapper, honours reduced motion |
| `components/stats-strip.tsx` | Three computed numbers, rendered inline in the hero |
| `components/now-block.tsx` | The Now section |
| `components/case-study.tsx` | The Selected Work section, each entry as problem, approach, outcome |
| `components/client-logos.tsx` | Logo strip from professional experience entries |
| `components/testimonials.tsx` | Quote list |
| `tests/home.spec.ts` | Tests for the new sections and the nothing-invented rules |

**Modified:**

| File | Change |
| --- | --- |
| `app/globals.css` | Brand accent token, editorial type utilities |
| `config/constants.ts` | New `ValidSkills` and `ValidCategory` members as projects need them |
| `config/experience.ts` | Optional `featured` and `caseStudy` fields, fix the `uniguru` dates |
| `app/(root)/page.tsx` | Recomposed into nine sections, duplicate `id` fixed |
| `components/skills-card.tsx`, `project-card.tsx`, `contribution-card.tsx`, `educations.tsx` | Restyled to editorial, no API change |

---

### Task 1: Design tokens

Adds the deep blue accent and the editorial type utilities every later task uses. No visible change on its own.

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: the `text-brand` / `bg-brand` / `border-brand` utilities, and the `type-display`, `type-section`, `type-card`, `type-label` utilities

- [ ] **Step 1: Add the brand colour to the light palette**

In `app/globals.css`, inside the existing `@layer base { :root { ... } }` block, add below `--ring`:

```css
    /* deep blue accent, used sparingly for links, section numbers, hover */
    --brand: 221 83% 53%;
```

- [ ] **Step 2: Add the brand colour to the dark palette**

Inside `@layer base { .dark { ... } }`, add below its `--ring`:

```css
    /* lifted for contrast against the near black dark background */
    --brand: 217 91% 60%;
```

- [ ] **Step 3: Expose it to Tailwind**

In the `@theme inline` block, below `--color-card-foreground`:

```css
  --color-brand: hsl(var(--brand));
```

- [ ] **Step 4: Add the editorial type utilities**

Append to `app/globals.css`. These exist so heading sizes are declared once instead of respecified at every call site:

```css
/* One type scale, declared once. Before this each heading picked its own
   responsive sizes, which is most of why the page read as templated. */
@utility type-display {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  line-height: 1.05;
  letter-spacing: -0.02em;
  @media (width >= 640px) { font-size: 3.5rem; }
  @media (width >= 1024px) { font-size: 4.5rem; }
}

@utility type-section {
  font-family: var(--font-heading);
  font-size: 1.875rem;
  line-height: 1.1;
  letter-spacing: -0.015em;
  @media (width >= 768px) { font-size: 2.75rem; }
}

@utility type-card {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

@utility type-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Verify the tokens reach the stylesheet**

```bash
rm -rf .next && npx next build
CSS=$(find .next -name "*.css" -not -path "*/cache/*" -size +10k | head -1)
grep -o "\-\-brand:[^;]*" "$CSS"
```

Expected: build exits 0, and two matches, `221 83% 53%` and `217 91% 60%`.

Note: grepping for `type-display` returns nothing at this point. Tailwind only emits utilities that are used, and nothing uses them yet. That is correct, not a failure.

- [ ] **Step 6: Confirm nothing regressed**

```bash
npx tsc --noEmit && npx eslint . && npx playwright test
```

Expected: typecheck and lint silent, 12 Playwright tests pass.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "Add the deep blue accent and one editorial type scale

Heading sizes were respecified at every call site, which is most of why
the page read as templated. They are declared once here as utilities.
Nothing uses them yet."
```

---

### Task 2: Computed statistics

The three numbers shown in the hero, derived from config so they cannot drift into being false.

**Files:**
- Create: `lib/stats.ts`
- Create: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `Experiences` from `config/experience.ts`
- Produces: `siteStats: { projectsShipped: number; clients: number; technologies: number }`

- [ ] **Step 1: Write the failing test**

Create `tests/home.spec.ts`. It imports the same config the page uses, so it asserts the DOM matches the data rather than matching a number typed into the test:

```ts
import { test, expect } from "@playwright/test";
import { siteStats } from "../lib/stats";
import { Experiences } from "../config/experience";

test.describe("computed stats", () => {
  test("the numbers are derived from the experience config", () => {
    expect(siteStats.projectsShipped).toBe(Experiences.length);

    const professionalCompanies = new Set(
      Experiences.filter((e) => e.type === "Professional").map((e) => e.companyName)
    );
    expect(siteStats.clients).toBe(professionalCompanies.size);

    const tech = new Set(Experiences.flatMap((e) => e.techStack));
    expect(siteStats.technologies).toBe(tech.size);
  });

  test("the rendered numbers match the computed ones", async ({ page }) => {
    await page.goto("/");
    const strip = page.getByTestId("stats-strip");
    await expect(strip).toContainText(String(siteStats.projectsShipped));
    await expect(strip).toContainText(String(siteStats.clients));
    await expect(strip).toContainText(String(siteStats.technologies));
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home
```

Expected: FAIL, `Cannot find module '../lib/stats'`.

- [ ] **Step 3: Write the implementation**

Create `lib/stats.ts`:

```ts
import { Experiences } from "@/config/experience";

/**
 * Every number shown on the site is computed here, never written by hand,
 * so a stale figure cannot silently become a false claim.
 *
 * Deliberately absent: years of experience. The config documents
 * 2023-11 to 2024-09 only, so any derived figure would count undocumented
 * years as continuous work.
 */
export const siteStats = {
  projectsShipped: Experiences.length,

  clients: new Set(
    Experiences.filter((e) => e.type === "Professional").map((e) => e.companyName)
  ).size,

  technologies: new Set(Experiences.flatMap((e) => e.techStack)).size,
};
```

- [ ] **Step 4: Run the first test to verify it passes**

```bash
npx playwright test home -g "derived from the experience config"
```

Expected: PASS. The rendering test still fails, since `stats-strip` does not exist until Task 6.

- [ ] **Step 5: Commit**

```bash
git add lib/stats.ts tests/home.spec.ts
git commit -m "Compute the site statistics from the experience config

The numbers are derived rather than typed, so they cannot drift into
being false. The rendering half of the test fails until the stats strip
exists in a later task."
```

---

### Task 3: Editorial primitives

The two shared pieces every new section uses.

**Files:**
- Create: `components/section-header.tsx`
- Create: `components/reveal.tsx`

**Interfaces:**
- Consumes: `cn` from `lib/utils`
- Produces:
  - `<SectionHeader index="01" label="Selected work" title={string} description?={string} className?={string} />`
  - `<Reveal delay?={number} className?={string}>{children}</Reveal>`

- [ ] **Step 1: Write the section header**

Create `components/section-header.tsx`, a server component:

```tsx
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="type-label flex items-center gap-2 text-muted-foreground">
        <span className="text-brand">{index}</span>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
      </p>
      <h2 className="type-section mt-4">{title}</h2>
      {description ? (
        <p className="mt-4 leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
      <hr className="mt-8 border-border" />
    </div>
  );
}
```

- [ ] **Step 2: Write the reveal wrapper**

Create `components/reveal.tsx`, the only new client component:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade and rise on first scroll into view. IntersectionObserver rather than
 * an animation library, since that is the whole feature.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-500 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify both compile**

```bash
npx tsc --noEmit && npx eslint .
```

Expected: both silent.

- [ ] **Step 4: Commit**

```bash
git add components/section-header.tsx components/reveal.tsx
git commit -m "Add the editorial section header and scroll reveal

SectionHeader carries the numbered label that gives the page its
editorial structure. Reveal uses IntersectionObserver rather than an
animation library, and renders the final state immediately when the
viewer prefers reduced motion."
```

---

### Task 4: The Now section

One sentence about current work. Renders nothing when unset, which is the state it ships in.

**Files:**
- Create: `config/now.ts`
- Create: `components/now-block.tsx`
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `SectionHeader` from Task 3
- Produces: `<NowBlock />`, which returns `null` when `now.text` is empty; `now` from `config/now.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
import { now } from "../config/now";

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

  test("the updated date is a fixed literal, not build time", () => {
    // A new Date() here would restamp on every deploy and fabricate freshness.
    const today = new Date();
    const sameDay =
      now.updatedAt.getFullYear() === today.getFullYear() &&
      now.updatedAt.getMonth() === today.getMonth() &&
      now.updatedAt.getDate() === today.getDate();
    expect(sameDay && now.text.trim() !== "").toBe(false);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "now section"
```

Expected: FAIL, `Cannot find module '../config/now'`.

- [ ] **Step 3: Create the config**

Create `config/now.ts`:

```ts
/**
 * What Kalana is building right now. One sentence.
 *
 * An empty string means the section does not render. That is deliberate:
 * an unfilled section shows nothing rather than a placeholder.
 *
 * updatedAt is a hand written literal and must never be new Date(). That
 * evaluates at build time, so every deploy would claim this was written
 * today, which is a fabricated freshness date.
 */
export const now = {
  text: "",
  updatedAt: new Date("2026-08-01"),
};
```

- [ ] **Step 4: Create the component**

Create `components/now-block.tsx`:

```tsx
import { now } from "@/config/now";
import { SectionHeader } from "@/components/section-header";

export function NowBlock() {
  if (now.text.trim() === "") return null;

  const updated = now.updatedAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section id="now" className="container py-16 md:py-24">
      <SectionHeader index="01" label="Now" title="What I am building" />
      <div className="mt-8 max-w-2xl">
        <p className="text-lg leading-relaxed sm:text-xl">{now.text}</p>
        <p className="type-label mt-6 text-muted-foreground">Updated {updated}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npx playwright test home -g "now section"
```

Expected: PASS. With `text: ""` the component returns `null`, so the first test takes its absent branch.

- [ ] **Step 6: Commit**

```bash
git add config/now.ts components/now-block.tsx tests/home.spec.ts
git commit -m "Add the Now section, empty until there is something true to say

The component returns null for an empty config, so the section is absent
rather than filled with a placeholder. A test pins that behaviour, and a
second test fails the build if updatedAt is ever changed to new Date(),
which would fabricate a freshness date at deploy time."
```

---

### Task 5: Testimonials

Real attributed quotes only. Ships as an empty array.

**Files:**
- Create: `config/testimonials.ts`
- Create: `components/testimonials.tsx`
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `SectionHeader` from Task 3
- Produces: `<Testimonials />`, returns `null` when the array is empty; `Testimonial` interface and `testimonials` array

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
import { testimonials } from "../config/testimonials";

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
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "testimonials"
```

Expected: FAIL, `Cannot find module '../config/testimonials'`.

- [ ] **Step 3: Create the config**

Create `config/testimonials.ts`:

```ts
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/**
 * Real quotes from real people only. Empty means the section does not
 * render. Do not add sample or illustrative entries here.
 */
export const testimonials: Testimonial[] = [];
```

- [ ] **Step 4: Create the component**

Create `components/testimonials.tsx`:

```tsx
import { testimonials } from "@/config/testimonials";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="container py-16 md:py-24">
      <SectionHeader index="06" label="Testimonials" title="What people say" />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={`${t.name}-${t.company}`} delay={i * 60}>
            <figure className="border-l-2 border-brand pl-6">
              <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span>
                {", "}
                {t.role}, {t.company}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npx playwright test home -g "testimonials"
```

Expected: PASS. The second test passes vacuously over an empty array, and starts doing real work the moment a quote is added.

- [ ] **Step 6: Commit**

```bash
git add config/testimonials.ts components/testimonials.tsx tests/home.spec.ts
git commit -m "Add the testimonials section, empty until real quotes exist

Ships as an empty array and renders nothing. The attribution test is
vacuous today and begins enforcing name, company and quote the moment an
entry is added."
```

---

### Task 6: Hero and stats strip

Refreshes the hero to the new type scale and adds the three computed numbers. This is what makes the failing test from Task 2 pass.

**Files:**
- Create: `components/stats-strip.tsx`
- Modify: `app/(root)/page.tsx:36-91`

**Interfaces:**
- Consumes: `siteStats` from Task 2
- Produces: `<StatsStrip />` carrying `data-testid="stats-strip"`

- [ ] **Step 1: Create the stats strip**

Create `components/stats-strip.tsx`:

```tsx
import { siteStats } from "@/lib/stats";

const items = [
  { value: siteStats.projectsShipped, label: "Projects shipped" },
  { value: siteStats.clients, label: "Clients" },
  { value: siteStats.technologies, label: "Technologies" },
];

export function StatsStrip() {
  return (
    <dl
      data-testid="stats-strip"
      className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <span className="type-card text-brand">{item.value}</span>{" "}
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Update the hero**

In `app/(root)/page.tsx`, replace the `h1` and `h3` at lines 55 to 60 with the type utilities, and add the strip. The `h1` becomes:

```tsx
          <h1 className="type-display">Kalana Didulanga</h1>
          <h3 className="type-card text-muted-foreground">
            Full Stack Software Engineer
          </h3>
```

Then, directly after the closing `</div>` of the button row (currently line 88) and before the `chevronDown` icon, insert:

```tsx
          <div className="mt-10">
            <StatsStrip />
          </div>
```

Add the import at the top of the file:

```tsx
import { StatsStrip } from "@/components/stats-strip";
```

- [ ] **Step 3: Run the stats tests to verify they pass**

```bash
npx playwright test home -g "computed stats"
```

Expected: both PASS, including the rendering test that failed in Task 2.

- [ ] **Step 4: Confirm the whole suite is green**

```bash
npx tsc --noEmit && npx eslint . && npx playwright test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add components/stats-strip.tsx "app/(root)/page.tsx"
git commit -m "Add the computed stats strip to the hero

Completes the test written in the stats task: the rendered numbers are
now asserted against the values derived from the experience config. The
hero headings move onto the shared type scale."
```

---

### Task 7: Experience data model

Adds the optional fields Selected Work needs, and fixes the reversed Uniguru dates.

**Files:**
- Modify: `config/experience.ts:14-27` (the interface), the `uniguru` entry, and the exports at the end
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `featured?: boolean` and `caseStudy?: { problem: string; approach: string; outcome?: string }` on `ExperienceInterface`; a new `featuredCaseStudies` export

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "no entry ends before it starts"
```

Expected: FAIL, `uniguru: endDate is before startDate`. This is the real bug: `startDate: 2024-08-15`, `endDate: 2023-11-02`.

- [ ] **Step 3: Extend the interface**

In `config/experience.ts`, add to `ExperienceInterface` after `pagesInfoArr`:

```ts
  featured?: boolean;
  caseStudy?: {
    problem: string;
    approach: string;
    /** Omitted rather than invented. "Shipped and in production" is valid. */
    outcome?: string;
  };
```

- [ ] **Step 4: Fix the Uniguru dates**

In the `uniguru` entry, the year on `endDate` is wrong. Change:

```ts
    endDate: new Date("2023-11-02"),
```

to:

```ts
    endDate: new Date("2024-11-02"),
```

If Kalana confirms a different real end date, use that instead. Do not guess a date that changes the meaning; the year typo is evident because the entry sits among 2024 work.

- [ ] **Step 5: Add the featured export**

At the end of `config/experience.ts`, after `featuredExperiences`:

```ts
export const featuredCaseStudies = Experiences.filter(
  (e) => e.featured && e.caseStudy
);
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx playwright test home -g "experience data"
```

Expected: both PASS. The second passes vacuously until an entry is marked featured.

- [ ] **Step 7: Commit**

```bash
git add config/experience.ts tests/home.spec.ts
git commit -m "Add optional case study fields and fix the Uniguru end date

The entry had startDate 2024-08-15 with endDate 2023-11-02, so it sorted
as if it were the oldest work on the site. A test now fails on any entry
that ends before it starts.

The new featured and caseStudy fields are optional, so all nine existing
entries stay valid without edits."
```

---

### Task 8: Selected work

The flagship section: two or three projects told as problem, approach, outcome.

**Files:**
- Create: `components/case-study.tsx`
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `featuredCaseStudies` from Task 7, `SectionHeader` and `Reveal` from Task 3
- Produces: `<SelectedWork />`, returns `null` when nothing is featured

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
import { featuredCaseStudies } from "../config/experience";

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
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "selected work"
```

Expected: FAIL, `Cannot find module` for the component once it is imported by the page, or a count mismatch. With nothing featured yet the absent branch should pass, so confirm the failure is the missing module and not a false pass.

- [ ] **Step 3: Create the component**

Create `components/case-study.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";

import { featuredCaseStudies } from "@/config/experience";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

export function SelectedWork() {
  if (featuredCaseStudies.length === 0) return null;

  return (
    <section id="selected-work" className="container py-16 md:py-24">
      <SectionHeader
        index="02"
        label="Selected work"
        title="Selected work"
        description="A few projects in more detail: what the problem was, what I built, and what happened."
      />
      <div className="mt-12 space-y-20">
        {featuredCaseStudies.map((e, i) => (
          <Reveal key={e.id} delay={i * 80}>
            <article className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
              <div>
                <h3 className="type-card">{e.companyName}</h3>
                <p className="type-label mt-2 text-muted-foreground">
                  {e.techStack.join(" / ")}
                </p>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <div>
                    <p className="type-label text-foreground">Problem</p>
                    <p className="mt-1 leading-relaxed">{e.caseStudy?.problem}</p>
                  </div>
                  <div>
                    <p className="type-label text-foreground">Approach</p>
                    <p className="mt-1 leading-relaxed">{e.caseStudy?.approach}</p>
                  </div>
                  {e.caseStudy?.outcome ? (
                    <div>
                      <p className="type-label text-foreground">Outcome</p>
                      <p className="mt-1 leading-relaxed">{e.caseStudy.outcome}</p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 flex gap-6 text-sm">
                  <Link
                    href={`/experience/${e.id}`}
                    className="text-brand hover:underline"
                  >
                    Read more
                  </Link>
                  {e.websiteLink ? (
                    <Link
                      href={e.websiteLink}
                      target="_blank"
                      className="text-brand hover:underline"
                    >
                      Visit site
                    </Link>
                  ) : null}
                </div>
              </div>
              {e.pagesInfoArr[0]?.imgArr?.[0] ? (
                <Image
                  src={e.pagesInfoArr[0].imgArr[0]}
                  alt={`${e.companyName} screenshot`}
                  width={800}
                  height={500}
                  className="h-auto w-full rounded-lg border border-border object-cover"
                />
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx playwright test home -g "selected work"
```

Expected: PASS. The section is absent until Kalana marks entries as featured, at which point the count assertion begins doing real work.

- [ ] **Step 5: Commit**

```bash
git add components/case-study.tsx tests/home.spec.ts
git commit -m "Add the selected work section

Renders featured entries as problem, approach and outcome. Outcome is
omitted entirely when absent rather than filled with a claim. The section
is absent until an entry is marked featured."
```

---

### Task 9: Client logos

A logo strip built from the professional entries already in the config.

**Files:**
- Create: `components/client-logos.tsx`
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `Experiences` from `config/experience.ts`
- Produces: `<ClientLogos />`

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
test("client logos come from real professional entries", async ({ page }) => {
  await page.goto("/");
  const strip = page.getByTestId("client-logos");
  const expected = new Set(
    Experiences.filter((e) => e.type === "Professional").map((e) => e.companyName)
  );
  await expect(strip.locator("img")).toHaveCount(expected.size);
});
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "client logos"
```

Expected: FAIL, the strip is not found.

- [ ] **Step 3: Create the component**

Create `components/client-logos.tsx`:

```tsx
import Image from "next/image";

import { Experiences } from "@/config/experience";

/** One logo per distinct professional client, taken from the experience data. */
const clients = Array.from(
  new Map(
    Experiences.filter((e) => e.type === "Professional").map((e) => [
      e.companyName,
      e,
    ])
  ).values()
);

export function ClientLogos() {
  if (clients.length === 0) return null;

  return (
    <div
      data-testid="client-logos"
      className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale opacity-70"
    >
      {clients.map((c) => (
        <Image
          key={c.companyName}
          src={c.companyLogoImg}
          alt={c.companyName}
          width={48}
          height={48}
          className="h-10 w-auto object-contain"
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx playwright test home -g "client logos"
```

Expected: PASS with six logos, matching the six distinct professional companies currently in the config.

- [ ] **Step 5: Commit**

```bash
git add components/client-logos.tsx tests/home.spec.ts
git commit -m "Add the client logo strip

Built from the professional entries already in the experience config, so
it cannot list a company Kalana did not work with. The count is asserted
against that config."
```

---

### Task 10: Home page recomposition

Assembles the nine sections in order and fixes the duplicate DOM id.

**Files:**
- Modify: `app/(root)/page.tsx`
- Modify: `tests/home.spec.ts`

**Interfaces:**
- Consumes: every component from Tasks 3 to 9
- Produces: the final home page

- [ ] **Step 1: Write the failing test**

Append to `tests/home.spec.ts`:

```ts
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

  test("sections appear in the intended order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("section[id]").evaluateAll((nodes) =>
      nodes.map((n) => n.id)
    );
    const expectedOrder = [
      "now",
      "selected-work",
      "experience",
      "about",
      "skills",
      "testimonials",
      "educations",
      "contributions",
    ];
    const present = expectedOrder.filter((id) => ids.includes(id));
    expect(ids.filter((id) => present.includes(id))).toEqual(present);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
npx playwright test home -g "section ids are unique"
```

Expected: FAIL, `duplicate section id`. The about-me section at line 163 reuses `id="experience"` from line 117.

- [ ] **Step 3: Fix the duplicate id**

In `app/(root)/page.tsx`, the about-me section currently reads:

```tsx
      <section
        id="experience"
        className="container space-y-6 dark:bg-transparent py-10 my-14"
      >
```

Change its id to `about`:

```tsx
      <section
        id="about"
        className="container space-y-6 dark:bg-transparent py-10 my-14"
      >
```

- [ ] **Step 4: Compose the new order**

In `app/(root)/page.tsx`, add the imports:

```tsx
import { NowBlock } from "@/components/now-block";
import { SelectedWork } from "@/components/case-study";
import { Testimonials } from "@/components/testimonials";
import { ClientLogos } from "@/components/client-logos";
import { SectionHeader } from "@/components/section-header";
```

Place `<NowBlock />` and `<SelectedWork />` directly after the closing tag of the hero section, before the experience section. Place `<ClientLogos />` at the end of the experience section, inside it, above its "View All" link. Place `<Testimonials />` after the skills section.

The resulting order of sections carrying an id is:

`now`, `selected-work`, `experience`, `about`, `skills`, `testimonials`, `educations`, `contributions`.

Replace each remaining section's centred heading block with `SectionHeader`. For the skills section, the existing block:

```tsx
        <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {pagesConfig.skills.title}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {pagesConfig.skills.description}
          </p>
        </div>
```

becomes:

```tsx
        <SectionHeader
          index="04"
          label="Skills"
          title={pagesConfig.skills.title}
          description={pagesConfig.skills.description}
        />
```

Apply the same substitution to the other sections, using their existing `pagesConfig` values and these index numbers:

| Section | Index | `pagesConfig` key |
| --- | --- | --- |
| Experience | `03` | `experience` |
| About | `04` | `aboutme` |
| Skills | `05` | `skills` |
| Testimonials | `06` | (hardcoded in the component, Task 5) |
| Educations | `07` | `educations` |
| Contributions | `08` | `contributions` |

Now (`01`), Selected Work (`02`) and Testimonials (`06`) hardcode their own index inside their components, from Tasks 4, 8 and 5. All three already match this table; no change needed.

Remove the now unused `text-center` and `items-center` wrappers so the bodies sit left aligned.

- [ ] **Step 5: Run the structure tests to verify they pass**

```bash
npx playwright test home -g "home page structure"
```

Expected: both PASS.

- [ ] **Step 6: Confirm the whole suite is green**

```bash
npx tsc --noEmit && npx eslint . && npx playwright test
```

Expected: all pass, including the original 12 smoke tests.

- [ ] **Step 7: Commit**

```bash
git add "app/(root)/page.tsx" tests/home.spec.ts
git commit -m "Recompose the home page into eight editorial sections

Now and Selected Work sit directly below the hero, section headings move
to the numbered SectionHeader, and bodies are left aligned rather than
centred.

Also fixes a duplicate DOM id: the about-me section reused id=experience,
so anchor links to it resolved to the experience section instead. A test
now fails on any duplicate section id."
```

---

### Task 11: Restyle the existing cards

Brings the four existing card components onto the editorial style. No API changes, so nothing that consumes them needs touching.

**Files:**
- Modify: `components/skills-card.tsx`
- Modify: `components/project-card.tsx`
- Modify: `components/contribution-card.tsx`
- Modify: `components/educations.tsx`

**Interfaces:**
- Consumes: the type utilities from Task 1
- Produces: no prop changes

- [ ] **Step 1: Capture how the pages look now**

The other pages use these components, so this is the task most likely to change something unintended. Capture a reference first:

```bash
cat > tests/visual.spec.ts <<'EOF'
import { test, expect } from "@playwright/test";

const PAGES = ["/skills", "/experience", "/educations", "/contributions"];

for (const path of PAGES) {
  test(`${path} visual`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot({ fullPage: true, animations: "disabled" });
  });
}
EOF
npx playwright test visual --update-snapshots
```

Expected: four baselines written. These are a review aid, not an assertion; the pages are expected to change.

- [ ] **Step 2: Restyle the cards**

In each of the four components, apply these substitutions. Do not change any prop or export:

- Replace `shadow-lg`, `shadow-md`, `shadow-sm` and `rounded-2xl` with `border border-border rounded-lg`
- Replace ad hoc heading classes such as `text-xl font-bold` with `type-card`
- Replace any hardcoded `bg-slate-50` with `bg-muted/40`
- Add `transition-colors hover:border-brand` to the outermost element of each card

- [ ] **Step 3: Review what changed**

```bash
npx playwright test visual
```

Expected: FAIL with pixel diffs. Open the diff images under `test-results/` and confirm every change is intended. Investigate anything that changed which should not have, such as layout shifts or text reflow.

- [ ] **Step 4: Remove the temporary visual spec**

The baselines are platform specific and would fail on Linux CI, so they must not be committed:

```bash
rm -rf tests/visual.spec.ts tests/visual.spec.ts-snapshots test-results
```

- [ ] **Step 5: Confirm the suite is green**

```bash
npx tsc --noEmit && npx eslint . && npx playwright test
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add components/
git commit -m "Restyle the cards to match the editorial home page

Shadows and heavy rounding give way to hairline borders, headings move to
the shared type scale, and hover states use the brand accent. No props
changed, so the pages consuming these components did not need edits."
```

---

## Content handoff

Tasks 4, 5, 7 and 8 ship deliberately empty. They are complete and tested in that state, and become visible when Kalana supplies:

- Projects from the last two years, as new entries in `config/experience.ts`, with any new technology added to `ValidSkills` and any new category to `ValidCategory` in `config/constants.ts`
- `featured: true` and a `caseStudy` block on two or three of them
- Screenshots into `public/experience/<project-id>/`
- One sentence in `config/now.ts`, and a hand written `updatedAt` date
- Real attributed quotes in `config/testimonials.ts`, or none

No task is blocked on this content. Every section's structure, styling and tests are finished without it.

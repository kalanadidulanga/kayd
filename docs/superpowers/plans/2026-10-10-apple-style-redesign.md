# Apple-style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the whole kayd site to the approved Apple-inspired system and bring the content about Kalana up to date, without inventing anything.

**Architecture:** Same Next.js 16 App Router app. Design tokens move to Apple values in `app/globals.css` (shadcn variable names kept, so existing primitives restyle themselves). New config files carry the owner's stated facts; computed views live in `lib/`. Pages are rebuilt from a small set of new components (`Section`, `Logo`, `WorkRow`, `RoleRow`, `SkillChip`).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui primitives, next-themes, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-10-apple-style-redesign-design.md`

## Global Constraints

- Nothing invented: every number computed from config; unknown facts render nothing.
- No personal names of client contacts. Company names are allowed.
- No em dashes in copy, comments or docs.
- No new runtime dependencies; motion is CSS only.
- Light and dark mode both supported; `prefers-reduced-motion` and `prefers-reduced-transparency` respected.
- Colours, type, radii and shadow exactly as the spec's Visual system table.

## Review Focus

- A project with no screenshot: tiles, rows and detail pages must not show an empty frame.
- A role with no confirmed title: shows the company only, never a guessed title.
- Old links: `/experience/<id>`, `/educations`, `/contributions` must land on the new pages, not 404.
- JavaScript disabled: revealed sections must still be visible (existing noscript rule).
- A skill added to a project but not mapped to a group: must fail a test, not silently vanish.

---

### Task 1: Owner facts and computed skills

**Files:**
- Create: `config/profile.ts`, `config/work-history.ts`, `lib/skills.ts`, `tests/data.spec.ts`
- Rewrite: `config/skills.ts`

**Interfaces:**
- Produces: `profile: { name; headline; about: string[]; yearsOfExperience: number; experienceSince: number }`;
  `roles: Role[]` with `Role = { company: string; title?: string; start: string; end?: string; note?: string }` and `formatRange(role): string`;
  `skillGroups: { title: string; skills: ValidSkills[] }[]`, `alsoWorkedWith: string[]`;
  `skillUsage(): { title: string; skills: { name: ValidSkills; projects: ExperienceInterface[] }[] }[]` (empty groups and unused skills dropped, sorted by count).

- [ ] **Step 1: Write the failing tests** (`tests/data.spec.ts`)

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { Experiences } from "../config/experience";
import { skillGroups } from "../config/skills";
import { skillUsage } from "../lib/skills";
import { roles } from "../config/work-history";

test("every skill a project uses sits in exactly one group", () => {
  const used = new Set(Experiences.flatMap((e) => e.techStack));
  for (const s of used) {
    const homes = skillGroups.filter((g) => g.skills.includes(s));
    expect(homes.length, `${s} is in ${homes.length} groups`).toBe(1);
  }
});

test("skill counts equal the projects that list them", () => {
  for (const g of skillUsage()) {
    for (const s of g.skills) {
      const expected = Experiences.filter((e) => e.techStack.includes(s.name));
      expect(s.projects.length).toBe(expected.length);
      expect(s.projects.length).toBeGreaterThan(0);
    }
  }
});

test("roles have valid dates and never end before they start", () => {
  expect(roles.length).toBeGreaterThan(0);
  for (const r of roles) {
    expect(r.start).toMatch(/^\d{4}(-\d{2})?$/);
    if (r.end) {
      expect(r.end).toMatch(/^\d{4}(-\d{2})?$/);
      expect(r.end >= r.start, `${r.company}`).toBe(true);
    }
  }
});

test("years of experience is a stated literal, never computed", () => {
  const src = readFileSync(path.join(__dirname, "..", "config", "profile.ts"), "utf-8");
  expect(src).toMatch(/yearsOfExperience:\s*\d+,/);
  expect(src).not.toMatch(/new Date\(/);
});
```

- [ ] **Step 2:** Run `pnpm test tests/data.spec.ts`; expect failures (modules missing).
- [ ] **Step 3:** Write the four config/lib files from the spec's Data model and Roles tables.
- [ ] **Step 4:** Run the tests; expect pass.

### Task 2: Design tokens, type, primitives

**Files:** Modify `app/globals.css`, `app/layout.tsx`, `components/ui/button.tsx`, `components/ui/chip.tsx`, `components/reveal.tsx`, `config/site.ts`.

- [ ] Replace the `:root` and `.dark` values with the spec's colours as HSL triplets; add `--tile`, `--tile-foreground`, `--parchment`, `--link`.
- [ ] Font stacks: `--font-sans` and `--font-heading` start with `-apple-system, BlinkMacSystemFont, "SF Pro Text"/"SF Pro Display"`, then `var(--font-inter)`. Remove Cal Sans from `layout.tsx` and delete `assets/fonts`.
- [ ] Type utilities `type-hero`, `type-section`, `type-tile`, `type-card`, `type-label`; body 17px / 1.47.
- [ ] Delete the unused legacy `.card`, `.content`, `.btn`, `.tick`, `.circle` CSS.
- [ ] Button: pill radius, `active:scale-[0.97]`; Chip: hairline pill.
- [ ] Reveal: 16px rise, 700ms, `cubic-bezier(0.22,1,0.36,1)`.
- [ ] `pnpm typecheck` passes.

### Task 3: Logo and icons

**Files:** Create `components/logo.tsx`, `app/icon.svg`, `app/apple-icon.png`; replace `app/favicon.ico`; delete `public/images/K.png`; drop `metadata.icons` in `app/layout.tsx`.

- [ ] Logo: inline SVG from `docs/logo-concepts/b-wordmark.svg`, ink `fill="currentColor"`, underline `fill="hsl(var(--link))"`, `aria-label="KayD"`.
- [ ] Icons rendered from `docs/logo-concepts/b-icon-small.svg` (180px PNG, 16/32/48 ICO).

### Task 4: Shell

**Files:** Create `components/section.tsx`, `components/site-header.tsx`; rewrite `components/site-footer.tsx`, `components/mobile-nav.tsx`, `config/routes.ts`, `app/(root)/layout.tsx`; delete `components/main-nav.tsx`.

- [ ] `Section({ id, tone: "canvas" | "parchment" | "tile", className, children })`: full-width background, inner `container max-w-[1080px]`.
- [ ] Header: sticky, frosted, logo, Work/Experience/Skills/Contact, GitHub, ModeToggle; mobile menu button opening a sheet with the same links.
- [ ] Footer: socials and name, no year.
- [ ] Layout `main` no longer wraps pages in `container`.

### Task 5: Work list, detail and redirects

**Files:** Create `components/work-row.tsx`, `app/(root)/work/page.tsx`, `app/(root)/work/[id]/page.tsx`; delete `app/(root)/experience/[expId]`, `components/project-card.tsx`, `components/exp-desc.tsx`; modify `next.config.mjs`, `tests/smoke.spec.ts`.

- [ ] Smoke tests updated: `/work` heading "Work"; `/work/uniguru` renders with a "All work" back link; unknown id lands on `/work`; index row navigates to `/work/<id>`; `/experience/uniguru` redirects to `/work/uniguru`; `/educations` lands on `/experience`; `/contributions` lands on `/experience`.
- [ ] Rows: year, name, short description (md+), top three stack items, chevron; hover screenshot when `coverImg` exists.
- [ ] Detail: spec's Work detail section; `generateStaticParams`; unknown id redirects to `/work`.

### Task 6: Experience page

**Files:** Create `components/role-row.tsx`; rewrite `app/(root)/experience/page.tsx`; delete `app/(root)/educations`, `app/(root)/contributions`, `components/educations.tsx`, `components/contribution-card.tsx`.

- [ ] Sections `#about` (profile + avatar), `#roles`, `#education`, `#contributions`.
- [ ] Test: every role's company appears on `/experience`.

### Task 7: Skills page

**Files:** Create `components/skill-groups.tsx`; rewrite `app/(root)/skills/page.tsx`; delete `components/skills-card.tsx`, `components/rating.tsx`.

- [ ] Native `<details>` chip per skill: name, count, project links.
- [ ] Test: each chip's count on `/skills` equals the computed count.

### Task 8: Contact page

**Files:** `app/(root)/contact/page.tsx`, `components/forms/contact-form.tsx` (styling only).

- [ ] Same form logic; the existing validation test keeps passing.

### Task 9: Home page

**Files:** Rewrite `app/(root)/page.tsx`, `components/case-study.tsx`, `components/stats-strip.tsx` (bento), `components/now-block.tsx`, `components/testimonials.tsx`, `components/client-logos.tsx`; delete `components/section-header.tsx`, `components/page-header.tsx`; update `tests/home.spec.ts`.

- [ ] Section order and ids: `hero`, `at-a-glance` (holds `#now` when set), `selected-work`, `clients`, `work`, `testimonials`, `experience`, `skills`, `contact`.
- [ ] Unconditional: `hero`, `at-a-glance`, `work`, `experience`, `skills`, `contact`.
- [ ] Bento keeps `data-testid="stats-strip"` and shows projects, clients, technologies, years.

### Task 10: Verify

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` all pass.
- [ ] Screenshots at 390 and 1440, light and dark, for `/`, `/work`, `/work/operations-crm-platform`, `/experience`, `/skills`, `/contact`; fix what looks wrong.
- [ ] Grep for em dashes in changed files.

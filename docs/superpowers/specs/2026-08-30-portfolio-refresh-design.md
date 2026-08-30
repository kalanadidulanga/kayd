# Portfolio refresh — design

**Date:** 2026-08-30
**Status:** approved, pending implementation plan

## Problem

The portfolio has been visually unchanged for roughly two years. Three
things are wrong with it:

1. **It looks templated.** Every section is centre-aligned, heading sizes
   are picked ad hoc per element (`text-3xl sm:text-5xl md:text-6xl
   lg:text-7xl` repeated with variations), and there is no accent colour.
   Nothing signals a deliberate design decision.
2. **The home page is thin.** Five sections: hero, skills, experience,
   educations, about-me, contributions.
3. **The content stops at September 2024.** `config/experience.ts` holds
   nine projects spanning 2023-11-10 to 2024-09-15. Two years of work is
   missing.

## Constraint: nothing invented

Stated by the site owner and binding on every decision below: no
fabricated testimonials, no invented metrics, no placeholder content
presented as real.

This is enforced structurally rather than by good intentions:

- Every section renders from config. A section whose config is empty
  renders nothing at all — it does not render a placeholder.
- Statistics are computed from `config/experience.ts` at build time. No
  number is written by hand, so no number can drift into being false.
- Tests assert both properties (see Testing).

The one number deliberately **not** shown is "years of experience".
Derived from the config it would read ~2.8 years (Nov 2023 → today), which
silently counts two undocumented years as continuous work. If a years
figure is wanted, the owner supplies it explicitly.

## Audience

All four of: recruiters, freelance clients, peers, general presence. That
combination means the page must be **layered** — skimmable in fifteen
seconds, with depth underneath for anyone who keeps scrolling. It is not a
licence to optimise for nobody.

## Visual direction

Editorial minimal. Keeps the existing minimalism; changes how it is
structured.

| Element | Now | After |
| --- | --- | --- |
| Type scale | Ad hoc per heading | One scale in `@theme`, used everywhere |
| Alignment | Everything centred | Centred hero; left-aligned section bodies |
| Section headers | Large centred `h2` | `01 — SELECTED WORK`: small, uppercase, tracked, muted |
| Dividers | Card borders, shadows | Hairline rules on `--border` |
| Colour | Fully monochrome | Monochrome + deep blue accent |
| Motion | None | Fade + 8px rise on scroll-in, ~400ms |

The accent is deep blue, used only for links, section numbers and hover
states. Sparse use is the point; an accent everywhere is the same as no
accent.

Motion uses `IntersectionObserver` (~15 lines, no animation library) and
must honour `prefers-reduced-motion: reduce` by rendering the final state
immediately.

## Home page structure

Eight sections:

| # | Section | Source | Renders when |
| --- | --- | --- | --- |
| — | Hero + inline stats strip | `lib/stats.ts` | always |
| 01 | Now | `config/now.ts` | `text` is non-empty |
| 02 | Selected work | `experience.featured` | ≥1 featured entry |
| 03 | Experience + client logos | `config/experience.ts` | always |
| 04 | Skills | `config/skills.ts` | always |
| 05 | Testimonials | `config/testimonials.ts` | array non-empty |
| 06 | Education | `config/educations.ts` | always |
| 07 | Contributions | `config/contributions.ts` | always |

Stats live inline in the hero rather than as their own section — three
numbers do not justify a full-height block.

**Now is second, directly below the hero.** It is the section that answers
"is this site still alive", so it precedes everything else.

## Data model

All changes are additive. Every one of the nine existing entries stays
valid without edits.

```ts
// config/experience.ts — ExperienceInterface gains:
featured?: boolean;
caseStudy?: {
  problem: string;
  approach: string;
  outcome?: string;   // optional: omitted rather than invented
};
```

```ts
// config/now.ts — new
export const now = {
  text: "",                          // empty => section does not render
  updatedAt: new Date("2026-08-01"), // a literal date, set by hand
};
```

```ts
// config/testimonials.ts — new
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}
export const testimonials: Testimonial[] = []; // empty => no section
```

```ts
// lib/stats.ts — new, all computed from Experiences
projectsShipped: number;  // Experiences.length
clients: number;          // distinct companyName where type === "Professional"
technologies: number;     // distinct union of every techStack
```

New technologies arriving with new projects must be added to the
`ValidSkills` union in `config/constants.ts`, and any new project
category to `ValidCategory`; the types will not accept them otherwise.

`updatedAt` is a hand-written literal date, never `new Date()`. A
`new Date()` there evaluates at build time, so every deploy would claim
the Now text was written today — a fabricated freshness date, which is
exactly what the constraint above forbids.

## Components

New, each with one job:

- `components/section-header.tsx` — the `01 — LABEL` header. Used by every section.
- `components/reveal.tsx` — scroll-in wrapper. Client component; the only new client boundary.
- `components/case-study.tsx` — one featured project, problem/approach/outcome.
- `components/stats-strip.tsx` — the three computed numbers.
- `components/now-block.tsx` — the Now section.
- `components/testimonials.tsx` — quote list.
- `components/client-logos.tsx` — logo strip built from the `companyLogoImg` of entries where `type === "Professional"`.

Existing `skills-card`, `project-card`, `contribution-card` and
`educations` are restyled in place, not replaced.

## Bugs fixed as part of this work

Both are in code being touched anyway:

1. `app/(root)/page.tsx` — the about-me section uses `id="experience"`,
   already used by the experience section at line 117. Duplicate DOM id;
   anchor links resolve to the wrong section.
2. `config/experience.ts` — the `uniguru` entry has `startDate:
   2024-08-15` and `endDate: 2023-11-02`. End precedes start, which
   corrupts its position in the date sort.

## Testing

Extending the existing Playwright suite:

- Every new section renders on `/` when its config has data.
- **`now.text === ""` renders no Now section**, and an empty
  `testimonials` array renders no testimonials section. These encode the
  nothing-invented constraint as tests.
- **Rendered stats equal the values computed from config** — the numbers
  cannot silently go stale or wrong.
- Existing twelve smoke tests continue to pass.
- Visual regression is checked by screenshotting before and after at
  390/700/1024/1280/1500 plus dark mode. Unlike the Tailwind migration,
  these are *expected* to differ — the screenshots are for reviewing the
  change deliberately, not for asserting equality, and the baselines are
  not committed.

## Content required from the owner

The design does not depend on this; implementation of sections 01, 02 and
05 does.

- Projects from the last two years: name, type, one-liner, live and GitHub
  URLs, tech stack, start and end dates.
- For 2–3 featured: problem, approach, and outcome — outcome left blank
  rather than invented.
- Screenshots into `public/experience/<project-id>/`, or explicit
  confirmation that a project has none.
- One sentence for Now.
- Testimonials as real attributed quotes, or none.

## Out of scope

- Restructuring the `/experience`, `/skills`, `/educations`,
  `/contributions` or `/contact` pages. Home page only.
- A blog or CMS. Config files remain the content store.
- Replacing shadcn components or the Tailwind setup, both just modernised.

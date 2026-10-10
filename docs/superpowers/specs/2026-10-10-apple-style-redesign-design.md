# Apple-style redesign and content update: design

**Date:** 2026-10-10
**Status:** design approved in conversation; the owner asked for the whole
job to be finished end to end, so open owner inputs are resolved
conservatively below rather than blocking.
**Supersedes:** the visual direction in `2026-08-30-portfolio-refresh-design.md`.
Its content rules (nothing invented, sections render from config) still bind.

## Problem

The owner finds the current UI/UX weak, and the content about him is out
of date: the About text still says "MERN stack frontend", the Skills page
rates skills with stars he wrote two years ago, and there is no work
history. He asked for a modern, minimal, Apple-inspired look, using
Apple's HIG, Emil Kowalski's apple-design notes and the apple.com
DESIGN.md as references.

## Audience and success

Recruiters, freelance clients and peers. Success: in 15 seconds a visitor
knows who Kalana is, what he builds and his best work; the site reads as
calm and crafted on a phone and on a desktop, in light and dark.

## Binding constraints

1. **Nothing invented.** Numbers are computed from config. Skills show only
   with the projects that prove them. No star ratings. Unknown facts render
   nothing rather than a guess.
2. **No personal names of client contacts.** Company names are fine.
3. **No em dashes** anywhere in copy, code comments or docs.
4. No new runtime dependencies. CSS does the motion.

## Visual system

Taken from the apple.com DESIGN.md and the apple-design skill.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | `#ffffff` | `#000000` |
| Parchment (alternate section) | `#f5f5f7` | `#161617` |
| Tile (featured dark band) | `#000000` | `#1d1d1f` |
| Ink | `#1d1d1f` | `#f5f5f7` |
| Muted text | `#6e6e73` | `#86868b` |
| Hairline | `#e0e0e0` | `#333336` |
| Action blue (buttons) | `#0066cc` | `#0071e3` |
| Link blue | `#0066cc` | `#2997ff` |

- One accent only: blue, for links, primary buttons and focus.
- **Type:** `-apple-system, BlinkMacSystemFont, "SF Pro Display"/"SF Pro Text"`,
  then Inter (already loaded), then `system-ui`. Cal Sans is removed. Weights
  400 and 600 only. Headings tight: hero `-0.03em`, section `-0.02em`,
  leading 1.05 to 1.1. Body 17px, leading 1.47.
- **Shape:** pill buttons; 18px cards; 12px screenshots.
- **Depth:** no shadows on chrome or cards. Screenshots get the one product
  shadow `rgba(0,0,0,.22) 3px 5px 30px`. The header is a frosted layer
  (`backdrop-filter: blur(20px) saturate(180%)` over 72% canvas).
- **Rhythm:** full-width sections alternate canvas and parchment; the colour
  change is the divider, so hairline `<hr>`s go.
- **Motion:** buttons scale to 0.97 on press (100ms). Sections fade and rise
  16px on first view (700ms, `cubic-bezier(0.22, 1, 0.36, 1)`). Work rows
  reveal their screenshot on hover with CSS only. `prefers-reduced-motion`
  removes movement; `prefers-reduced-transparency` makes the header solid.

## Information architecture

Nav: **Work · Experience · Skills · Contact**, logo B on the left (home),
GitHub and the theme toggle on the right.

| Route | Content |
| --- | --- |
| `/` | Home, see below |
| `/work` | All projects as rows, filter All / Client / Personal |
| `/work/[id]` | Project detail |
| `/experience` | About, roles timeline, education, contributions |
| `/skills` | Skill groups with proof |
| `/contact` | Contact form and direct links |
| `/resume` | Unchanged redirect |

Permanent redirects keep old links working: `/experience/:id` to
`/work/:id`, `/educations` to `/experience#education`, `/contributions` to
`/experience#contributions`.

### Home, top to bottom

1. **Hero** (canvas): name, headline "Full stack engineer. Web, mobile and
   desktop.", a line built from the current roles, two pills: See my work,
   Get in touch.
2. **At a glance** (parchment bento): years of experience, projects,
   clients, technologies, and a wide "Now" tile with the current roles. The
   `now.ts` sentence shows there when it is not empty.
3. **Selected work**: one full-width tile per featured case study, cycling
   tile (black), canvas, parchment. Title, short description, outcome, links,
   screenshot. A project with no screenshot shows its outcome large instead
   of an empty frame.
4. **Clients**: the existing logo strip.
5. **All work**: the eight newest projects as rows, then "See all N".
6. **Testimonials**: only when the config has any.
7. **Experience**: the roles timeline, then a link to the full page.
8. **Skills**: the groups with counts, then a link to the full page.
9. **Contact** (parchment): "Have something in mind?" and a pill.

### Work detail

Back link; year range and "Client project" or "Personal project"; title;
short description; pills for Visit site and Source when they exist; the
cover screenshot; Problem / Approach / Outcome when there is a case study;
overview paragraphs and bullets; stack chips that link to `/skills`;
remaining screenshots; a link to the next project.

### Skills

Groups: Frontend, Backend, Databases, Mobile, Desktop, Platforms and
DevOps. Each skill is a native `<details>` chip: name and project count,
opening to the list of projects that use it. A skill used by no listed
project does not appear in a group. Skills the owner declared on the old
Skills page that no listed project uses yet (Java, MongoDB, Nest.js,
Angular, AWS, Material UI, Bootstrap) show in one "Also worked with" line,
without counts, since they are his own statement.

## Data model

- `config/profile.ts` (new): name, headline, about paragraphs,
  `yearsOfExperience: 3` and `experienceSince: 2023`, both literals stated by
  the owner on 2026-10-09, never computed.
- `config/work-history.ts` (new): roles with company, optional title,
  `start` and optional `end` as `"YYYY"` or `"YYYY-MM"` strings, and an
  optional note. No end means present. A role with no confirmed title shows
  the company alone.
- `config/skills.ts` (rewritten): `skillGroups` mapping every `ValidSkills`
  value to one group, and `alsoWorkedWith`. Ratings and icons go.
- `lib/skills.ts` (new): usage computed from `config/experience.ts`.
- `config/routes.ts`, `config/site.ts`, `config/pages.ts`, page metadata:
  updated copy.

### Roles, as the owner stated them

| Company | Title | Dates | Note |
| --- | --- | --- | --- |
| TwinCore Tech | Software Engineer | 2025 to present | |
| C-Lento | Project Manager and Software Engineer | 2023 to present | Project-based work since 2023; project manager and engineer since 2026 |
| Fuchsius (Pvt) Ltd | not confirmed, so not shown | 2024-12 to 2025 | |
| Techseya | not confirmed, so not shown | 2023 to 2024 | Project-based; 2024 is the last commit seen |
| Freelance | Full Stack Developer | 2023 to present | |

### About text

Written only from the repositories and the owner's answers: three years of
experience; Software Engineer at TwinCore Tech; project manager and
engineer at C-Lento; freelancing since 2023; web platforms in Next.js and
Supabase, mobile apps in Expo, Windows software in Rust/Tauri, Electron and
.NET, APIs in Node.js and Go; leads developers who build for his clients.

## Logo and icons

Logo concept B (calligraphic) becomes `components/logo.tsx`, an inline SVG
whose ink follows `currentColor` and whose underline uses the brand blue, so
it themes itself. `app/icon.svg` and `app/apple-icon.png` come from the
small-size K cut; the red `public/images/K.png` and the old favicon go.

## Removed

Cal Sans, star ratings (`rating.tsx`, `skills-card.tsx`), the old card CSS in
`globals.css`, the `/educations` and `/contributions` pages (redirected),
`page-header.tsx` and `section-header.tsx` (replaced by section titles in the
new style), the Norican font.

## Testing

- Existing guards stay: computed stats, empty Now and testimonials render
  nothing, no end-before-start, featured entries have case studies.
- Updated: home structure and order, routes, detail page at `/work/[id]`.
- New: redirects; every skill used by a project sits in exactly one group;
  rendered skill counts equal computed ones; every role renders; the profile
  never sets years from `new Date()`.
- Visual check (not committed): screenshots at 390 and 1440 px, light and
  dark, for home, work, a detail page, experience, skills and contact.

## Out of scope

New screenshots for projects that have none, a blog, a CMS, translations,
contact form backend changes.

# Claude Code Master Prompt

Copy everything inside the prompt block below into Claude Code while its working directory is the repository root.

```text
You are working inside the `kayd` repository, the production portfolio for Kalana Didulanga Koralegedara. Your job is to implement the complete next-generation portfolio redesign end to end.

Do not stop after making a plan or a partial homepage. Audit the repository, implement the whole approved information architecture and visual system, migrate the real content, preserve the working product behavior, update the tests, and verify the finished result. Work autonomously when the repository and documentation already answer a question. Ask Kalana only when a missing personal fact, private client decision, or asset approval would otherwise force you to invent information.

## First action: read the project before editing

Read these files completely in this order:

1. `docs/portfolio-vision/README.md`
2. `docs/portfolio-vision/01-creative-direction.md`
3. `docs/portfolio-vision/02-design-system-and-continuity.md`
4. `docs/portfolio-vision/03-global-experience-and-motion.md`
5. `docs/portfolio-vision/04-home-page.md`
6. `docs/portfolio-vision/05-work-and-project-pages.md`
7. `docs/portfolio-vision/06-about-page.md`
8. `docs/portfolio-vision/07-lab-and-notes.md`
9. `docs/portfolio-vision/08-contact-and-utility-pages.md`
10. `docs/portfolio-vision/09-asset-manifest.md`
11. `docs/portfolio-vision/10-ai-asset-generation-prompts.md`
12. `docs/portfolio-vision/11-content-data-and-roadmap.md`
13. `docs/portfolio-vision/12-generated-asset-catalog.md`
14. `docs/portfolio-vision/CLAUDE-CODE-BRIEF.md`

Then inspect the complete current implementation, with special attention to:

- `package.json`
- `app/layout.tsx`
- `app/globals.css`
- `app/(root)/layout.tsx`
- `app/(root)/page.tsx`
- every route under `app/(root)/`
- `app/api/contact/route.ts`
- `app/sitemap.ts`, `app/robots.ts`, and `app/opengraph-image.tsx`
- every file under `components/`
- every source-of-truth file under `config/`
- every helper under `lib/`
- `next.config.mjs`
- every Playwright file under `tests/`
- existing real assets under `public/`
- logo candidates under `docs/logo-concepts/`

Do not edit until you understand the content model, current route behavior, accessibility safeguards, SEO behavior, contact flow, and test coverage.

## Repository facts

- Framework: Next.js 16 App Router with React 19 and TypeScript 6.
- Styling: Tailwind CSS 4 plus existing Radix/shadcn-style primitives.
- Animation: Motion for React and Lenis.
- Theme: `next-themes` currently supports light/dark.
- Content: plain TypeScript under `config/`; there is no CMS or database.
- Deployment target: Vercel.
- Contact form: `/api/contact`, using optional SMTP environment variables.
- Testing: Playwright. Existing tests cover truthful data, navigation, redirects, SEO, contact validation, reduced motion, no-JavaScript visibility, layout, theme, and current visual behavior.
- The current branch contains earlier Apple-style and cinematic redesign work. The new `docs/portfolio-vision/` specification supersedes their visual direction. Preserve their truthful-data and graceful-degradation principles.

## Product objective

Build an immersive, personal software-engineering portfolio called **The Living Systems Garden**.

The site should feel like one authored digital environment, not a sequence of disconnected portfolio components. Green is Kalana's permanent brand identity, not a visitor-selectable accent. The visual metaphor connects software systems and subtle organic growth through paths, nodes, fields, contours, light, and progressive disclosure. Keep it technical and restrained. Do not make it a literal plant or jungle theme.

Audience:

1. potential clients evaluating business systems and product work
2. recruiters and hiring managers verifying experience and contribution
3. developers and creative visitors exploring technical depth and experiments

Success:

- Within 15 seconds, visitors understand that Kalana builds serious web, mobile, desktop, and operational software.
- Within 60 seconds, visitors can discover relevant work.
- The experience is remembered for its connected green world, precise engineering evidence, and personal curiosity.

## Non-negotiable visual system

Use the Living Emerald tokens specified in `02-design-system-and-continuity.md`:

- dark canvas `#07100D`
- dark field `#0A1712`
- dark surface `#0F2119`
- dark ink `#ECF7F0`
- dark muted `#A0B6A8`
- brand mint `#67E39B`
- bright mint `#A3F6C1`
- light canvas `#F4F8F5`
- light field `#EAF2ED`
- light ink `#102018`
- light brand `#087A46`

Remove Indigo and Ember from the public brand experience. Remove the public accent picker. Preserve light/dark behavior where the specification calls for it, but keep the green identity in both themes.

Do not alternate hard rectangular background bands between sections. Replace the current `band` model with a `SceneSection` or equivalent system supporting:

- light drift
- ambient gradient bridges
- soft overlap
- texture migration
- depth changes
- one visual object handing off into the next section

The page must feel continuous. Do not wrap every section in a card. Do not add borders above and below every section. Do not use three equal cards as the default layout. Use glass only for functional floating UI such as the morphing navigation or command palette.

Typography should be a precise grotesk plus mono metadata. Prefer the existing Geist and Geist Mono. Use italic or weight from the same display family for emphasis instead of injecting a decorative serif into every heading. Remove Instrument Serif from the new public visual language unless one exceptional, well-justified use survives review.

## Required route architecture

Implement and maintain:

- `/` Home
- `/work` searchable Work explorer
- `/work/[id]` project detail with presentation levels
- `/about` personal story, roles, process, education, and contributions
- `/lab` experiments and small tools
- `/notes` engineering journal index
- `/notes/[slug]` article layout
- `/contact` accessible working contact page
- `/resume` résumé landing/download behavior

Optional routes may be implemented only if real content exists:

- `/uses`
- `/now`

Preserve old URLs with permanent redirects. Existing `/experience`, `/skills`, `/educations`, `/contributions`, and old `/experience/[id]` links must resolve to the correct new destination or anchored content. Update sitemap, canonical metadata, Open Graph output, and tests accordingly.

## Home page: seven connected scenes maximum

Implement the exact narrative defined in `04-home-page.md`:

1. Signature hero
2. Selected systems
3. How I think
4. Range
5. Lab signal
6. Personal note
7. Closing invitation and footer handoff

### Hero

Replace the current code-window hero with the Living Systems Atlas. Use the generated PNG as the initial static fallback and visual reference. If you implement the interactive version, build it as accessible SVG or Canvas with a static fallback. Keep large typography on the left and the Atlas primarily on the right. Do not allow the decorative layer to delay the main text's Largest Contentful Paint.

Suggested public copy may be refined, but it must stay factual:

- Name: Kalana Didulanga
- Headline direction: `I build software for the real world.`
- Supporting idea: web platforms, mobile apps, Windows software, and operational systems
- Primary action: Explore work
- Secondary action: About Kalana

Do not publish an availability statement unless current repository data or Kalana confirms it.

### Selected systems

Use three to five owner-approved flagship systems. Start from the real projects and case-study data in `config/experience.ts`, including Uniguru Operations Platform, Kendara, Hotel Management System, and other strong documented work. Avoid matching cards. Use one anchor project plus smaller text-led signals. Real screenshots take priority over generated artwork.

### How I think

Build one evolving schematic around four grounded principles: understand the operation, make complexity legible, build for reliability, and refine the last interaction. Each principle must connect to a real project decision.

### Range

Show web, mobile, Windows, commerce/POS, and technical leadership as a connected field map. Derive project links from configuration rather than hardcoding claims.

### Lab, personal note, and closing

Use real experiments when available. Use the real portrait and workspace images only after evaluating quality and privacy. The closing has one contact intent. The footer must grow from the final scene rather than becoming a separate rectangle.

## Work explorer

Build a text-first explorer where every project remains useful without imagery.

Search across:

- title
- summary
- domain
- platform
- ownership
- technology
- role
- year
- presentation depth

Primary filters:

- professional, personal, team
- web, mobile, desktop
- domain

Advanced filters may include technology, year, and depth. Do not expose an intimidating wall of filters by default.

Provide a highly usable Index view. A spatial Field view or image grid is secondary and should not block completion of the core index.

Each project must be assigned one presentation level:

- full case study
- project story
- project note

Do not invent case-study material. Render only fields that exist.

## Project detail system

Implement the shared detail architecture in `05-work-and-project-pages.md`. Full case studies support:

1. project identity
2. context
3. system map
4. challenge
5. decisions and trade-offs
6. real product walkthrough
7. engineering focus
8. exact contribution boundaries
9. verified outcome
10. reflection
11. related work

Shorter projects must not receive empty or padded sections. Build flexible content primitives that collapse cleanly.

Generated case-study artwork is conceptual. Caption it as illustration where needed. Never present it as a product screenshot, architecture proof, measured output, or client-owned design.

## About

Merge and improve the useful content currently split across Experience and Skills. Use the verified profile, work history, education, contributions, project relationships, and skill evidence from `config/` and `lib/`.

Required About scenes:

1. personal opening
2. career path
3. how I work
4. work across platforms
5. experiments and curiosity
6. résumé and contact actions

Keep skill claims linked to real projects. Do not restore rating stars or unverified proficiency percentages.

## Lab and Notes

Build route foundations and polished empty states even if the initial content set is small. Do not fabricate experiments or articles.

Lab can be expressive and interactive. Notes must be calm and readable. Notes need a 720 to 760px reading column, accessible code blocks, real diagrams, article metadata, related work, and an optional table of contents for long articles.

If the repository lacks real initial Lab or Notes content, implement the data model, route shell, and private/development fixtures only. Do not expose invented public entries. Clearly report the owner content needed to publish them.

## Contact and résumé

Preserve the working contact endpoint and its anti-bot behavior. The redesigned form requires:

- visible labels
- name, email, message, and optional intent
- inline validation
- pending, success, and recoverable error states
- preserved input after errors
- direct email and social alternatives
- keyboard and screen-reader usability

Use the contact-clearing artwork only when form contrast remains accessible.

Build or preserve a print-friendly, accessible résumé workflow using verified profile data. Do not generate résumé claims from project inference.

## Navigation and global interaction

Implement the documented morphing navigation:

- integrated, spacious top state
- compact floating state after roughly 96px
- slightly reduced presence while scrolling down
- restored compact presence while scrolling up
- active route indicator using line or text treatment, not decorative dots
- mobile menu expanding from the same object
- always available, never fully hidden

Implement `Cmd/Ctrl + K` search when the core route system is stable. It should search pages, projects, technologies, and safe actions.

Use page transitions sparingly. Do not add a long loader on ordinary navigation.

## Motion rules

Motion intensity is 7/10, but the experience is quiet until interaction matters.

Use Motion values, CSS scroll-driven animation, Intersection Observer, or well-contained Canvas state. Do not use React state for continuous scroll or pointer positions. Do not attach uncontrolled global scroll listeners.

Every animation must serve one of:

- hierarchy
- state feedback
- relationship
- narrative explanation
- spatial continuity

Implement `prefers-reduced-motion` for every nontrivial animation. In reduced motion, final content must be visible immediately. With JavaScript disabled, core content and navigation must remain readable and available.

## Generated assets

The source assets are under:

`docs/portfolio-vision/assets/generated/`

Exact files:

- `docs/portfolio-vision/assets/generated/living-systems-atlas.png`: Home hero static fallback and visual reference
- `docs/portfolio-vision/assets/generated/technical-field-texture.png`: low-opacity field texture reference
- `docs/portfolio-vision/assets/generated/operations-system-artwork.png`: operations case-study supporting illustration
- `docs/portfolio-vision/assets/generated/hospitality-system-artwork.png`: hotel case-study supporting illustration
- `docs/portfolio-vision/assets/generated/kendara-contextual-artwork.png`: Kendara supporting illustration
- `docs/portfolio-vision/assets/generated/lab-poster.png`: Lab poster/fallback
- `docs/portfolio-vision/assets/generated/contact-clearing.png`: Contact atmosphere
- `docs/portfolio-vision/assets/generated/disconnected-node-404.png`: transparent 404 illustration

Before use, read `12-generated-asset-catalog.md` for each file's limitations.

Do not reference files from `docs/` at runtime. Preserve the source files, create optimized runtime derivatives under a sensible `public/` hierarchy, and use Next.js Image where appropriate. Produce responsive AVIF/WebP variants when beneficial. Do not upscale beyond source dimensions.

The following require real owner input or deterministic production and must not be replaced with fabricated AI evidence:

- portrait and workspace photography
- project screenshots
- client and company logos
- final KD vector identity
- accurate architecture diagrams
- résumé content/PDF
- real Lab output

Existing real assets already live under `public/experience/`, `public/companies/`, `public/Avatar.png`, and `docs/logo-concepts/`. Audit them before requesting replacements.

## Data integrity

Treat these as facts, not suggestions:

- `config/experience.ts` is the primary project source.
- `config/profile.ts` contains owner-approved identity and positioning.
- `config/work-history.ts` contains verified roles and dates.
- `config/skills.ts` plus `lib/skills.ts` connect skills to proof.
- `config/educations.ts` and `config/contributions.ts` contain existing verified entries.
- `config/services.ts`, `config/socials.ts`, `config/site.ts`, `config/now.ts`, and `config/testimonials.ts` must be respected.
- Computed statistics must remain computed.
- Unknown facts render nothing or remain unpublished.
- Team projects must distinguish Kalana's contribution from the team's work.
- Remove personal client data from screenshots.

Extend the project model carefully with optional presentation, taxonomy, narrative, asset, and relationship fields. Do not create a second conflicting project database.

## Existing behavior that must survive or be intentionally migrated

- canonical URLs and metadata
- Person and WebSite structured data
- sitemap and robots output
- redirects from old URLs
- contact validation and bot handling
- theme switching where retained by the new art direction
- skip link and visible focus
- no-JavaScript content visibility
- reduced-motion completeness
- accurate computed statistics
- GitHub profile banner delivery
- social links
- responsive layout without horizontal overflow

## Test strategy

The current test suite contains assumptions tied to the old design, including the accent picker, three accent variants, hero code window, selected-work deck, output beam, current section IDs, and current services interaction. Do not preserve obsolete UI merely to keep those tests green.

Classify every test:

1. invariant to preserve
2. behavior to migrate
3. obsolete visual assumption to replace

Preserve and strengthen invariant tests for data truth, routes, redirects, metadata, contact behavior, accessibility, no-JavaScript visibility, and reduced motion. Replace obsolete visual tests with tests for:

- Emerald brand lock
- morphing navigation states
- SceneSection continuity primitives
- Home scene order
- Work search and filters
- project presentation-level rendering
- old route redirects
- asset fallbacks
- keyboard navigation
- Lab/Notes empty states when applicable
- form state behavior
- mobile overflow

Do not write superficial tests that mirror implementation details.

## Engineering constraints

- Keep Server Components as the default.
- Isolate Motion, pointer, scroll, and Canvas behavior in small client components.
- Verify every third-party dependency in `package.json` before import.
- Prefer existing dependencies. Add a dependency only when it materially improves the required experience and cannot be implemented cleanly with the existing stack.
- Use one icon family consistently in new UI. When migrating old icons, avoid introducing a third family.
- Use `next/font` or self-hosted fonts.
- Use `min-h-[100dvh]`, not `h-screen`, for full-height scenes.
- Prevent layout shift by reserving asset dimensions.
- Maintain semantic headings and landmarks.
- Keep public copy concise and human.
- Avoid generic portfolio clichés, decorative section numbers, fake metrics, meaningless marquees, and constant glowing animation.

## Execution sequence

Work in reviewable phases, but continue until the complete authorized scope is implemented:

### Phase 1: audit and foundation

- document current content and component reuse decisions
- define final route migration map
- lock green tokens
- remove public accent switching
- build SceneSection and atmosphere primitives
- implement morphing navigation shell
- establish runtime asset folders and optimize approved generated assets

### Phase 2: core pages

- Home
- Work explorer
- project detail presentation levels
- About
- Contact
- résumé behavior
- redirects, metadata, sitemap, and structured data

### Phase 3: signature experience

- interactive or progressively enhanced Living Systems Atlas
- command palette
- cross-project relationships
- page transitions
- Lab and Notes foundations
- 404 experience

### Phase 4: verification and polish

- responsive refinement at 390, 768, 1440, and 1920 widths
- keyboard and screen-reader review
- reduced-motion and no-JavaScript review
- asset optimization
- privacy/content audit
- Playwright updates
- lint, typecheck, build, and test

## Commands and completion checks

Use the package manager declared by the repository.

Run at minimum:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

Also inspect the completed pages visually at 390, 768, 1440, and 1920 widths. Check both page theme treatments where applicable.

Completion means:

- all required routes are complete and connected
- all old public URLs resolve appropriately
- the Home page has seven or fewer connected scenes
- section transitions feel continuous rather than banded
- Emerald is the single brand accent
- every project remains discoverable without images
- project depth adapts to available verified content
- generated assets are labeled and used honestly
- real project evidence remains primary
- keyboard, reduced motion, no-JavaScript, responsive, and contact behavior work
- metadata, sitemap, structured data, and canonical URLs are correct
- lint, typecheck, build, and Playwright tests pass
- no unresolved placeholder appears in public UI
- any missing owner-controlled content is reported clearly with exact file/field requirements

At the end, provide a concise implementation report containing:

1. the final architecture and route changes
2. major component and data-model changes
3. assets used and where
4. accessibility and performance decisions
5. verification commands and results
6. remaining owner-input items, if any

Begin by reading the documentation and repository. Then implement the complete redesign.
```


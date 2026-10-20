# Claude Code Implementation Brief

## Objective

Redesign Kalana Didulanga's portfolio as an immersive, personal, green-centered digital environment called **The Living Systems Garden**. The implementation must make real software work and verified engineering decisions the main content. Creative motion and imagery support that evidence.

## Source-of-truth order

When instructions appear to conflict, use this order:

1. Repository facts and structured data in `config/` and `lib/`
2. This portfolio-vision documentation folder
3. Existing approved real screenshots, logos, and photography
4. Earlier documents in `docs/superpowers/`
5. Current visual implementation

The new portfolio-vision documents supersede earlier Apple-style and cinematic visual directions. Their truthful-data rules still apply.

## Required reading before development

Read every Markdown file in `docs/portfolio-vision/` before changing application code. Start with:

1. `README.md`
2. `01-creative-direction.md`
3. `02-design-system-and-continuity.md`
4. `03-global-experience-and-motion.md`
5. the page document for the route being implemented
6. `09-asset-manifest.md`
7. `12-generated-asset-catalog.md`
8. `11-content-data-and-roadmap.md`

## Non-negotiable decisions

- Emerald is the public brand identity. Do not ship Indigo or Ember accent choices.
- The experience uses one green family with neutral dark and light fields.
- Section changes use continuous shading, overlap, depth, texture, and object handoff. Do not alternate hard `bg-band` rectangles.
- Home has no more than seven major narrative scenes.
- All projects remain discoverable even without an image.
- Do not force every project into a long case-study template.
- Use full case study, project story, and project note levels.
- Generated artwork is conceptual and cannot be presented as a real screenshot.
- No facts, metrics, roles, outcomes, testimonials, or project contributions may be invented.
- Motion must have a reason and a reduced-motion equivalent.
- Keep the site usable without enhanced Canvas, WebGL, or smooth scrolling.

## Existing code to reconsider

Do not remove these blindly. Audit and migrate their useful behavior.

| Existing area | Required direction |
| --- | --- |
| `components/accent-picker.tsx` | Remove from public experience or retain only as an internal development tool |
| `components/section.tsx` | Replace hard band styling with the documented `SceneSection` model |
| `components/home/code-window.tsx` | Replace hero use with Living Systems Atlas |
| `components/home/deck.tsx` | Replace repeated selected-work cards with asymmetric Selected Systems composition |
| `components/home/what-i-do.tsx` | Convert to the evolving How I Think schematic |
| `components/site-header.tsx` | Implement top-state to compact-state morphing behavior |
| `app/(root)/page.tsx` | Recompose into the seven documented scenes |
| `/experience` and `/skills` | Merge into the new information architecture only after content parity and redirects exist |

## Runtime asset policy

- Generated sources live under `docs/portfolio-vision/assets/generated/`.
- Copy optimized runtime derivatives into `public/` during implementation.
- Do not delete or overwrite the source files.
- Real screenshots outrank generated supporting artwork.
- Accurate diagrams should be SVG or Canvas built from verified project information.
- The hero Atlas should eventually become an interactive SVG or Canvas composition. Use the generated PNG as the static fallback and visual reference.

## Recommended implementation sequence

1. Audit current routes, content, tests, and reusable components.
2. Lock Living Emerald tokens and page-theme behavior.
3. Build `SceneSection`, atmospheric backgrounds, and transition primitives.
4. Build morphing navigation and mobile menu.
5. Implement Home static composition with the Atlas PNG fallback.
6. Implement Work search, filters, and text-first index.
7. Implement project presentation levels and one complete flagship case study.
8. Implement About and Contact.
9. Add interactive Atlas, command palette, and page transitions.
10. Implement Lab and Notes after their real initial content is ready.
11. Optimize assets and complete accessibility, reduced-motion, responsive, and performance testing.

## Content blockers that require Kalana

Do not guess these. Use placeholders that are clearly marked in development notes, not public UI:

- selected full case studies
- exact contribution boundaries for team projects
- approved screenshots and client-data redaction
- verified outcomes
- portrait and workspace photography
- initial Lab experiments
- initial Notes topics
- résumé content
- public availability statement

## Verification required per completed route

- desktop at 1440px and 1920px
- tablet at 768px
- mobile at 390px
- light and dark page treatments where documented
- keyboard navigation
- reduced motion
- JavaScript-disabled readable fallback for core content
- no horizontal overflow
- readable overlay contrast
- no invented content
- no generated artwork presented as product proof

## Completion definition

The redesign is complete when the acceptance criteria in `11-content-data-and-roadmap.md` pass, the asset rules are satisfied, all old public URLs resolve correctly, and the final experience feels like one continuous authored environment rather than a set of portfolio components.


# Cinematic redesign: design

**Date:** 2026-10-11
**Status:** approved by the owner from a working prototype
(`docs/superpowers/prototypes/2026-10-11-cinematic-prototype.html`; its
screenshots point at a scratch folder, so they show as broken images).
**Supersedes:** the visual system in `2026-10-10-apple-style-redesign-design.md`.
Its content model, routes, redirects and binding rules stay.

## Why

The owner found the Apple-style pass flat. He asked for an aesthetic,
cinematic site with smooth animation, sections that arrive one by one as
the page scrolls, a clear software-engineer identity, beautiful light and
dark themes with an animated switch, and few colours. References: Pilea
Agency, nextjs.org, vite.dev, authjs.dev, prisma.io, clickup.com.

## Binding rules (unchanged)

Nothing invented; no personal names of client contacts; no em dashes;
`prefers-reduced-motion` gives a still page with everything visible; with
JavaScript off every section is visible.

## Visual system

- **Neutrals:** zinc. Dark `#09090b` page, `#0e0e11` alternate band,
  `#121215` surfaces, `#fafafa` text, `#a1a1aa` secondary, `#6b6b74` tertiary,
  hairlines `rgba(255,255,255,.07/.13)`. Light `#fafaf9` page, `#f4f4f2`
  band, `#ffffff` surfaces, `#0a0a0b` text, `#52525b`, `#8a8a93`, hairlines
  `rgba(10,10,11,.08/.14)`.
- **One accent, chosen by the visitor:** Indigo (default; `#8b7cf6` dark,
  `#6d5de8` light), Emerald (`#34d399` / `#059669`), Ember (`#ff8a4c` /
  `#e8590c`). Set as `data-accent` on `<html>` before first paint, remembered
  in `localStorage`. Used for glows, the italic headline word, links, dots
  and focus.
- **Type:** Geist for text and headings (600, tight negative tracking),
  Geist Mono for labels, dates and code, Instrument Serif italic for one
  phrase per headline.
- **Texture:** a faint animated film grain over the page; a masked line
  grid and a radial accent glow behind the hero; a dashed frame around it.
- **Surfaces:** 16 to 24px radii, hairline borders, soft deep shadows; glass
  (`backdrop-filter`) for the nav and floating cards.

## Motion

- **Libraries:** `motion` (Motion for React) for reveals and scroll-linked
  effects, `lenis` for smooth scrolling. Both off under reduced motion.
- Headline words rise out of a blur one after another; every section block
  fades up out of a blur as it enters.
- Hero: a `kalana.ts` window types a truthful object about Kalana; four
  glass stat cards (projects, clients, years, technologies) drift at
  different depths while scrolling and count up.
- A marquee of real stack names under the hero.
- Selected work: sticky cards that stack like a deck; each earlier card
  scales to 0.94 and dims as the next slides over it.
- "What I do" bento with a pointer spotlight and small monochrome
  illustrations (dashboard bars grow, a phone notification drops in).
- Experience as `git log`: a rail that draws as you read down.
- Magnetic primary buttons; arrows nudge on hover.
- Theme switch: one toggle; the new theme opens as a circle from the toggle
  through the View Transitions API, instant where unsupported.

## Pages

Same routes as before. Home order: `hero`, `selected-work`, `what-i-do`,
`clients`, `work`, `testimonials` (only with data), `experience`, `skills`,
`contact`. Work, project detail, Experience, Skills and Contact take the same
system: mono eyebrow, large tight title with a serif phrase, glass and
hairline surfaces, reveal on scroll.

## Testing

Existing guards stay. The stats strip keeps `data-testid="stats-strip"`
and renders its final numbers in the HTML, so tests and no-JS readers see
real values. New: the accent choice persists across a reload; the theme
toggle flips the theme; JavaScript off still shows every section.

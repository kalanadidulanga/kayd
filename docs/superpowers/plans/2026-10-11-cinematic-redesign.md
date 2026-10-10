# Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the kayd UI to the approved cinematic prototype, with a visitor-chosen accent and an animated theme switch.

**Architecture:** Tokens become direct colour values in `app/globals.css` with `data-accent` variants. Motion and Lenis live in small client components (`components/motion/*`); pages stay server components that compose them.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, motion, lenis, next-themes, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-11-cinematic-redesign-design.md`

## Global Constraints

- Nothing invented; no personal names of client contacts; no em dashes.
- Reduced motion: no movement, everything visible. JavaScript off: every section visible.
- New dependencies allowed: `motion`, `lenis` only.

## Review Focus

- Theme switch on a browser without View Transitions: must still switch.
- Accent stored as garbage in localStorage: must fall back to Indigo.
- Counters: the HTML must carry the real number before any animation.
- Sticky deck on phones: cards must not overlap unreadably.
- Lenis with in-page anchors and the skip link: must still land correctly.

---

### Task 1: Tokens, fonts, accent and theme switch
Files: `app/globals.css`, `app/layout.tsx`, `components/accent-picker.tsx`, `components/theme-toggle.tsx`, `components/mode-toggle.tsx` (delete), `tests/theme.spec.ts`.
- [ ] Test first: toggle flips `html.dark`; accent persists across reload; a bad stored accent falls back to `indigo`.
- [ ] Direct colour tokens, `data-accent` variants, grain, grid, glow utilities; Geist, Geist Mono, Instrument Serif via `next/font`.
- [ ] Pre-paint inline script sets `data-accent`; picker writes it; toggle uses View Transitions with a fallback.

### Task 2: Motion primitives
Files: `components/motion/smooth-scroll.tsx`, `reveal.tsx` (rewrite on motion), `words.tsx`, `count-up.tsx`, `magnetic.tsx`, `spotlight.tsx`.
- [ ] All honour reduced motion; Reveal keeps `data-reveal` for the noscript rule (extended to `filter` and `translate`).

### Task 3: Shell
Files: `components/site-header.tsx` (floating glass pill), `components/site-footer.tsx`, `app/(root)/layout.tsx`.

### Task 4: Home
Files: `app/(root)/page.tsx`, `components/home/*` (hero, code window, marquee, deck, bento, git log, contact), `tests/home.spec.ts`.
- [ ] Section ids and order per spec; `stats-strip` carries final numbers in HTML.

### Task 5: Inner pages
Files: work list and detail, experience, skills, contact pages and their components.

### Task 6: Verify
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` on a production build.
- [ ] Screenshots light and dark at 1440 and 390; reduced-motion pass.

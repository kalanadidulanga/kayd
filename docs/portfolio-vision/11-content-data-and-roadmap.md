# Content, Data, and Implementation Roadmap

## Current implementation findings

- The repository already uses Next.js, TypeScript, Tailwind CSS v4, Motion, Lenis, next-themes, and structured configuration.
- Emerald is already the first-load accent, but Indigo and Ember remain visitor choices.
- The current homepage contains a code-window hero, selected case-study deck, capabilities, client logos, work index, experience, skills, services, and contact.
- `Section` uses bordered alternate bands, which conflicts with the desired continuous scene flow.
- The repository already contains motion primitives, project data, work history, skills, services, images, and multiple earlier redesign specifications.

## Content model changes

Extend each project with verified fields as content becomes available:

```ts
type ProjectPresentation = "case-study" | "story" | "note";

type ProjectAsset = {
  kind: "cover" | "screenshot" | "diagram" | "detail" | "artwork";
  src: string;
  alt: string;
  generated?: boolean;
  caption?: string;
};

type ProjectNarrative = {
  context?: string;
  challenge?: string;
  decisions?: { title: string; reason: string; tradeoff?: string }[];
  contribution?: string;
  outcome?: string;
  reflection?: string;
};
```

Add searchable taxonomy for platform, ownership, domain, year, technology, and presentation depth. Keep one source of truth for Home, Work, project pages, Notes relationships, Lab relationships, sitemap, and command search.

## Page routes

### Required

- `/`
- `/work`
- `/work/[id]`
- `/about`
- `/lab`
- `/notes`
- `/notes/[slug]`
- `/contact`
- `/resume`

### Optional

- `/uses`
- `/now`

Redirect or merge the existing Experience and Skills routes only after their content is represented in About and Work. Preserve old URLs with permanent redirects.

## Implementation phases

### Phase 1: foundation

- approve this documentation
- lock the Living Emerald tokens
- select final KD mark from existing concepts or refine one
- replace accent picker behavior
- build `SceneSection` and continuous shading primitives
- build morphing navigation
- define asset folders and metadata

### Phase 2: core portfolio

- build new Home structure
- build searchable Work explorer
- migrate every project to a presentation level
- create full case studies for the strongest documented projects
- build About and Contact
- produce P0 brand, portrait, and project assets

### Phase 3: creative layer

- implement Living Systems Atlas
- build command palette
- add page transitions
- build Lab and first working experiments
- add meaningful cross-project relationships
- produce P1 diagrams and generated supporting artwork

### Phase 4: publishing and polish

- build Notes and initial articles
- generate social images
- finish résumé PDF
- complete accessibility, responsive, and reduced-motion review
- measure Core Web Vitals
- perform content and privacy audit
- run visual regression checks at 390, 768, 1440, and 1920 widths

## Content collection checklist

- confirm which projects receive full case studies
- collect exact role and contribution for each team project
- verify project status and dates
- collect approved screenshots and remove sensitive data
- document three to five important decisions per flagship project
- collect verified outcomes without inventing metrics
- schedule portrait and workspace photography
- identify initial Lab experiments
- identify three initial Notes topics
- confirm résumé content and public contact links

## Build acceptance criteria

- Home contains no more than seven major narrative scenes.
- Section boundaries feel continuous at desktop and mobile sizes.
- Emerald is the single brand accent throughout the public experience.
- Every project is discoverable without needing an image.
- Every flagship case study states Kalana's contribution clearly.
- No generated image is presented as a real product screen or portrait.
- All motion has a reduced-motion equivalent.
- Navigation, Work filters, Lab previews, and forms work with keyboard input.
- LCP target is below 2.5 seconds, INP below 200ms, and CLS below 0.1 at the 75th percentile when real-user data is available.
- The site remains coherent when Canvas, WebGL, smooth scrolling, and JavaScript-enhanced reveals are unavailable.

## Immediate next design deliverables

1. Home desktop and mobile wireframes using the seven-scene structure.
2. Work index desktop and mobile wireframes.
3. One full project case-study wireframe.
4. Final token sheet and SceneSection transition examples.
5. Living Systems Atlas visual exploration.
6. Portrait and workspace photography brief.


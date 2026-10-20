# Global Experience and Motion

## Morphing navigation

### At the top

The navigation sits inside the hero composition, nearly transparent. It shows the KD mark, Work, About, Lab, Notes, and Contact. The contact action is text with a fine directional cue, not a large button.

### After scrolling

At approximately 96px it becomes a compact floating glass rail. The KD wordmark reduces to the monogram. Navigation labels tighten. The active page is shown with a short green line or filled text, not a decorative dot.

### Scroll behavior

- A downward scroll slightly reduces height and opacity.
- An upward scroll restores the full compact state.
- It never disappears completely.
- Opening the mobile menu expands the same object into a full navigation sheet.
- The transformation takes 450 to 650ms with a smooth spring or cinematic cubic easing.

## Command palette

`Cmd/Ctrl + K` opens search across pages, projects, technologies, and actions. It should feel like a personal index rather than an app dashboard.

Commands include:

- open a project
- filter Work by platform or technology
- visit Lab or Notes
- copy email
- toggle theme
- open résumé

## Motion language

### Tier 1: interface feedback

- links receive a 2 to 4px directional shift
- buttons compress to 0.98 on press
- filters morph selection backgrounds
- navigation changes state
- form inputs respond with border light and short helper transitions

### Tier 2: narrative motion

- heading lines rise 20 to 28px with a mild blur
- project rows reveal previews through crop movement
- connecting paths draw only when their content enters
- images use 3 to 6 percent parallax maximum
- section light fields drift slowly with scroll progress

### Tier 3: signature interactions

- Living Systems Atlas reacts to pointer or touch proximity
- Work relationships can illuminate shared technology paths
- Lab experiments can use physics, canvas, or drag behavior
- a project case study can animate one architecture decision when it improves understanding

## Timing

| Action | Duration |
| --- | ---: |
| Hover feedback | 160 to 240ms |
| Control state change | 240 to 360ms |
| Content reveal | 650 to 900ms |
| Navigation morph | 450 to 650ms |
| Page transition | 550 to 800ms |
| Ambient loop | 10 to 24s |

Ambient loops must be nearly imperceptible and stop under reduced motion.

## Page transitions

Use a short KD transition that feels like the current scene is being mapped into the next one. A green line travels across part of the viewport, the destination title appears, and the new page resolves beneath it. Do not cover every navigation with a long loader.

## Cursor and pointer details

- Keep the native cursor for accessibility and familiarity.
- Interactive artwork can show a soft 80 to 140px local light field.
- Project rows may display a preview near the pointer on capable desktop devices.
- Disable pointer-following effects for touch and reduced motion.

## Sound

No automatic sound. Lab experiments may offer an explicit muted sound toggle if sound is core to the experiment.

## Accessibility and performance

- `prefers-reduced-motion` shows final states immediately and removes parallax, ambient drift, and pointer physics.
- Do not attach React state to continuous pointer or scroll values. Use Motion values, CSS scroll timelines, or requestAnimationFrame-backed canvas logic.
- Decorative canvas and video cannot block navigation or Largest Contentful Paint.
- All visual relationships need a text equivalent.
- Maintain visible keyboard focus using the brand green.
- Keep contrast at WCAG AA or better.


# Design System and Section Continuity

## Color system: Living Emerald

The palette uses one green family, not multiple unrelated accent choices.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| Canvas | `#07100D` | `#F4F8F5` | Main page field |
| Deep field | `#0A1712` | `#EAF2ED` | Depth shift and large surfaces |
| Surface | `#0F2119` | `#FFFFFF` | Elevated functional UI only |
| Ink | `#ECF7F0` | `#102018` | Primary text |
| Muted | `#A0B6A8` | `#50675A` | Supporting text |
| Hairline | `rgba(189,232,205,.13)` | `rgba(16,64,39,.13)` | Dividers and controls |
| Brand | `#67E39B` | `#087A46` | Actions, active states, focus |
| Brand bright | `#A3F6C1` | `#0B9255` | Small highlights only |
| Brand soft | `rgba(103,227,155,.12)` | `rgba(8,122,70,.10)` | Hover and selected states |
| Fog | `rgba(126,214,159,.07)` | `rgba(40,128,76,.06)` | Section atmosphere |

Green should occupy less than roughly 15 percent of a typical viewport at high saturation. Most of the experience uses dark green-black, pale mineral green, neutral text, and transparent green light.

## Theme strategy

- Home, Lab, and Contact default to the dark theme.
- Work, Notes, and long project reading surfaces may use the light theme.
- A page does not flip theme halfway through a normal scroll.
- Navigation adapts to the active page theme.
- User theme preference can still exist, but the art direction determines the page's default composition.
- Remove the Indigo and Ember accent choices from the final brand experience. If an accent picker remains during prototyping, it is a development tool only.

## Typography

- Display and UI: Geist or a similarly precise grotesk already present in the project.
- Technical metadata: Geist Mono.
- Personal emphasis: italic weight of the same display family. Avoid inserting a decorative serif into every heading.
- Hero size: `clamp(3.4rem, 8vw, 8.5rem)` with two lines maximum.
- Section title: `clamp(2.2rem, 5vw, 5rem)`.
- Body: 17 to 19px, 1.55 to 1.7 line height, 65ch maximum.
- Long notes: 18px minimum and 720 to 760px reading width.

## Shape and material

- Primary radius scale: 16px surfaces, 999px compact controls, 8px media details.
- Cards are used only for interactive objects or meaningful grouping.
- Prefer open layouts, lines, anchored labels, and negative space for static content.
- Glass is reserved for the morphing navigation, command palette, and one or two floating controls.
- Shadows use a green-black tint and very large soft falloff.
- Texture is fine grain plus a low-contrast topographic or field pattern. It must never reduce text clarity.

## Continuous section system

The current `band` approach creates visible stripes. Replace it with a `SceneSection` model that supports continuous transitions.

Each section declares:

- `tone`: canvas, deep, mist, or clear
- `lightOrigin`: an x/y position for a large radial light field
- `texture`: none, grain, grid, contour, or particles
- `edge`: open, fog, overlap, or line
- `depth`: foreground, middle, or background

### Approved transition methods

1. **Light drift:** a radial green fog moves from one side of the page to the other across the boundary.
2. **Soft overlap:** the next composition begins 8 to 16vh before the previous content visually ends.
3. **Texture migration:** grid lines slowly become contours, or contours dissolve into grain.
4. **Depth change:** foreground elements reduce contrast while the next section sharpens.
5. **Object handoff:** one line, node, image crop, or label continues into the next section.
6. **Ambient shading:** use a 20 to 35vh gradient bridge instead of an abrupt background color change.

### Boundary rules

- No alternating full-width rectangles for every section.
- No border on both the top and bottom of every section.
- No large rounded container around a complete section.
- Use one clear visual pause after every two or three sections, not after each one.
- Headings can enter before the previous atmosphere fully disappears.
- Mobile uses simpler vertical shading and removes decorative overlaps that could cause clipping.

## Grid and spacing

- Maximum content width: 1400px.
- Main grid: 12 columns desktop, 6 tablet, 4 mobile.
- Side padding: 20px mobile, 32px tablet, 48 to 72px desktop.
- Section breathing room: 112 to 184px desktop, 80 to 120px mobile.
- Asymmetry is encouraged, but primary reading edges should repeat across the page.
- Avoid three equal feature cards as the default section layout.


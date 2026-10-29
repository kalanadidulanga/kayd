# Runtime derivatives of the generated assets

The sources in [`generated/`](./generated/) were made on 2026-10-20 with the built-in OpenAI image-generation workflow, from the prompts in [10-ai-asset-generation-prompts.md](../10-ai-asset-generation-prompts.md). No seed was recorded. The site never reads `docs/` at runtime; it serves the copies below, made on 2026-10-20 with sharp (resize without enlargement, WebP or JPEG re-encode, no other edits). Next.js Image adds AVIF and responsive sizes on request.

| Runtime file | Source | Size | Used on | Shown as |
| --- | --- | --- | --- | --- |
| `public/visuals/atlas/living-systems-atlas.webp` | `living-systems-atlas.png` | 1586 x 992, WebP q74 | Home hero, under the six domain nodes | Decorative base of the Atlas; every node is real, linked text |
| `public/visuals/atlas/living-systems-atlas-og.jpg` | `living-systems-atlas.png` | 1008 x 630, JPEG q72 | `/opengraph-image` share card | Background art |
| `public/visuals/textures/technical-field.webp` | `technical-field-texture.png` | 1254 x 1254, WebP q62 | Scene texture "field" (project headers) | Low-opacity texture |
| `public/work/operations-crm-platform/system-illustration.webp` | `operations-system-artwork.png` | 1586 x 992, WebP q74 | Uniguru Operations Platform case study | Captioned "Illustration, not a screenshot of the product." |
| `public/work/hotel-management-system/system-illustration.webp` | `hospitality-system-artwork.png` | 1586 x 992, WebP q74 | Hotel Management System case study | Captioned "Illustration, not a screenshot of the product." |
| `public/lab/lab-poster.webp` | `lab-poster.png` | 1448 x 1086, WebP q72 | Lab opening and Home lab signal, under the live cursor field | Poster behind a real experiment, no text on it |
| `public/visuals/contact-clearing.webp` | `contact-clearing.png` | 1122 x 1402, WebP q70 | Contact page, behind a dark veil | Atmosphere; form contrast is tested |
| `public/visuals/disconnected-node.webp` | `disconnected-node-404.png` | 768 x 512, WebP with alpha | 404 page | Small illustration |
| `public/visuals/domains/<domain>.webp` (six) | `domain-<domain>.png` | 640 x 640, WebP q74 | Work: domain plates and each project row | Specimen art for the domain, no text on it |
| `public/work/field.webp` | `work-field.png` | 2000 x 917, WebP q70 | Work page header, right side | Atmosphere behind the title |
| `public/visuals/system/hero-loop.webm`, `.mp4` | `Hero_loop_video_settings_b3e0673a_1080p.mp4` (Veo) | 1600 x 900, no audio, 435 KB / 690 KB | Home hero on wide screens only | Gemini mark removed with ffmpeg delogo |
| `public/visuals/system/hero-poster.webp`, `hero-og.jpg` | first frame of the hero loop | 1600 x 900 WebP q72, 1200 JPEG | Hero image (LCP), share card | |
| `public/visuals/system/descent.mp4` | `Camera_moving_through_system_module_bdb43305_1080p.mp4` (Veo) | 1280 x 720, keyframe every 6 frames for scrubbing, 2.5 MB | Scroll descent, wide screens, loads when near | Gemini mark removed |
| `public/visuals/system/stack.webp`, `lab-staging.webp`, `contact-console.webp`, `hero-mobile.webp` | `asg-*.png` | WebP q70 to 72 | Descent still, Lab, Contact | |
| `public/visuals/domains/<domain>.webp` | `asg-module-<domain>.png` | 640 x 640 | Work domain plates and rows (replaces the plant specimens) | |

The domain plates and the Work field were generated on 2026-10-21 from the prompts given in the session that set up the Work page; their sources are listed in the catalog.

In the light theme, art drawn on dark green is shown through `--art-filter` (an inverted, hue-kept negative, multiplied into the page). The source files are unchanged.

Not used yet: `kendara-contextual-artwork.png`. The catalog asks for the owner to validate its cultural presentation first, and Kendara already has a real screenshot.

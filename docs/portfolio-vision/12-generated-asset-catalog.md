# Generated Asset Catalog

## Status

These eight PNG files were generated on 2026-10-20 using the built-in OpenAI image-generation workflow. They are art-direction assets and implementation candidates. They have not been connected to application code.

The original prompts are preserved in [AI asset generation prompts](./10-ai-asset-generation-prompts.md). Claude Code should use the files below as supplied, optimize copies for delivery, and preserve these originals inside the design documentation folder.

## Files

| Asset | File | Dimensions | Alpha | Intended use |
| --- | --- | ---: | --- | --- |
| Living Systems Atlas | [`living-systems-atlas.png`](./assets/generated/living-systems-atlas.png) | 1586 x 992 | No | Home hero art-direction base and static fallback |
| Technical field texture | [`technical-field-texture.png`](./assets/generated/technical-field-texture.png) | 1254 x 1254 | No | Low-opacity background texture and art-direction reference |
| Operations system | [`operations-system-artwork.png`](./assets/generated/operations-system-artwork.png) | 1586 x 992 | No | Uniguru or operations case-study supporting artwork |
| Hospitality system | [`hospitality-system-artwork.png`](./assets/generated/hospitality-system-artwork.png) | 1586 x 992 | No | Hotel Management System supporting artwork |
| Kendara context | [`kendara-contextual-artwork.png`](./assets/generated/kendara-contextual-artwork.png) | 1586 x 992 | No | Kendara supporting cover artwork |
| Lab poster | [`lab-poster.png`](./assets/generated/lab-poster.png) | 1448 x 1086 | No | Lab opening poster or experiment fallback |
| Contact clearing | [`contact-clearing.png`](./assets/generated/contact-clearing.png) | 1122 x 1402 | No | Contact page atmosphere behind the form |
| Disconnected node | [`disconnected-node-404.png`](./assets/generated/disconnected-node-404.png) | 1536 x 1024 | Yes | 404 illustration |

## Work domain specimen series

These seven files were generated on 2026-10-21 for the redesigned Work page. The six square plates share one mineral-organic specimen language, identical forest-black fields, mint rim lighting, centered scale, and reserved lower space.

| Asset | File | Dimensions | Intended use |
| --- | --- | ---: | --- |
| Operations specimen | [`domain-operations.png`](./assets/generated/domain-operations.png) | 1024 x 1024 | Operations domain plate and project-row glyph source |
| Hospitality specimen | [`domain-hospitality.png`](./assets/generated/domain-hospitality.png) | 1024 x 1024 | Hospitality domain plate and project-row glyph source |
| Education specimen | [`domain-education.png`](./assets/generated/domain-education.png) | 1024 x 1024 | Education domain plate and project-row glyph source |
| Commerce specimen | [`domain-commerce.png`](./assets/generated/domain-commerce.png) | 1024 x 1024 | Commerce domain plate and project-row glyph source |
| Tools specimen | [`domain-tools.png`](./assets/generated/domain-tools.png) | 1024 x 1024 | Tools domain plate and project-row glyph source |
| Experiments specimen | [`domain-experiments.png`](./assets/generated/domain-experiments.png) | 1024 x 1024 | Experiments domain plate and project-row glyph source |
| Work field | [`work-field.png`](./assets/generated/work-field.png) | 2400 x 1100 | Wide Work header background with left-side copy space |

The plates are conceptual category artwork. They should not be described as project screenshots. When small row glyphs are needed, derive them from these same files rather than introducing a second icon style. Preserve the source files here and create runtime derivatives under `public/` during implementation.

## Selection notes

### Living Systems Atlas

Strengths: strong left-side negative space, memorable connected green world, correct brand atmosphere.

Limitations: the rendered spheres are conceptual rather than explicit software domains. The production interactive Atlas should be rebuilt as SVG or Canvas using this image as an art-direction reference. Use this PNG as a static fallback, Open Graph base, or temporary hero asset.

### Technical field texture

Strengths: low contrast and aligned with the topographic system language.

Limitations: do not assume the raster edges tile perfectly. Use it as a large cover texture or derive a deterministic CSS/SVG texture for true seamless repetition.

### Operations system

Strengths: clear hierarchy and generous title space.

Limitations: it contains symbolic people, documents, security, and reporting. It must be captioned as conceptual artwork if shown near a case study. Never imply that it is a screenshot of the real product.

### Hospitality system

Strengths: immediately communicates connected hotel operations.

Limitations: it is more architectural and literal than the other assets. Use as a large chapter break or cover, not beside every screenshot.

### Kendara context

Strengths: Sri Lankan location context and computational chart geometry are clear.

Limitations: validate cultural presentation with Kalana before publication. It is an illustration, not an astrological chart output and not technical proof.

### Lab poster

Strengths: energetic creative-coding atmosphere while remaining green.

Limitations: visually dense. Use for a poster crop, full-bleed transition, or fallback frame. Do not place body text on top of it.

### Contact clearing

Strengths: quiet form area and strong convergence metaphor.

Limitations: test actual form contrast over the image. Apply a dark green overlay when needed.

### Disconnected node

Strengths: transparent alpha, compact concept, clear network metaphor.

Limitations: the rendered object is glossy. Keep it small so it remains a supporting moment rather than a new visual language.

## Delivery preparation

When implementation begins:

1. Copy selected images to the intended runtime asset folders.
2. Preserve the source PNGs here.
3. Export responsive AVIF and WebP derivatives.
4. Keep PNG for the transparent 404 asset if AVIF alpha support is not part of the target browser policy.
5. Define focal points before using automatic crops.
6. Add accurate alt text based on the final context.
7. Add captions where conceptual artwork appears near real project evidence.
8. Never upscale beyond the source dimensions.

## Assets still requiring owner input or deterministic production

The following were intentionally not generated:

- real portrait and mobile crop
- real workspace and process photography
- real project screenshots
- client and company logos
- final KD vector identity
- accurate project architecture diagrams
- résumé PDF
- real Lab experiment outputs

These assets depend on identity, truth, privacy, or technical accuracy. The specifications for them are in the page documents and [Asset Manifest](./09-asset-manifest.md).


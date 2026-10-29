# All Systems Green: asset handoff

Prepared 2026-10-29. Read README.md and prompts.json as the design brief. Application development is reserved for Claude Code at the user's request.

## Completed

All eleven still PNG assets are saved under `docs/portfolio-vision/assets/generated/` using the exact filenames in the brief: A1, A3, B1, B2, B3 and the six B4 domains. Generated using the built-in image_gen tool. A1 was the visual reference for the remaining assets. Existing assets and application code were not changed. No commit or deployment was made.

`asset-manifest.json` records measured native pixel dimensions and byte sizes. `generation-prompts.json` records the hero and module prompts; the original prompts.json supplies the expanded style and negative constraints for the other assets. Contact was refined to remove satellite geometry and leave the upper 65% quiet.

## Review and limitations

Visually inspected the generated outputs: consistent dark graphite/smoked glass with green illumination; no visible words, logos or people. Hero and mobile each show six satellite clusters plus one core. Stack shows five planes. Lab has experimental modules and title space. Contact has a single converging endpoint and a quiet upper field. Domain silhouettes differ as requested.

These are usable source candidates, with the following brief deviations to review during integration:

- Hero and stack native output is 1672 x 941, below the requested 1920 x 1080 hero minimum and only approximately 16:9. Mobile/contact are 1122 x 1402, approximately 4:5. Lab is 1448 x 1086, exactly 4:3. Modules are 1254 square. No artificial upscaling was performed. If strict 1080p source detail is mandatory, obtain a higher-resolution generation before final production approval.
- The hero's left satellites begin around x=42%, so the requested fully empty left 45% is not exact. Keep actual headline bounds around the left 38-40%, or revise the composition if the intended headline collides. The central left field is calm.
- Module subjects occupy roughly 55-80% of the width rather than the requested ~50%; education is widest. The lower quarter remains mostly clear. Backgrounds are dark green with subtle lighting variation, not pixel-uniform #07100D. Use contained images with deliberate margins; inspect blending against the real canvas.
- Contrast, crop behavior and label placement have not been tested in the application. Green is a visual metaphor, not proof of project status.

## Hero geometry for prototype labels

Approximate visually estimated centres, in percentages of the uncropped source image; these are unassigned positions, not domain mappings:

| Node | x | y |
| --- | --- | --- |
| Core | 68 | 46 |
| Upper satellite | 67 | 13 |
| Upper left | 48 | 29 |
| Upper right | 87 | 25 |
| Lower left | 49 | 61 |
| Right | 91 | 52 |
| Bottom | 72 | 75 |

Re-measure against the final served image. If object-fit: cover crops it, transform anchor coordinates with the same scale and offset; raw percentages of the container will drift. Mobile has its own geometry and needs a separate map, or omit labels there.

## Remaining video work

`asg-hero-loop.mp4` (A2, P0) and `asg-descent.mp4` (C1, optional P2) are not generated. See flow-prompts.md for ready-to-paste prompts and frame choices. Use the hero still as the functional fallback while video is pending. Never claim the missing videos passed loop/camera QA.

## Continue development

1. Build a prototype on a branch as specified in the original brief. Keep source PNGs; create optimized web derivatives separately and record their dimensions. Do not serve all full-size PNGs directly.
2. Review the hero crop/headline and module sizing limitations above before committing to layout. Preserve the dark negative space.
3. Integrate the stack, staging bench, contact endpoint and six service modules. Use actual configuration facts for Live/In production; do not invent telemetry or service health.
4. Respect reduced motion: static still and final state immediately. When video arrives, remove audio, prepare appropriate encodes/posters, and check actual loop continuity before enabling it.
5. Verify responsive crops, text contrast, keyboard access and performance in the running app. This handoff did not implement or test the application.

Suggested Claude prompt: Read docs/portfolio-vision/all-systems-green/README.md, prompts.json and CLAUDE-HANDOFF.md. The eleven still assets are ready in docs/portfolio-vision/assets/generated/. Review their documented limitations, then continue the All Systems Green prototype on a branch. A2 video is pending; use the hero still fallback. Preserve truth rules and reduced-motion behavior.

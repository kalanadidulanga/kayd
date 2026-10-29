# All Systems Green

**Status:** chosen concept, 2026-10-29. Supersedes the Living Systems Garden metaphor (spheres, roots, specimens). Keeps its tokens, truth rules and accessibility rules.

## The idea in one line

In software, green means it works: the passing check, the healthy service, the deploy that went out. Kalana builds systems that run real businesses, so the whole portfolio is one running system, and every scene is a layer of it, lit green because it is live.

## Why it fits

- Green is his favourite colour and the colour of his work's best moment.
- It reads instantly to all three audiences: a client sees "it runs", a recruiter sees "production", a developer sees the stack.
- It stays honest: status comes only from real facts (a live site link, GitHub data, "In production" where the config says so). No invented uptime, latency or request counts. Ever.

## Palette (unchanged tokens, new roles)

| Token | Dark | Role in this concept |
| --- | --- | --- |
| Canvas | `#07100D` | The night the system runs in |
| Field | `#0A1712` | Rack and panel surfaces |
| Surface | `#0F2119` | Glass modules, consoles |
| Ink | `#ECF7F0` | Text |
| Muted | `#A0B6A8` | Labels, metadata |
| Brand mint | `#67E39B` | Status green: live, passing, connected |
| Bright mint | `#A3F6C1` | Packets, the moment a check passes |

One rule: mint means "running". Use it for state, not decoration.

## The site as a stack

Scrolling the home page descends through the system, top to bottom.

| Scene | Layer | What it shows |
| --- | --- | --- |
| Hero | The whole system | Cinematic topology at night, packets flowing. Headline: "I build software for the real world." |
| GitHub | Commits | The year of commits as a field of green squares (exists) |
| How I think | Logic | Four decisions, written like passing checks |
| Range | Services | Web, mobile, Windows, commerce, leadership as services in one topology |
| Lab | Staging | Experiments shown as builds in staging |
| A note | Operator | Kalana, the person who runs it |
| Contact | New request | "Start a build": one form, one green check when it really sends |

Work pages: each project is a deployed service. Header shows a status line built from facts: "Live" with a link when `websiteLink` exists, "In production" when the config says so, nothing otherwise.

## Motion language

- Packets: small mint pulses travelling along fine fibre lines (the hero video, and SVG elsewhere).
- Checks: a grey ring that closes into a green tick when a section arrives (once, not looping).
- Boot: on first load, lines light from the centre outward in under a second, then the headline.
- Everything stops under reduced motion; final state shows at once.

## Assets to generate

Full prompts are in [`prompts.json`](./prompts.json). Save every file to `docs/portfolio-vision/assets/generated/` with the exact file name given. Claude makes the optimised web copies.

| ID | What | Tool | File name | Priority |
| --- | --- | --- | --- | --- |
| A1 | Hero keyframe still, 16:9 | ChatGPT (image) | `asg-hero-keyframe.png` | P0 |
| A2 | Hero loop video, 8 s, from A1 | Google Flow (Veo) | `asg-hero-loop.mp4` | P0 |
| A3 | Hero still for phones, 4:5 | ChatGPT (image), from A1 | `asg-hero-mobile.png` | P1 |
| B1 | The stack: layered glass planes | ChatGPT (image) | `asg-stack-layers.png` | P1 |
| B2 | Staging bench for the Lab | ChatGPT (image) | `asg-lab-staging.png` | P1 |
| B3 | Contact: the request console | ChatGPT (image) | `asg-contact-console.png` | P1 |
| B4 | Six service modules (replace the plant specimens) | ChatGPT (image) | `asg-module-<domain>.png` | P1 |
| C1 | Descent clip through the stack, 8 s | Google Flow (Veo) | `asg-descent.mp4` | P2 |

## Which tool for what

**Images: ChatGPT.** It follows long prompts closely, keeps a series consistent when you stay in one chat, and edits an image you upload ("same scene, 4:5"). Generate A1 first, then keep that chat open for A3, B1 to B4 so the style holds.

**Video: Google Flow with Veo.** Veo gives the most cinematic, controllable motion and Flow lets you set the first and last frame. Using A1 as both frames gives a seamless loop and keeps every module where it was, which the site needs to place its labels.

Do not use Sora for A2: it tends to move the camera and redraw the scene, which breaks alignment.

## Step by step

### 1. Hero keyframe (A1), ChatGPT

1. New chat. Paste the `A1` object from `prompts.json` (the whole JSON is fine; ChatGPT reads it).
2. Ask for 3 variations if the first is not right. Pick one where:
   - the left 45 percent is calm, dark and empty (the headline goes there);
   - there are clear, separate module clusters (the site will label six of them);
   - no text, logos, people, screens with words, or blue/purple/orange.
3. Download the full-size PNG. Save as `asg-hero-keyframe.png`.

### 2. Hero loop (A2), Google Flow

1. Open Flow (labs.google/flow), new project.
2. Mode: **Frames to Video**. Upload `asg-hero-keyframe.png` as the **first frame** and the **same image** as the **last frame**.
3. Model: **Veo 3.1 Quality** (or the highest Veo available). Aspect ratio **16:9**, 8 seconds.
4. Paste the `A2` prompt (the `prompt` text, or the whole JSON).
5. Generate 2 to 4 takes. Pick one where nothing but light moves: modules, cables and camera stay exactly in place, and the start and end match.
6. Download at **1080p** (use Flow's upscale if offered). Audio does not matter; it is removed. Save as `asg-hero-loop.mp4`.

### 3. The rest (A3, B1 to B4), same ChatGPT chat as A1

Paste each object in turn. For A3, upload `asg-hero-keyframe.png` with it. For B4, generate the six modules one per message so each comes out square and centred.

### 4. Optional descent clip (C1), Google Flow

Frames to Video with `asg-hero-keyframe.png` as first frame and `asg-stack-layers.png` as last frame, prompt `C1`. This becomes the scroll transition from the hero into the stack.

### 5. Hand-off

Put the files in `docs/portfolio-vision/assets/generated/` and tell Claude. Claude checks each against the rules below, makes WebM/MP4 and WebP copies with posters, measures the module positions for the labels, and builds a prototype on a branch first.

## Review checklist (reject and regenerate if any fails)

- One green family only: no blue, cyan, purple, orange or red light.
- No text, letters, numbers, logos, UI screens or people.
- Calm negative space where the copy goes.
- Reads as software infrastructure, not a sci-fi city or a server farm photo.
- Video: camera locked, objects fixed, start and end frames match, no flashes.

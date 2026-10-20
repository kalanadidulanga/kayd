# Asset Manifest

## Priority definitions

- P0: required for the first complete release
- P1: required for the intended rich experience
- P2: optional enhancement

## Global assets

| Asset | Format | Priority | Notes |
| --- | --- | --- | --- |
| KD monogram | SVG | P0 | Works at 16px and in one color |
| KD wordmark | SVG | P0 | Horizontal and compact variants |
| Favicon set | SVG, PNG | P0 | 16, 32, 48, 180, 512 |
| Living Systems Atlas | SVG or Canvas | P0 | Master signature asset |
| Domain glyph set | SVG | P0 | Web, mobile, desktop, operations, commerce, experiments |
| Field textures | WebP, CSS, SVG | P0 | Grain, contour, grid, particles |
| Social template | code or PNG | P0 | 1200 x 630 |
| Loading fallback | SVG | P1 | Atlas still frame, not a spinner |
| Page-transition mark | SVG | P1 | Short line and KD motif |

## Home assets

| Section | Asset | Priority |
| --- | --- | --- |
| Hero | Atlas scene and six domain states | P0 |
| Selected systems | approved covers or meaningful crops for flagship work | P0 |
| How I think | evolving technical-field diagram | P0 |
| Range | discipline glyphs and relationship dataset | P0 |
| Lab signal | one working preview and two poster frames | P1 |
| Personal note | portrait and workspace photograph | P0 |
| Closing | converging path composition | P1 |

## Work assets

| Asset | Priority | Quantity |
| --- | --- | ---: |
| Project metadata audit | P0 | every project |
| Category glyph | P0 | 6 to 8 |
| Approved cover | P1 | where available |
| Abstract project artwork | P2 | only when useful |
| Full case-study diagram | P1 | 1 per full case study |
| Project social image | P1 | every public detail page |

## About assets

| Asset | Priority | Specification |
| --- | --- | --- |
| Primary portrait | P0 | 1600 x 2000 source, AVIF/WebP exports |
| Mobile portrait crop | P0 | 4:5 |
| Workspace wide image | P1 | 1600 x 1100 |
| Hands or process detail | P1 | 4:3 |
| Notebook or sketch | P1 | real and legible where shown |
| Company marks | P1 | verified use only |

## Lab and Notes assets

| Asset | Priority | Notes |
| --- | --- | --- |
| Experiment poster template | P1 | 4:3 and 1:1 |
| Canvas fallback stills | P1 | one per experiment |
| Pixel or particle sheet | P1 | transparent WebP or SVG |
| Article figure template | P1 | light and dark |
| Note social template | P1 | title plus diagram fragment |

## Contact and utility assets

| Asset | Priority |
| --- | --- |
| Contact field background | P1 |
| Form success path | P1 |
| Accessible résumé PDF template | P0 |
| 404 disconnected-node artwork | P2 |

## Asset naming

Use lowercase kebab-case and a predictable hierarchy:

```text
public/brand/
public/visuals/atlas/
public/visuals/textures/
public/portraits/
public/work/<project-id>/
public/lab/<experiment-id>/
public/notes/<article-slug>/
```

## Production rules

- Keep editable source files outside the public runtime folder when they are large.
- Export AVIF first, WebP fallback when needed, and responsive sizes.
- SVG diagrams need semantic titles or nearby text equivalents.
- Remove private names, credentials, client data, and personal user data from screenshots.
- Generated images are supporting artwork. They never substitute for proof of a real product.
- Record the prompt, model, seed when available, date, and editing notes beside every generated asset.


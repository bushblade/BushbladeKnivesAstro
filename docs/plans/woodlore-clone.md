# Plan: Rebuild the Woodlore Clone page

## Goal

Fill in the `woodlore-clone.astro` stub with the full page content from the original Gatsby site, matching the current Bushblade theme conventions. Text, images, and layout stay faithful to the original; only the styling is modernised.

## Branch

Create `feat/woodlore-clone-page` off `master`. All work happens there.

## New files

### 1. `src/components/Card.astro`

Generic card wrapper for specs/article content.

- Renders `<article class="border-t-4 border-olive rounded bg-off-white shadow-sm p-4">` with a `<slot />`.
- No props.
- Reusable later on the Midi page and (optionally) the 404 page.

### 2. `src/components/knives/WoodloreSVG.astro`

Inline `<svg>` of the full Woodlore knife outline.

- Copy path data from `src/images/woodlore-website.svg`.
- `viewBox="0 0 209.46542 29.52039"`, `class="w-full h-auto"`.
- Keep the element `id`s and `pathLength` attributes so future GSAP work can target paths.
- No animation logic.

### 3. `src/components/knives/WoodloreSpineSVG.astro`

Inline `<svg>` of the blade spine profile.

- Copy path data from `src/images/woodlore-spine.svg`.
- `viewBox="0 0 208.79437 23.714577"`, `class="w-full h-auto"`.
- No animation logic.

### 4. `src/components/knives/WoodloreSkeletonSVG.astro`

Inline `<svg>` of the skeletonised/tapered tang detail.

- Copy path data from `src/images/woodlore-skeleton.svg`.
- `viewBox="0 0 209.46542 29.52039"`, `class="w-full h-auto"`.
- No animation logic.

## Edited files

### `src/pages/knives/woodlore-clone.astro`

- **SEO**: add `description` and keywords to `<Layout>` (see SEO section below).
- **Banner**: keep `FadeImage` with `woodlore-clone-banner.jpg`, `layout="full-width"`, `loading="eager"`; improve alt to something meaningful (e.g. "Woodlore Clone knife banner").
- **PageTitle**: `pageTitle="Woodlore Clone"`, `tagline="The design that inspired it all"`.
- **Content** (inside `max-w-7xl mx-auto px-4`):
  - Two-column grid `grid grid-cols-1 md:grid-cols-2 gap-8 my-8`.
  - **Left column**: `WoodloreSVG` → `<div class="my-4">` wrapping `WoodloreSpineSVG` (replicates original 1rem gap) → `WoodloreSkeletonSVG`.
  - **Right column**: `<Card>` containing the original text verbatim:
    - `<p><strong>My version of the bushcraft classic.</strong> A great all round practical design and the knife that most inspired me to become a maker.</p>`
    - `<ul>` spec list:
      1. 222mm overall length with a blade length of 112mm
      2. 4mm thick O1 tool steel
      3. Hardened to ~ 59RC and double tempered
      4. Skeletonised and tapered tang for balance and weight reduction
      5. Prices start at £{`SITE.prices.woodloreClone`} — "contact me" as `InlineLink` to `/contact`
    - Closing paragraph: "Browse the gallery below or check out even more images in the [Google Photos] album." — Google Photos link kept as `InlineLink` with `target="_blank"`.
  - **Gallery** below, `my-16`: `Gallery client:load` with `buildGalleryPhotos` over all 36 `src/images/woodlore-clone-images/img01.jpg`–`img36.jpg`, listed **descending** (img36 → img01) to match the original ordering. No alt text (filename fallback).
- Imports: `SITE` from `src/data/site`, `buildGalleryPhotos` from `src/utils/gallery`, new SVG components, `Card`, `InlineLink`.

### `astro.config.mjs`

- Add `redirects: { '/woodlore-clone': '/knives/woodlore-clone' }`.
- Static site → emits a `<meta http-equiv="refresh">` client redirect (standard Astro behaviour for `output: static` without an adapter). Keeps old bookmarks / the live URL working.

## SEO

- **Title**: "Woodlore Clone" (Layout appends `| Bushblade Knives`).
- **Description**: "The knife that started it all — my handmade take on the Woodlore bushcraft classic, in 4mm O1 tool steel with a tapered tang."
- **Keywords**: `['bushblade','knife','ray mears','alan wood','woodlore','bushcraft','handmade','carving']` (from the original).

## Verification

- `pnpm check` (Biome: format + lint + import organise).
- `astro check` (type check).
- `pnpm build` — confirms the 36-image gallery pipeline, SVG/Card compile, and redirect emission all work together.
- (Per AGENTS.md, no build after every change — dev server HMR is sufficient mid-work.)

## Testing seam

No test framework exists in the repo. The verification seam is the **build-integration** check: `astro check` + `pnpm build`. No new test infrastructure proposed for this static page.

## Out of scope

- SVG animation (deferred; components are structured to receive it later).
- The Midi page rebuild (same pattern, separate change).
- Content collections / data-driven knife pages (separate AGENTS.md todo).
- 404 page conversion to `Card` (only if you want it — open question from grilling).

## Open questions

1. Update the 404 page to use `Card` now, or leave it for a later change?
2. Where should this plan/spec live — a file in the repo, GitHub Issues (needs the engineering-skills `docs/agents/` setup first), or both?

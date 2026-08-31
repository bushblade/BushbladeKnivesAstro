# BushbladeKnivesAstro

**Goal:** Rebuild [bushblade.co.uk](https://bushblade.co.uk) — a static site for a custom bushcraft knife-making business. Original site built with Gatsby.

Minimal [Astro](https://astro.build) v6.4.7 site (`astro/tsconfigs/strict`, TypeScript v6, pnpm v11).

**Dev environment:** Herdr · Fish shell · Ghostty terminal · Neovim

**Image assets** from the original Gatsby site are stored in `src/images/` (banners, knife photography, SVGs, etc.).

## Todo

- [x] Rebuild Home page (with SEO)
- [x] Rebuild About page (with SEO)
- [x] Rebuild Contact page (with SEO, Netlify form via `ContactForm.tsx` React island)
- [x] Rebuild Posts page (with SEO, content collection, GSAP stagger animation)
- [x] Rebuild knife product pages — `/knives/woodlore-clone` and `/knives/midi` (with SEO, galleries, SVG draw-on-scroll animation)
- [x] Set up content collections (blog posts via markdown, `posts` collection in `src/content/posts/`)
- [x] Rebuild individual post pages — dynamic route at `src/pages/posts/[slug].astro`
- [x] Image handling — set up image assets/optimisation (knife photography)

SEO is done via `Layout.astro` props forwarded to `src/components/SEO.astro` (title template `%s | Bushblade Knives`, description, keywords, OG/Twitter tags, canonical). Add `keywords`/`description` to a page's `<Layout>` when it's fully built out.

## Commands

| Command | Action |
|---|---|
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm astro` | Astro CLI (`astro add`, `astro check`, etc.) |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Format + lint + organize imports with Biome (writes fixes) |

## Gotchas

- **Build scripts blocked**: `esbuild` and `sharp` need explicit approval in pnpm. Already configured in `pnpm-workspace.yaml` (`allowBuilds`). If starting fresh on a clone, run `pnpm approve-builds esbuild sharp` — without this, `astro dev` fails silently.
- **Biome** v2.5.0 is configured for formatting, linting, and import organization. Astro files have experimental support with some lint rules disabled to avoid false positives.
- **Don't build after every change**: Astro dev server (`pnpm dev`) has instant HMR. Only build when explicitly asked or when ready for a production check.
- **TypeScript in `<script>` tags**: Astro supports TypeScript in `<script>` blocks by default. Use `as` type assertions (e.g. `const el = document.querySelector(...) as HTMLElement | null`) for DOM queries to satisfy strict typing.
- **GSAP** is installed for animations (logo scroll effect, mobile menu open/close with cascade). Animations use `back.out()` for playful bounce, `power2.out` for snappy exits, and `stagger` for sequenced child elements.
- **SVG line drawings animate with `<DrawOnScroll />`** (`src/components/DrawOnScroll.astro`) — wrap any inline `<svg>` in it to replay the original site's react-spring effect: paths draw themselves in when the SVG becomes fully visible. It's a GSAP `stroke-dashoffset` 100→0 tween on the `<svg>` element (2.5s `power2.out`, 0.2s delay), inherited by every `<path>` via the SVGs' existing `pathLength="100"` attributes, triggered by IntersectionObserver `threshold: 1`, one-shot. The hidden initial state is set in JS only (no-JS still shows the SVGs), and the whole effect is skipped under `prefers-reduced-motion`. Used on the knife pages for the profile/spine/skeleton drawings in `src/components/knives/`.
- **Gallery `cursor-zoom-in` and `scale-[1.006]` are intentional** — the cursor hint is the lightbox affordance and the scale utility is seam compensation for the hover zoom. Don't remove them.
- **Banner and content images use `<FadeImage />`** (`src/components/FadeImage.astro`) — a wrapper around Astro's `<Picture />` that emits `formats={['avif', 'webp']}` (jpg fallback) and adds an onload-gated fade-in (`.image-fade`/`.is-loaded` classes in `src/styles/global.css`; the img fades in when it finishes loading, with inline `onload`/`onerror` handlers plus a per-instance `complete` check so cached/broken images never sit at opacity 0). Use it for **every banner image and every in-content image** on new pages (`layout="full-width"` for banners, `layout="constrained"` + `width` for content). Do **not** use Astro's `<Image />` for new images — it emits a single format with no fallback and no fade-in. The **only** exception is the Gallery: `Gallery.tsx` is a React island (can't use `<Picture />`), builds its variants via `getImage()` in `src/utils/gallery.ts`, and its grid thumbs must keep the declarative `animate-fade-in` (react-photo-album re-creates `<img>` nodes, so JS-driven reveals leave images stuck invisible). Note `<FadeImage>` picks formats by environment — dev encodes **webp only** (avif/AV1 is far too slow for on-demand sharp), production pre-generates **avif + webp** at build time — so dev is fast and the `<picture>` negotiation is tested in prod (the old `imageFormat` util and `src/utils/image.ts` are gone).
- **Gallery lightbox must never upscale images**: `react-touch-drag-slider` sizes every slide to the full viewport and its CSS permits `img { max-width: 100% }`, so low-res sources (e.g. the ~400–480px portrait files in `src/images/me/`) get stretched and look pixelated. The lightbox `<img>` in `src/components/Gallery.tsx` must keep its per-image native-size cap (inline `maxWidth`/`maxHeight` set from `photo.width`/`photo.height`, which are the original source dimensions from `buildGalleryPhotos`).
- **Lightbox arrow keys are handled by `react-touch-drag-slider` itself via element focus**: the slider's focusable wrapper (`role="slider"`, `tabIndex={0}`) handles `ArrowLeft`/`ArrowRight` on its own `onKeyDown` — arrow navigation only fires while that element has focus. `Lightbox.tsx` focuses it on open (`dialogRef.current?.querySelector<HTMLElement>('[role="slider"]')?.focus()`). Do **not** add `ArrowLeft`/`ArrowRight` handling in `Lightbox.tsx`'s window keydown handler — it would fire in addition to the slider's own handler and make the lightbox jump multiple images. Escape and Tab handling in Lightbox.tsx don't overlap with the slider's keys.
- **Gallery grid thumbs fade in via the global CSS `animate-fade-in` utility** (defined in `src/styles/global.css` as a Tailwind v4 `--animate-*` theme key + `@keyframes fade-in`, opacity 0 → 1, 0.4s ease-out). A declarative CSS animation self-completes and replays on re-created nodes, so it can never get stuck invisible — unlike the one-shot JS reveal it replaced. Keep `text-transparent` on the thumb so the generic fallback alt text never flashes on slow loads. Do **not** reintroduce a static `opacity-0` class or a JS reveal effect — react-photo-album re-creates `<img>` DOM nodes whenever the container is re-measured (on resize, and on first render where the initial pass uses the library's built-in `defaultContainerWidth` fallback until the container is measured), so any mount-only reveal leaves the re-created nodes permanently invisible. The image's `transition-property` list must include `transform` and `scale`: Tailwind v4's `scale-*` utilities use the native `scale` property, so a list that omits `scale` makes the hover zoom snap. A photo's `alt` is optional in `buildGalleryPhotos` sources (`{ name, alt?, src }`) — it falls back to the filename. Dev serves images from `/_image` on-demand via sharp (first encode is slow); production pre-generates avif, so slow first loads are a dev-only artifact.
- **Content collections** — the `image()` schema helper is accessed via the schema function context, not a direct import: `schema: ({ image }) => z.object({ image: image() })`. It resolves relative image paths in frontmatter to `ImageMetadata` objects compatible with `<Picture />` / `<FadeImage />`. `z.string()` does **not** resolve images and will produce a `LocalImageUsedWrongly` error at build time. When creating a new content collection or adding new content files, the dev server must be restarted (or `s` + Enter in the dev terminal to sync) to pick them up — the first build after creating a content collection will fail until the content layer sync runs.
- **Order status is a single flag**: `SITE.acceptingOrders` in `src/data/site.ts` is the one source of truth for whether the site is accepting orders (currently `false` — the site is closed). It gates the sitewide closure banner (`NoticeBanner.astro` in `Layout.astro`), the knife-page pricing CTAs ("currently not taking orders" vs "contact me"), and the Contact page's form note + waiting-list FAQ. When the maker reopens, flip the flag to `true` — never edit the closure copy in place. Adding new copy that depends on order status must be gated on this flag.
- **Tailwind v4** uses renamed utilities compared to v3. Common renames: `bg-gradient-to-t` → `bg-linear-to-t` (same for `-to-b`, `-to-r`, etc.), `shadow-lg` stays but arbitrary values lose the underscore-space convention in favor of real spaces. The Tailwind LSP provides `suggestCanonicalClasses` diagnostics — follow those suggestions. Canonical scale values (e.g. `after:border-r-8` over `after:border-r-[8px]`, `after:-bottom-3` over `after:-bottom-[12px]`) are preferred over arbitrary pixel values when they match the 4px-per-unit scale.

## Code Style

- **Conditional rendering**: Use ternary operators with `null` over logical AND (`&&`).
  ```astro
  {condition ? <Component /> : null}
  ```
- **React components**: Use function declarations, not arrow-function expressions.
  ```tsx
  function Gallery({ photos }: GalleryProps) { ... }
  ```
- **TypeScript in `<script>` tags**: Use `as` type assertions (e.g. `const el = document.querySelector(...) as HTMLElement | null`) for DOM queries to satisfy strict typing.

## Page Conventions

Typography, sizing and spacing are consistent across pages (see `index.astro`, `about.astro`, `contact.astro`). Follow these on every new page:

- **Page frame**: full-width `<FadeImage>` banner (`layout="full-width"` `loading="eager"`) → `<PageTitle pageTitle="..." tagline="..." />` → content in `<div class="max-w-7xl mx-auto px-4">`. The wrapper owns the `px-4` — never add horizontal padding to inner elements.
- **Body text**: leave `<p>` unstyled — it inherits `text-lg` (1.125rem) Source Sans Pro from the `Layout` body. Don't set font-size or weight on paragraphs.
- **Headings**: use the site's heading scale — section `h2` = `text-3xl`, sub-heading `h3` = `text-2xl`. Captions are `text-center italic` `<p>` elements, **not** `h4` — a caption heading skips the heading outline (h1 → h4). Headings are default weight (400): no `font-medium`, no arbitrary rem sizes (e.g. `text-[1.73rem]`). The page title is `PageTitle` (Bilbo), not a bare `h1`.
- **Vertical rhythm**: 1rem gaps — put `mt-4` on the second and later items in a run (paragraphs after the first, or blocks after a heading); the first item in a section has no top margin. Section gaps are `my-8`, galleries `my-16`. Don't use an `mb-6` bottom-margin rhythm on body content.
- **Grids**: `grid grid-cols-1 md:grid-cols-2 gap-8` (stacked on mobile, two columns ≥768px). If a narrower measure is needed, cap the grid with `max-w-240 mx-auto` inside the wrapper (as on contact) — don't shrink the outer wrapper.

## Agent Skills

GSAP skills are available in `.agents/skills/` for authored guidance on animations:

- **gsap-core** — core API: `to()`, `from()`, `fromTo()`, easing, duration, stagger, timelines, defaults, `gsap.matchMedia()`
- **gsap-plugins** — ScrollToPlugin, Flip, Draggable, SplitText, CustomEase, and other plugins
- **gsap-scrolltrigger** — scroll-linked animations, pinning, scrub, triggers
- **gsap-performance** — optimising animations, avoiding layout thrashing, `will-change`
- **gsap-utils** — `clamp`, `mapRange`, `normalize`, `random`, `snap`, `wrap`, `pipe`, `interpolate`
- **herdr** — control terminal panes/tabs, view workspaces, run background commands, delegate to other agents. Requires `HERDR_ENV=1`.

Load one with the `skill` tool when the task matches its description.

# BushbladeKnivesAstro

**Goal:** Rebuild [bushblade.co.uk](https://bushblade.co.uk) — a static site for a custom bushcraft knife-making business. Original site built with Gatsby.

Minimal [Astro](https://astro.build) v6.4.7 site (`astro/tsconfigs/strict`, TypeScript v6, pnpm v11).

**Dev environment:** Herdr · Fish shell · Ghostty terminal · Neovim

**Image assets** from the original Gatsby site are stored in `src/images/` (banners, knife photography, SVGs, etc.).

## Todo

- [x] Rebuild Home page (with SEO)
- [x] Rebuild About page (with SEO)
- [ ] Rebuild Contact page — currently a stub (`<Layout title="Contact Me" />` only); add content + full SEO (keywords)
- [ ] Rebuild Posts page — currently a stub (`<Layout title="Posts" />` only); add content + full SEO
- [ ] Rebuild knife product pages — `/woodlore-clone` and `/midi` — currently stubs (title only); add content + full SEO (keywords)
- [ ] Set up content collections (blog posts, knife data via Markdown/MDX)
- [ ] Theme and styling — pull colours, fonts, design from original site into Tailwind
- [ ] Image handling — set up image assets/optimisation (knife photography)

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
- **Gallery `cursor-zoom-in` and `scale-[1.006]` are intentional** — the cursor hint is the lightbox affordance and the scale utility is seam compensation for the hover zoom. Don't remove them.
- **Gallery lightbox must never upscale images**: `react-touch-drag-slider` sizes every slide to the full viewport and its CSS permits `img { max-width: 100% }`, so low-res sources (e.g. the ~400–480px portrait files in `src/images/me/`) get stretched and look pixelated. The lightbox `<img>` in `src/components/Gallery.tsx` must keep its per-image native-size cap (inline `maxWidth`/`maxHeight` set from `photo.width`/`photo.height`, which are the original source dimensions from `buildGalleryPhotos`).
- **Lightbox arrow keys are handled by `react-touch-drag-slider` itself**: it adds its own `window` `keydown` listener that steps its internal index by exactly one (clamped at both ends) and calls `onSlideComplete` (wired to `setCurrent`). Do **not** add `ArrowLeft`/`ArrowRight` handling in `Gallery.tsx`'s own keydown handler — doing so fires twice per press and makes the lightbox jump multiple images. Escape and Tab handling in Gallery.tsx don't overlap with the slider's keys.
- **Gallery grid thumbs fade in via the global CSS `animate-fade-in` utility** (defined in `src/styles/global.css` as a Tailwind v4 `--animate-*` theme key + `@keyframes fade-in`, opacity 0 → 1, 0.4s ease-out). A declarative CSS animation self-completes and replays on re-created nodes, so it can never get stuck invisible — unlike the one-shot JS reveal it replaced. Keep `text-transparent` on the thumb so the generic fallback alt text never flashes on slow loads. Do **not** reintroduce a static `opacity-0` class or a JS reveal effect — react-photo-album re-creates `<img>` DOM nodes whenever the container is re-measured (on resize, and on first render where the initial pass uses the library's built-in `defaultContainerWidth` fallback until the container is measured), so any mount-only reveal leaves the re-created nodes permanently invisible. The image's `transition-property` list must include `transform` and `scale`: Tailwind v4's `scale-*` utilities use the native `scale` property, so a list that omits `scale` makes the hover zoom snap. A photo's `alt` is optional in `buildGalleryPhotos` sources (`{ name, alt?, src }`) — it falls back to the filename. Dev serves images from `/_image` on-demand via sharp (first encode is slow); production pre-generates avif, so slow first loads are a dev-only artifact.

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

## Agent Skills

GSAP skills are available in `.agents/skills/` for authored guidance on animations:

- **gsap-core** — core API: `to()`, `from()`, `fromTo()`, easing, duration, stagger, timelines, defaults, `gsap.matchMedia()`
- **gsap-plugins** — ScrollToPlugin, Flip, Draggable, SplitText, CustomEase, and other plugins
- **gsap-scrolltrigger** — scroll-linked animations, pinning, scrub, triggers
- **gsap-performance** — optimising animations, avoiding layout thrashing, `will-change`
- **gsap-utils** — `clamp`, `mapRange`, `normalize`, `random`, `snap`, `wrap`, `pipe`, `interpolate`
- **herdr** — control terminal panes/tabs, view workspaces, run background commands, delegate to other agents. Requires `HERDR_ENV=1`.

Load one with the `skill` tool when the task matches its description.

# BushbladeKnivesAstro

**Goal:** Rebuild [bushblade.co.uk](https://bushblade.co.uk) — a static site for a custom bushcraft knife-making business. Original site built with Gatsby.

Minimal [Astro](https://astro.build) v6.4.7 site (`astro/tsconfigs/strict`, TypeScript v6, pnpm v11).

**Dev environment:** Herdr · Fish shell · Ghostty terminal · Neovim

**Image assets** from the original Gatsby site are stored in `src/images/` (banners, knife photography, SVGs, etc.).

## Todo

- [ ] Rebuild existing pages (Home, About, Contact, Posts)
- [ ] Set up content collections (blog posts, knife data via Markdown/MDX)
- [ ] Theme and styling — pull colours, fonts, design from original site into Tailwind
- [ ] Image handling — set up image assets/optimisation (knife photography)
- [ ] Knife product pages (Woodlore Clone, Midi)

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
- **Gallery grid thumbs fade in on load**: they start with `opacity-0 text-transparent` (so the generic fallback alt text doesn't flash) and are revealed by a hydration-safe effect in `Gallery.tsx` — already-cached images (`img.complete`) are revealed instantly, the rest fade in via a `{ once: true }` `load` listener. Keep `transition-[transform,opacity]` on the image so the fade and the hover zoom both animate. A photo's `alt` is optional in `buildGalleryPhotos` sources (`{ name, alt?, src }`) — it falls back to the filename. Dev serves images from `/_image` on-demand via sharp (first encode is slow); production pre-generates avif, so slow first loads are a dev-only artifact.

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

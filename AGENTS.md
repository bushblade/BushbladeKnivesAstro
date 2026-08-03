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
- **Gallery `cursor-zoom-in` is intentional** — the gallery zoom/lightbox interaction is the next feature to implement. Don't remove the cursor hint or the `scale-[1.006]` seam-compensation utility until that ships.

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

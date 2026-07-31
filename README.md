# Bushblade Knives

Static marketing site for [bushblade.co.uk](https://bushblade.co.uk) — custom handmade
bushcraft knives by Will Adams. A rebuild of the original Gatsby site using Astro.

## Stack

- **Astro** v6 (static output) with strict TypeScript
- **Tailwind CSS** v4 via `@tailwindcss/vite`
- **React islands** — responsive gallery powered by `react-photo-album`
- **GSAP** for scroll and menu animations
- **`astro:assets` / Sharp** image optimization (avif in production)
- **Biome** for formatting, linting, and import organization
- **pnpm** as the package manager

## Pages

Home, About, Contact, Posts, and Knives (Woodlore Clone, Midi).

## Commands

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at `localhost:4321` |
| `pnpm build` | Build the production site to `./dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro ...` | Run Astro CLI commands (`astro add`, etc.) |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Format + lint + organize imports (writes fixes) |

## Dev notes

- Build scripts for `esbuild` and `sharp` need approval on a fresh clone:
  `pnpm approve-builds esbuild sharp` (without this, `astro dev` fails silently).
- The dev server has instant HMR — only run `pnpm build` for a production check.

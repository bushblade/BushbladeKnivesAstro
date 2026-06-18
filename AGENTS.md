# BushbladeKnivesAstro

Minimal [Astro](https://astro.build) v6.4.7 site (`astro/tsconfigs/strict`, TypeScript v6, pnpm v11).

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
- VSCode debug: launch config runs `./node_modules/.bin/astro dev`.

# Plan: Extract the Lightbox from Gallery

**Status:** DONE  
**Branch:** `refactor/extract-lightbox`  
**Last updated:** 2026-08-22

---

## Problem

`Gallery.tsx` (167 lines) mixes four concerns into one component:

1. **Grid layout** — renders `RowsPhotoAlbum` with thumb styling
2. **Lightbox modal** — portal, `role="dialog"`, aria-modal, aria-live region
3. **Keyboard accessibility** — focus trap, Escape to close, Tab cycling
4. **Drag-to-slide** — `react-touch-drag-slider`, native size caps, chevron buttons

Testing the lightbox's accessibility (focus trap, escape, overflow lock) requires rendering the entire gallery including image data. A bug in the focus trap can't be fixed without reading past the grid and drag logic.

## Solution

Extract a `Lightbox` React component with a small interface:

```tsx
interface LightboxProps {
  photos: readonly Photo[]
  current: number
  onClose: () => void
  onNavigate: (index: number) => void
}
```

`Gallery.tsx` becomes a thin orchestrator: renders the grid, manages `open`/`current` state, and conditionally mounts `<Lightbox />`.

## Files involved

| File | Change |
|------|--------|
| `src/components/Lightbox.tsx` | **New.** Portal, dialog, focus trap, escape, overflow lock, chevrons, `react-touch-drag-slider`, aria-live. Absorbs lines 99–163 of Gallery.tsx. |
| `src/components/Gallery.tsx` | **Edit.** Remove lightbox code. Import and render `<Lightbox />` when `open` is true. Keeps grid + state. |
| `src/components/icons/ChevronLeft.tsx` | No change (imported by Lightbox). |
| `src/components/icons/ChevronRight.tsx` | No change (imported by Lightbox). |

## Verification

- [x] `pnpm build` succeeds
- [x] `pnpm check` (Biome lint/format) passes
- [ ] Gallery renders correctly on `/knives/woodlore-clone` and `/knives/midi`
- [ ] Lightbox opens on thumb click, closes on Escape and X button
- [ ] Focus trap works (Tab cycles within lightbox)
- [ ] Chevron navigation works on desktop
- [ ] Drag-to-slide works on mobile
- [ ] aria-live announces "Image N of M"
- [ ] Overflow lock engages (no background scroll when lightbox open)

## Grilling questions

Before implementing, answer these:

1. Should `onNavigate` be a callback, or should the lightbox own its own `current` state? If the lightbox owns it, the grid can't highlight the active thumb — is that acceptable?
2. The current lightbox uses `createPortal` to `document.body`. Should the new Lightbox keep the portal, or render inline? (Portal keeps z-index isolation; inline is simpler to test.)
3. Should the lightbox be lazy-loaded (`client:load` vs `client:idle`)? Currently Gallery is `client:load` — if Lightbox is a separate island, it could be `client:idle` to reduce initial JS.
4. The `srcSetOf` helper builds a srcset string from `photo.srcSet`. Should it move into Lightbox (it's only used there) or stay in Gallery?

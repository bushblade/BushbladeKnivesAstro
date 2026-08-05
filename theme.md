# Bushblade Knives — Theme

## Page & Layout

| Color | Hex | Usage | Files |
|-------|-----|-------|-------|
| Off-white | `#f1f1f1` | Page body background, blockquote/article background, layout wrapper bg, page title tagline overlay | `global.css`, `styledComponents.js`, `layout.js`, `pageTitle.js` |

## Brand Accent

| Color | Hex | Usage | Files |
|-------|-----|-------|-------|
| Muted olive/khaki | `#c2c2a3` | Navbar background, footer top border, footer link hover underline, blockquote left border, article top border, page title underline, PWA `background_color`/`theme_color`, typography link hover bg | `navbar.js`, `footer.js`, `global.css`, `styledComponents.js`, `pageTitle.js`, `gatsby-config.js`, `typography.js` |
| Muted olive variant | `#c2c2a4` | Post card header bottom border, post card decorative chevron | `postsCard.js` |

## Illustration / SVG

| Color | Hex | Usage | Files |
|-------|-----|-------|-------|
| Dark gray | `#333333` | Fill & stroke for logo wordmark, all knife SVG illustrations (woodlore, midi), flower of life decorative backgrounds, favicon | `logo.js`, `woodlore-skeleton.svg`, `woodlore-spine.svg`, `woodlore-website.svg`, `midi-skeleton.svg`, `midi-spine.svg`, `midi-website.svg`, `floweroflife.svg`, `floweroflife-dark.svg`, `favicon.svg`, `logo01-web.svg` |
| Dark gray (shorthand) | `#333` | Stroke for knife outlines, guards, bolts, bevels in inline SVG components | `woodloreSpineSVG.js`, `woodloreSkeletonSVG.js`, `woodloreSVG.js`, `midiSkeletonSVG.js`, `midiSpineSVG.js`, `midiSVG.js` |
| Black | `#000` / `#000000` | Stroke for knife spine path (midi spine only) | `midiSpineSVG.js`, `midi-spine.svg` |
| Medium gray | `#666666` | SVG `bordercolor` on embedded illustrations | `woodlore-skeleton.svg`, `midi-skeleton.svg` |
| Light gray | `#b3b3b3` | Hidden (`opacity:0`) fill/stroke in favicon | `favicon.svg` |
| Light gray | `#cccccc` | Favicon decorative element fill/stroke | `favicon.svg` |

## Form Elements

| Color | Hex | Usage | Files |
|-------|-----|-------|-------|
| Dark charcoal | `#363636` | Input/textarea text color | `ContactForm.js` |
| Light gray | `#dbdbdb` | Default border for empty/unfilled form fields | `ContactForm.js` |
| Sea green | `#3cb371` | Form valid border/shadow | `ContactForm.tsx` |
| Error red | `#a94442` | Form validation error border, 18+ warning text, 404 page error text | `ContactForm.js`, `index.js`, `404.js` |

## Social Media (Nav Link Hover Colors)

| Color | Hex | Service | File |
|-------|-----|---------|------|
| Facebook blue | `#3B5998` | `navLinks.js` |
| Instagram pink | `#bc2a8d` | `navLinks.js` |
| Twitter blue | `#1dcaff` | `navLinks.js` |
| YouTube red | `#ff0000` | `navLinks.js` |

## Miscellaneous

| Color | Hex | Usage | Files |
|-------|-----|-------|-------|
| White | `#ffffff` | SVG embedded `pagecolor` for skeleton illustrations | `woodlore-skeleton.svg`, `midi-skeleton.svg` |

---

## Color Roles Summary

- **Background:** `#f1f1f1`
- **Primary accent:** `#c2c2a3` / `#c2c2a4`
- **Lineart / text:** `#333333` / `#333`
- **Errors & warnings:** `#a94442`
- **Form text:** `#363636`
- **Form borders:** `#dbdbdb` (default), `#3cb371` (valid), `#a94442` (error)
- **Social icons (hover):** respective brand colors

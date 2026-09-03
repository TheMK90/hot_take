# Hot Take — logo assets

Vector sources live in [`svg/`](svg/); rendered rasters in [`png/`](png/), one folder per
variant. **The SVGs are the masters** — edit those and re-render, never edit a PNG.

## Palette

| Token | Hex | Used for |
| --- | --- | --- |
| Rust | `#CE4322` | Primary brand colour, the drop |
| Rust deep | `#A2331A` | Shadowed segments of the film strip |
| Amber | `#EE9B3E` | Accent reel holes |
| Cream | `#FFF6EC` | Knockout fills, reel face |
| Sand | `#FDEDE0` | Light icon background |
| Ink | `#2A1C14` | Eyes, wordmark |
| Ink deep | `#221812` | Dark icon background |
| Stone | `#6E645B` | Tagline |

## What to use where

**Lockups** — horizontal, mark plus wordmark. Use on light backgrounds unless noted.

- `hot-take-lockup` — full lockup with the "rate it. review it. roast it." tagline.
- `hot-take-lockup-no-tagline` — same, tagline removed. Use when the lockup renders
  under roughly 180 px wide, where the tagline stops being legible.
- `hot-take-lockup-knockout` — for dark or rust backgrounds.

**Marks** — the drop alone, no wordmark.

- `hot-take-mark` — full detail, with the film-strip tail. Good above ~64 px.
- `hot-take-mark-compact` — tail dropped, reel simplified. For 24–48 px.
- `hot-take-mark-micro` — reel reduced to a single hole. For 16–20 px.
- `-knockout` variants of each of the above, for dark or rust backgrounds.
- `hot-take-mark-mono-ink` / `-mono-cream` — single-colour, for one-ink printing,
  embroidery, or anywhere the full palette can't be reproduced.

**App icons** — the mark on a rounded-square background, ready for a store listing.

- `hot-take-icon-light` / `-dark` / `-solid` — sand, ink, and rust backgrounds.
- `-compact` and `-micro` variants follow the same simplification rules as the marks.
- `hot-take-icon-solid-square` — unrounded, for platforms that apply their own mask
  (Android adaptive icons, iOS, which rounds the corners itself).

## PNG sizes

App icons render at 1024, 512, 256, 180, 128, 64, 48, 32, and 16 px square. Marks and
lockups render at 1x, 2x, and 3x their natural size.

## Re-rendering

The PNGs are generated from the SVGs with [sharp](https://sharp.pixelplumbing.com):

```
npm install sharp
node scripts/render-logo-png.js
```

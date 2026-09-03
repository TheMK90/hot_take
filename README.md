<p align="center">
  <img src="assets/logo/png/hot-take-lockup/hot-take-lockup@1x.png" alt="Hot Take" width="420">
</p>

# hot_take

rate it. review it. roast it.

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste the fanart.tv key into FANART_API_KEY
npm run dev                  # http://localhost:3000
```

The app runs without the key — posters just fall back to placeholder boxes.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build, including type and lint checks |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run clean` | Delete the `.next` build cache (see below) |
| `npm run render-logos` | Rebuild `assets/logo/png` from the SVG masters |

### If you hit `Cannot find module './563.js'`

A stale or half-written `.next` cache. It usually means `next dev` and `next build` ran
against the same `.next` directory at once, or a running server held files open while
something tried to delete them — Windows will not remove a locked file, so you end up with
a build that is missing chunks.

Stop every running dev/build process first, then:

```bash
npm run clean
npm run dev
```

The stop-first part matters: running `clean` while a server is up silently fails to delete
the locked files and leaves the cache in exactly the broken state you were trying to fix.

## Posters

Movie and show artwork comes from [fanart.tv](https://fanart.tv) via
[`lib/fanart.ts`](lib/fanart.ts). It is **server-only** — artwork is resolved in
`app/page.tsx` and passed to client components as finished URLs, so the API key never
reaches the browser. Put the key in `.env.local`, which is gitignored; never commit it.

fanart.tv has no title search, so every catalogue entry in
[`lib/data.ts`](lib/data.ts) carries the id its artwork is fetched with — `tmdbId` for
films, `tvdbId` for series. Adding a title means looking its id up first.

## Where things are going

[`ROADMAP.md`](ROADMAP.md) is the launch checklist, phase by phase, with a
**How to verify** block on each phase.

## Branding

Logo assets — lockups, marks, and app icons, in SVG and PNG — live in
[`assets/logo/`](assets/logo/). See [the brand notes](assets/logo/README.md) for the
palette and guidance on which variant to use at which size.

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Stable. |
| `dev` | Shared integration branch. Collaborator branches merge here. |
| `feature` | General feature work. |
| `a-h-w-97` | Working branch for [@a-h-w-97](https://github.com/a-h-w-97). |
| `Axelonfire` | Working branch for [@Axelonfire](https://github.com/Axelonfire). |
| `y-alireza` | Working branch for [@y-alireza](https://github.com/y-alireza). |

Branch names are flat rather than `feature/<name>`, because a `feature` branch already
exists and git cannot hold both a `feature` ref and a `feature/…` ref at once.

<p align="center">
  <img src="assets/logo/png/hot-take-lockup/hot-take-lockup@1x.png" alt="Hot Take" width="420">
</p>

# hot_take

rate it. review it. roast it.

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste in FANART_API_KEY and TMDB_API_KEY
npm run dev                  # http://localhost:3000
```

The app runs without either key: posters fall back to placeholder boxes, and search covers
only the local catalogue instead of all of TMDb.

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

The same cure applies to **`Failed to read source code from .../SomeFile.tsx`** naming a
file that no longer exists. A running dev server keeps its own module graph, so when a file
is renamed underneath it — by an edit, a branch switch or a `git pull` — it keeps asking for
the old path. Restart it.

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

fanart.tv has no title search — it is keyed by id, and a title lookup returns `{}`. So every
catalogue entry in [`lib/data.ts`](lib/data.ts) carries the id its artwork is fetched with:
`tmdbId` for films, `tvdbId` for series.

## Search

The header box does two things at once. It filters the homepage rails instantly from the
local catalogue, and it queries TMDb through [`/api/search`](app/api/search/route.ts) for
everything else, so anyone can find and review a film we do not hold. Catalogue results are
listed separately because those have pages to visit; external ones only offer a review.

TMDb supplies the search and the ids, fanart supplies the artwork. They fit together because
fanart is keyed by TMDb ids for films in the first place. Both keys are server-side only.

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

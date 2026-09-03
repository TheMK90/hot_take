# Hot Take — path to launch

Checklist from the whiteboard/notes session, ordered so each phase unblocks the next.
Build the whole app against the current mock/local data first — database creation
(Supabase) and publishing (Vercel) are deliberately last.

## Getting the app running

```bash
npm install
cp .env.example .env.local   # then paste the fanart.tv key into FANART_API_KEY
npm run dev                  # http://localhost:3000
```

Without `FANART_API_KEY` the app still runs — posters fall back to the dashed
placeholder boxes rather than erroring.

| Command | What it is for |
| --- | --- |
| `npm run dev` | Local dev server with hot reload. The main one. |
| `npm run build` | Production build. Also runs the TypeScript and ESLint checks. |
| `npm start` | Serves the production build (run `npm run build` first). |
| `npx tsc --noEmit` | Types only, faster than a full build. |
| `npm run lint` | ESLint on its own. |
| `npm run render-logos` | Rebuilds `assets/logo/png` from the SVG masters. |

Each phase below ends with a **How to verify** block: the commands to run and what
you should see if the phase is genuinely done.

## Phase 0 — Decisions to lock in before building

- [ ] Confirm v1 scope vs. "later": which items below ship at launch vs. post-launch
- [ ] Design the rating system: replace the plain 1–5 dot picker with the "creative thumbs up" input from the notes
- [ ] Design the multi-layer score badge: an Oscars/Razzies-style icon overlay on top/bottom rated films (Rotten-Tomatoes-icon equivalent) — what score thresholds trigger which badge
- [ ] Decide what "easter eggs" means concretely (a few specific hidden interactions to build, not just the idea)
- [ ] Decide what "recap" means (per-user "your year in film" style recap? site-wide annual recap?)
- [x] ~~Confirm "Related movies" stays cut~~ — reversed: explicitly requested for the movie
      profile page, see Phase 2
- [ ] Decide: is "Now showing" / cinema showtimes real data going forward, or does it stay a static decorative section?

**How to verify Phase 0:** nothing to run — every box above is a written decision.
Phase 0 is done when someone can read the answers without asking you.

## Phase 1 — New features from the notes (built against mock data)

- [ ] Search bar: make it functional (search by film name) over `lib/data.ts`
- [ ] Browse/filter by category (genre) — the existing "Browse by genre" tiles should actually filter
- [ ] Decade slider / timeline filter for browsing films
- [ ] "Add movies" flow (decide: open to any signed-in user, or admin-only) — writes to local/mock state for now
- [ ] "Edit movie entries" flow (likely admin-only, or an edit-suggestion/moderation flow)
- [ ] Rating history — a page showing a signed-in user's past ratings/reviews (from local state)
- [ ] The redesigned rating input (creative thumbs-up) from Phase 0
- [ ] The Oscars/Razzies score badge from Phase 0
- [ ] Easter eggs (once concretely scoped in Phase 0)
- [ ] Recap feature (once concretely scoped in Phase 0)

**How to verify Phase 1:** `npm run dev`, then in the browser:
type a film name in the header search and confirm the rail narrows; click a genre
tile and confirm only that genre shows; drag the decade slider and confirm the set
changes; sign in, rate a film, reload the page and confirm the rating survived.

## Phase 2 — Supporting pages the above needs

- [x] ~~Per-movie detail page~~ — `/movies/[slug]`: poster, summary, director, release
      date, runtime, score, showtimes (or a fallback message), reviews for that title
      (community + the viewer's own), a "write a review" CTA prefilled with the film,
      and a "you might also like" rail (same genre, backfilled with the rest of the
      catalogue so a one-of-a-kind genre still gets suggestions). Lobby posters,
      review card titles, and Top 10 entries all link there now.
- [ ] User profile page (handle, avatar, rating history, own reviews)
- [ ] Custom 404 page (an invalid `/movies/slug` currently falls through to Next's
      stock "This page could not be found", not a themed one)
- [ ] Real destinations for the footer links (Community rules, Cinemas, Archive currently just anchor back to sections on the homepage)
- [ ] TV show detail pages — shows still have no equivalent of the movie profile page

**How to verify Phase 2:** `npm run dev`, then click a poster — it should open that
film's page rather than doing nothing. Visit `/some-nonsense-url` and confirm you get
your own 404, not the stock Next one. Click every footer link and confirm none of them
just jump back to the homepage.

## Phase 3 — Production hardening

- [ ] Form validation beyond native HTML `required` (e.g. review body length, rating bounds)
- [ ] Basic accessibility pass (modal focus trapping, keyboard nav on the poster rail, color contrast in both themes)
- [ ] Page-level SEO metadata (per-movie titles/descriptions, not just the one static root metadata block)
- [ ] Mobile/responsive pass — the current layout hasn't been checked below desktop widths
- [ ] Decide on analytics/error monitoring (optional)

**How to verify Phase 3:** `npm run build` must pass with no errors or new warnings.
Then `npm start` and check: submitting an empty or 5000-character review is refused
with a visible message; you can open a modal, tab through it and close it with Escape
without the focus escaping; the poster rail is operable with arrow keys alone; and the
page is usable at 375px wide in your browser's device toolbar. View source on a film
page and confirm its `<title>` is that film, not the generic site title.

## Phase 4 — QA (against mock data)

- [ ] Full manual pass: sign up → rate → review → search → filter → edit profile, in both themes
- [ ] Cross-browser check (Chrome/Firefox/Safari) and at least one real mobile device

**How to verify Phase 4:** this phase *is* the verification — work the list by hand in
Chrome, Firefox and Safari, in both light and dark themes, plus one real phone. Write
down what broke; anything found here goes back into Phase 1–3 before you continue.

## Phase 5 — Supabase: database creation & wiring

- [ ] Create the Supabase project (and a separate one for local/dev if the team wants staging isolation)
- [ ] Design tables: `profiles` (user handle/initials/avatar), `movies`, `genres`, `reviews` (rating + body + film + user), `cinemas`/`showtimes` (if kept real per Phase 0)
- [ ] Add columns needed for the decade/timeline search: movie `release_year`, indexed for range filtering
- [ ] Enable Supabase Auth (email/password at minimum; decide if social login is wanted)
- [ ] Write Row Level Security policies: anyone can read movies/reviews; only the authoring user can edit/delete their own review; only admins can add/edit movie entries
- [ ] Create a Storage bucket for review stills and user avatars, with an upload policy
      (movie/show posters no longer need this — they come from fanart.tv)
- [x] ~~Replace the placeholder movie list with real films~~ — `lib/data.ts` now holds ten
      real films with TMDb ids and eight real series with TVDB ids
- [ ] Seed the database with those rows, carrying the `tmdbId`/`tvdbId` columns across so
      posters keep resolving once the data moves out of `lib/data.ts`
- [ ] Add `@supabase/supabase-js` (and `@supabase/ssr` for server components), `.env.local` with the project URL/anon key, keep it out of git
- [ ] Replace `ThemeUserProvider`'s fake localStorage auth with real Supabase Auth (sign up, log in, log out, session persistence, password reset)
- [ ] Replace the hardcoded `communityReviews` in `lib/data.ts` with a live query, and make `submitReview` insert into the `reviews` table instead of local state only
- [ ] Replace hardcoded `lobbyMovies` / `top10` / `genres` with queries once movies live in the database
- [x] ~~Replace poster/still `PlaceholderImage` usages with real images~~ — done via
      fanart.tv (`lib/fanart.ts`), not Supabase Storage. `PlaceholderImage` is still the
      fallback when a title has no artwork, so keep it
- [ ] Wire the Phase 1 features (add/edit movie, rating history) to the real database instead of mock state
- [ ] Add loading and error states for every Supabase call (fetch failures, empty states)
- [ ] Re-run the Phase 4 QA pass against the real backend, including confirming RLS actually blocks what it should (try editing someone else's review as a non-admin)

**How to verify Phase 5:** `npm run build` still passes, then `npm run dev` and confirm
the homepage renders identical content with `lib/data.ts` no longer feeding it. Hard-refresh
and confirm reviews persist (they are in the database now, not local state). Sign out, sign
back in, confirm the session restores. Then the security check that matters: signed in as
user A, try to edit user B's review — RLS must refuse it. Kill your network mid-load and
confirm you get an error state, not a blank page.

## Phase 6 — Publish (last)

- [ ] Merge the working branch into `dev`, then `dev` into `main` per the repo's branch convention
- [ ] Create the Vercel project, link the GitHub repo
- [ ] Add the Supabase URL/anon key (and any other secrets) as Vercel environment variables
- [ ] Deploy, then smoke-test the live production URL end to end
- [ ] (Optional) connect a custom domain

**How to verify Phase 6:** open the deployed Vercel URL in a private window and run the
Phase 4 pass against production, not localhost. Confirm posters load (the fanart key must
be set in Vercel's env vars, not just your `.env.local`), sign-up works against the real
Supabase project, and the build logs show no errors.

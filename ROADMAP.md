# Hot Take — path to launch

Checklist from the whiteboard/notes session, ordered so each phase unblocks the next.
Build the whole app against the current mock/local data first — database creation
(Supabase) and publishing (Vercel) are deliberately last.

## Getting the app running

```bash
npm install
cp .env.example .env.local   # then paste the fanart.tv key into FANART_API_KEY,
                              # and an Anthropic key into ANTHROPIC_API_KEY for the chat widget
npm run dev                  # http://localhost:3000
```

Without `FANART_API_KEY` the app still runs — posters fall back to the dashed
placeholder boxes rather than erroring. Without `ANTHROPIC_API_KEY` the app still
runs too — the "Ask Hot Take" chat widget reports itself offline rather than erroring.

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

## Phase 0 — Decisions to lock in before building ✅ DONE

All seven answered in **[DECISIONS.md](DECISIONS.md)** — read that, not this summary.

- [x] v1 scope vs. "later" — **lean launch**: search, genre filter, detail page, heat-scale
      rating, reviews, profile, 404. Badges, recap, showtimes, decade slider, easter eggs
      and add/edit all land after v1
- [x] Rating system — **the heat scale**: five flames, whole steps, `radiogroup` semantics
      so it works from the keyboard
- [x] Score badge thresholds — Golden Reel ≥ 90, Certified Hot ≥ 75, Cold Take ≤ 25,
      The Turkey ≤ 10, each gated on a minimum rating count so a film with two votes wins
      nothing
- [x] Easter eggs — **random and site-wide**: a provider in the root layout rolls once per
      page view (~5%, one per session) from a pool of five page-agnostic eggs, plus two
      that stay earned rather than random
- [x] Recap — **both, site-wide first**: "Hot Take's Year" works from aggregate data on day
      one; the personal "Your Year in Film" follows once there is history
- [x] Related movies — originally **cut**, then **reversed**: explicitly requested for the
      movie profile page and shipped as `components/SimilarMovies.tsx`. DECISIONS §6 records
      the reversal and why
- [x] "Now showing" — **becomes real data**, but post-v1; stays visibly decorative until
      then, and must not imply bookable screenings

**How to verify Phase 0:** nothing to run. Open [DECISIONS.md](DECISIONS.md) and check you
can answer "what are we building?" from it without asking anyone. If a decision there turns
out wrong, change it in DECISIONS.md first and let this roadmap follow.

## Phase 1 — v1 features (built against mock data) ✅ DONE

Scoped down to the lean launch agreed in [DECISIONS.md](DECISIONS.md) §1. Everything
deferred is listed under "After v1" below — it is not dropped, just not blocking launch.

- [x] Search bar: functional over `lib/data.ts`, case-insensitive, filtering films and
      shows together. Filter state lives in `ThemeUserProvider` so the header, the genre
      tiles and both rails share one source of truth
- [x] Global search over TMDb (`lib/tmdb.ts` behind `/api/search`) — any film or series can
      be found and reviewed, not just the catalogue. fanart.tv cannot do this: it is keyed
      by id and a title lookup returns `{}`, so TMDb supplies search and the ids while
      fanart keeps supplying artwork for our own pages
- [x] Browse/filter by genre — the tiles are now toggle buttons carrying `aria-pressed`.
      Genre counts are derived from the catalogue instead of hardcoded, so a tile can no
      longer promise 27 documentaries and filter down to nothing
- [x] Heat-scale rating input (DECISIONS §2) — `components/HeatScale.tsx`. `HeatScale` is
      the display mode and replaced `RateDots` everywhere; `HeatScaleInput` is the input,
      built from native radios in a `radiogroup` so arrow keys, tab order and
      announcement come from the platform rather than hand-rolled key handlers. The flame
      is the logo's own drop path, so the rating and the mark are literally one shape
- [x] Rating history — `components/MyRatings.tsx`, shown only when signed in. Reviews now
      persist to `localStorage` and carry a `ratedAt` timestamp, so a rating survives a
      reload. Moves to a real query in Phase 5; the profile page it belongs on is Phase 2

### After v1 — not blocking launch

- [ ] Score badges (DECISIONS §3) — needs real rating volume before the thresholds mean anything
- [ ] Site-wide recap, "Hot Take's Year" (DECISIONS §5)
- [ ] Real showtimes (DECISIONS §7) — provider, cost and location all still open
- [ ] Decade slider / timeline filter
- [ ] Easter eggs (DECISIONS §4) — the provider plus the five-egg pool
- [ ] "Add movies" flow (decide: any signed-in user, or admin-only)
- [ ] "Edit movie entries" flow (likely admin-only, or an edit-suggestion/moderation flow)
- [ ] Personal recap, "Your Year in Film" (DECISIONS §5)
- [x] AI chat assistant ("Ask Hot Take") — a floating, Claude-powered widget grounded in
      the site's own movie/show catalogue, for recommendations and general film chat. Not
      from the original whiteboard notes; added separately, on branch `y-alireza-ai-chat`.
      Server-side only (`app/api/chat/route.ts`, `lib/ai.ts`); needs `ANTHROPIC_API_KEY`
      (see "Getting the app running"). Built and manually verified end-to-end with a real key.

**How to verify Phase 1:** `npm run dev`, then in the browser: type a film name in the
header search and confirm the rail narrows; click a genre tile and confirm only that genre
shows; rate a film, reload, and confirm the rating survived. Then unplug your mouse — tab
to the rating input, set a score with the arrow keys alone, and confirm a screen reader
announces the label. If that fails, the rating input is not done.

**How to verify the AI chat assistant:** paste a real key into `ANTHROPIC_API_KEY` in
`.env.local`, `npm run dev`, and open the site. Click the round button bottom-right, confirm
the panel opens with a greeting, then send a few messages: a normal recommendation ask,
something about a title *not* in `lib/data.ts` (it should still answer sensibly rather than
pretend it doesn't exist), and something long/off-topic. Reload mid-conversation and confirm
history does not persist (expected for now — there is no backend yet). Then comment out
`ANTHROPIC_API_KEY` and confirm the widget fails gracefully ("Couldn't reach the chat right
now") instead of crashing the page.

## Phase 2 — Supporting pages the above needs

- [x] ~~Per-movie detail page~~ — `/movies/[slug]`: poster, summary, director, release
      date, runtime, score, showtimes (or a fallback message), reviews for that title
      (community + the viewer's own), a "write a review" CTA prefilled with the film,
      and a "you might also like" rail (same genre, backfilled with the rest of the
      catalogue so a one-of-a-kind genre still gets suggestions). Lobby posters,
      review card titles, and Top 10 entries all link there now.
- [ ] User profile page (handle, avatar, rating history, own reviews)
- [x] ~~Custom 404 page~~ — `app/not-found.tsx` covers both an unknown route and an
      invalid `/movies/slug` or `/shows/slug`, since Next routes `notFound()` calls
      there too. Themed as a full-bleed gif easter egg rather than the site chrome,
      with the chat widget mounted directly on the page (layout children don't carry
      through here)
- [ ] Real destinations for the footer links (Community rules, Cinemas, Archive currently just anchor back to sections on the homepage)
- [x] TV show detail pages — `/shows/[slug]`, with `ShowHero` mirroring `MovieHero`.
      The "On the small screen" cards link into them. `MovieReviews` became
      `TitleReviews` and `SimilarMovies` became `SimilarTitles` so films and shows
      share them rather than keeping two near-identical copies

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

- [x] Supabase project created and `schema.sql` applied — verified live: all four tables
      exist and 18 titles are seeded with their artwork ids
- [x] Design tables — written as **[supabase/schema.sql](supabase/schema.sql)**, ready to paste
      into the SQL editor: `profiles`, `titles` (films and series in one table, since search
      and the genre filter span both), `reviews` and `review_votes`, plus RLS policies and a
      seed of the current catalogue. Still to run against a real project
- [ ] Add columns needed for the decade/timeline search: movie `release_year`, indexed for range filtering
- [ ] Enable Supabase Auth (email/password at minimum; decide if social login is wanted),
      **including anonymous sign-in** — guests can post without an account (DECISIONS §8),
      so the RLS ownership rules must work for an author with no account
- [x] RLS policies written and **verified against the live project**: anon reads all 18
      titles, an anon insert into `titles` is refused with `42501`, and a guest review
      insert succeeds. Enabling anonymous sign-in turned out to be unnecessary — the plain
      `anon` role satisfies the guest branch of `reviews_insert`
- [ ] Create a Storage bucket for review stills and user avatars, with an upload policy
      (movie/show posters no longer need this — they come from fanart.tv)
- [x] ~~Replace the placeholder movie list with real films~~ — `lib/data.ts` now holds ten
      real films with TMDb ids and eight real series with TVDB ids
- [ ] Seed the database with those rows, carrying the `tmdbId`/`tvdbId` columns across so
      posters keep resolving once the data moves out of `lib/data.ts`
- [x] `@supabase/supabase-js` added, project URL and anon key in `.env.local` (gitignored).
      `lib/supabase.ts` returns null rather than throwing when unconfigured, so the app
      falls back to `lib/data.ts` instead of going down
- [x] Persist externally-searched titles — clicking a TMDb result now POSTs to
      `/api/titles`, which validates the id against TMDb, writes the row with the
      service-role client (the anon key cannot write to `titles` by design) and redirects to
      the page that write created. Verified with Mortal Kombat and The Bear: both got full
      pages with fanart artwork resolved from their ids
- [ ] Replace `ThemeUserProvider`'s fake localStorage auth with real Supabase Auth (sign up, log in, log out, session persistence, password reset)
- [ ] Replace the hardcoded `communityReviews` in `lib/data.ts` with a live query, and make `submitReview` insert into the `reviews` table instead of local state only
- [ ] Move review votes (DECISIONS §8) into the database — they are per-browser
      localStorage today, so no two viewers see the same totals
- [x] `lobbyMovies` / `tvShows` / `genres` now come from the database via `lib/catalogue.ts`.
      Verified by inserting a title that existed only in Supabase and watching it get its own
      page. Genre counts are derived from whatever rows come back
- [ ] `top10` is still hardcoded — it needs real aggregate scores, so it waits for review volume
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
- [ ] Add every secret as a Vercel environment variable: the Supabase URL/anon key **plus
      `FANART_API_KEY` and `TMDB_API_KEY`** — both are in `.env.local`, which is gitignored,
      so a deploy without them silently loses posters and global search
- [ ] Deploy, then smoke-test the live production URL end to end
- [ ] (Optional) connect a custom domain

**How to verify Phase 6:** open the deployed Vercel URL in a private window and run the
Phase 4 pass against production, not localhost. Confirm posters load (the fanart key must
be set in Vercel's env vars, not just your `.env.local`), sign-up works against the real
Supabase project, and the build logs show no errors.

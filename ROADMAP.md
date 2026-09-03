# Hot Take — path to launch

Checklist from the whiteboard/notes session, ordered so each phase unblocks the next.
Build the whole app against the current mock/local data first — database creation
(Supabase) and publishing (Vercel) are deliberately last.

## Phase 0 — Decisions to lock in before building

- [ ] Confirm v1 scope vs. "later": which items below ship at launch vs. post-launch
- [ ] Design the rating system: replace the plain 1–5 dot picker with the "creative thumbs up" input from the notes
- [ ] Design the multi-layer score badge: an Oscars/Razzies-style icon overlay on top/bottom rated films (Rotten-Tomatoes-icon equivalent) — what score thresholds trigger which badge
- [ ] Decide what "easter eggs" means concretely (a few specific hidden interactions to build, not just the idea)
- [ ] Decide what "recap" means (per-user "your year in film" style recap? site-wide annual recap?)
- [ ] Confirm "Related movies" stays cut (crossed out in the notes) so it's not accidentally scoped back in
- [ ] Decide: is "Now showing" / cinema showtimes real data going forward, or does it stay a static decorative section?

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

## Phase 2 — Supporting pages the above needs

- [ ] Per-movie detail page (currently posters/titles don't link anywhere — needed for search results, genre browsing, and "your rating history" to have somewhere to point to)
- [ ] User profile page (handle, avatar, rating history, own reviews)
- [ ] 404 page
- [ ] Real destinations for the footer links (Community rules, Cinemas, Archive currently just anchor back to sections on the homepage)

## Phase 3 — Production hardening

- [ ] Form validation beyond native HTML `required` (e.g. review body length, rating bounds)
- [ ] Basic accessibility pass (modal focus trapping, keyboard nav on the poster rail, color contrast in both themes)
- [ ] Page-level SEO metadata (per-movie titles/descriptions, not just the one static root metadata block)
- [ ] Mobile/responsive pass — the current layout hasn't been checked below desktop widths
- [ ] Decide on analytics/error monitoring (optional)

## Phase 4 — QA (against mock data)

- [ ] Full manual pass: sign up → rate → review → search → filter → edit profile, in both themes
- [ ] Cross-browser check (Chrome/Firefox/Safari) and at least one real mobile device

## Phase 5 — Supabase: database creation & wiring

- [ ] Create the Supabase project (and a separate one for local/dev if the team wants staging isolation)
- [ ] Design tables: `profiles` (user handle/initials/avatar), `movies`, `genres`, `reviews` (rating + body + film + user), `cinemas`/`showtimes` (if kept real per Phase 0)
- [ ] Add columns needed for the decade/timeline search: movie `release_year`, indexed for range filtering
- [ ] Enable Supabase Auth (email/password at minimum; decide if social login is wanted)
- [ ] Write Row Level Security policies: anyone can read movies/reviews; only the authoring user can edit/delete their own review; only admins can add/edit movie entries
- [ ] Create a Storage bucket for movie posters and review stills, with an upload policy
- [ ] Seed the database with the current placeholder movie list (`lib/data.ts`) as real rows, or replace with real films
- [ ] Add `@supabase/supabase-js` (and `@supabase/ssr` for server components), `.env.local` with the project URL/anon key, keep it out of git
- [ ] Replace `ThemeUserProvider`'s fake localStorage auth with real Supabase Auth (sign up, log in, log out, session persistence, password reset)
- [ ] Replace the hardcoded `communityReviews` in `lib/data.ts` with a live query, and make `submitReview` insert into the `reviews` table instead of local state only
- [ ] Replace hardcoded `lobbyMovies` / `top10` / `genres` with queries once movies live in the database
- [ ] Replace poster/still `PlaceholderImage` usages with real images served from Supabase Storage
- [ ] Wire the Phase 1 features (add/edit movie, rating history) to the real database instead of mock state
- [ ] Add loading and error states for every Supabase call (fetch failures, empty states)
- [ ] Re-run the Phase 4 QA pass against the real backend, including confirming RLS actually blocks what it should (try editing someone else's review as a non-admin)

## Phase 6 — Publish (last)

- [ ] Merge the working branch into `dev`, then `dev` into `main` per the repo's branch convention
- [ ] Create the Vercel project, link the GitHub repo
- [ ] Add the Supabase URL/anon key (and any other secrets) as Vercel environment variables
- [ ] Deploy, then smoke-test the live production URL end to end
- [ ] (Optional) connect a custom domain

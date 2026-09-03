# Hot Take — Phase 0 decisions

The answers to ROADMAP.md Phase 0. This is the reference for what we agreed to build;
if something here turns out wrong, change it here first and let the roadmap follow.

---

## 1. v1 scope

**Lean launch.** Ship a small, coherent product and get it live, rather than holding the
launch for the whole notes list.

**In v1:**

- Search by film name
- Browse/filter by genre
- Per-movie detail page
- The heat-scale rating input (decision 2) — this replaces the current dot picker
- Write and read reviews
- User profile with rating history
- 404 page and real footer destinations

**After v1, in roughly this order:**

1. Score badges (decision 3) — needs real rating volume before the thresholds mean anything
2. Site-wide recap (decision 5)
3. Real showtimes (decision 7)
4. Decade/timeline slider
5. Easter eggs (decision 4)
6. Add/edit movie flows
7. Personal recap (decision 5)

Badges and recap are deliberately post-launch: both are *statistical* features that look
broken on a site with twelve reviews. They need traffic first.

---

## 2. Rating input — the heat scale

**Five flames, ignited left to right.** The notes said "creative thumbs up"; the heat
metaphor fits the name, reuses the flame already in the logo, and reads at a glance in a
list, which a rotating thumb does not.

| Value | Label |
| --- | --- |
| 1 | Ice cold |
| 2 | Lukewarm |
| 3 | Warm |
| 4 | Hot |
| 5 | Scorcher |

Rules:

- **Whole steps only.** No halves. Half-star ratings invite agonising over a distinction
  nobody reads, and the existing display component already fills on `i < score`.
- **One component, two modes.** A `readonly` mode replaces `RateDots` everywhere a score
  is displayed, and an interactive mode is the input. Two components would drift apart.
- **Colour comes from the existing palette** — `--rate` / `--rateoff` for the fill, with
  amber (`#EE9B3E`) reserved for a 5 so a Scorcher is visually distinct.
- **Accessibility is a hard requirement, not a polish item.** It must be a real
  `radiogroup` of five labelled inputs: arrow keys move between values, it is reachable by
  tab, and each option is announced by its label above ("Hot, 4 of 5"). Hover and drag are
  enhancements layered on top of that, never the only way to set a rating.

---

## 3. Score badges

An award overlay on the poster corner, at both ends of the scale.

Computed from the **aggregate community score (0–100)**, gated on a minimum number of
ratings:

| Badge | Score | Minimum ratings |
| --- | --- | --- |
| **Golden Reel** | ≥ 90 | 50 |
| **Certified Hot** | ≥ 75 | 25 |
| *(no badge)* | 26–74 | — |
| **Cold Take** | ≤ 25 | 25 |
| **The Turkey** | ≤ 10 | 50 |

The minimum-ratings gate is the point of this design. Without it, a film with two
five-flame ratings from its own director shows a Golden Reel. A film that has not cleared
the gate shows **no badge at all** — not a provisional one.

"Multi-layer" from the notes means the badge is an icon plus a ribbon carrying the score,
so it reads as an award seal rather than a flat sticker.

---

## 4. Easter eggs

**Random and site-wide**, not four fixed interactions bolted to particular spots. An
`EasterEggProvider` mounts once in the root layout, so *every* page takes part, and each
page view rolls the dice.

### The mechanism

- **One roll per page view**, at roughly **5%**. Rare enough to feel like a find, common
  enough that people actually hit it.
- **At most one egg per session**, with a cooldown after it fires. The joke is finding
  one; finding six is a bug.
- Eggs are **page-agnostic** — they play against the header, the backdrop, or the
  viewport, all of which exist on every route. No egg may depend on being on a particular
  page.

### The pool

1. **Projector flicker.** The page dims and flickers like a failing bulb for about a
   second, then recovers.
2. **The unspooling tail.** The logo's film-strip tail unspools across the header, then
   snaps back.
3. **Late show.** Only eligible between 00:00 and 04:00 local: the tagline becomes "the
   late show" and the backdrop dims. Skipped outside those hours — the roll simply passes
   to another egg rather than wasting itself.
4. **Ghost frame.** A single translucent frame of the mark drifts across the page and
   fades.
5. **Rogue kernel.** One piece of popcorn bounces across the viewport and off the edge.

### Two that stay earned, not random

These fire on a deliberate action, because randomising them would break the joke:

- **Roast mode** — typing `roast` in the search box returns the *lowest*-rated films.
- **Cold streak** — three "Ice cold" ratings in a row raises "Rough night at the movies?"

### Guardrails

Randomness that interrupts is a bug, not a delight. Every egg must:

- be purely decorative, and **never block a click, a keystroke, or a form submission**
- **not fire while a modal is open** or a review is being written
- respect `prefers-reduced-motion` — no motion egg for users who asked for less of it
- clean itself up, persisting nothing

Deliberately excluded: anything awarding points, unlocking content, or stored per user.
Easter eggs are jokes, not a progression system.

---

## 5. Recap

**Both, site-wide first.**

**"Hot Take's Year"** ships first because it works from aggregate data on day one:
community top 10, the most divisive film (highest rating variance, not lowest score), the
most-roasted, and total reviews written. Its own route, one per year.

**"Your Year in Film"** — films rated, hours watched, top genre, your harshest and kindest
review — comes later. It needs a year of history, and it should refuse to render for a
user with fewer than 10 rated films rather than showing a sad empty page.

---

## 6. Related movies — cut, then reversed

**Originally cut**, as crossed out in the notes: genre browsing and search were judged
enough discovery for v1.

**Reversed.** Building the movie profile page made the gap obvious — a detail page that
ends in nothing gives the reader no next film, and the "where do I go now?" problem the
original cut waved away is much sharper on a detail page than on the homepage. Shipped as
`components/SimilarMovies.tsx`.

Recorded here rather than quietly amended, because the original decision was explicitly
"do not scope this back in without a new decision". This is that new decision.

---

## 7. Showtimes — real data, but not at v1

"Now showing" becomes **real data**, not decoration. It does not ship at v1, because the
lean launch defers everything that is not core to rating and reviewing.

Open questions to settle before building it — none blocking v1:

- Which provider, and what it costs
- How location is handled: ask for it, infer it, or pick one city to start
- What the section does in regions the provider does not cover — it must degrade to
  something honest, not an empty box

Until then the section stays visibly decorative. It must not imply bookable screenings.

---

## 8. Guest posting and review voting

Added after the original seven, on request.

### Anyone can post without an account

Requiring sign-up before a first review is the single biggest thing standing between a
visitor and the point of the site. "Post as guest" in the auth modal creates a session
with no email and no password, and a guest can rate and review exactly like a signed-in
user.

A guest handle carries a random suffix (`@guest-4f2a`) so two guests in the same thread
are still tellable apart, and the user record is flagged `isGuest` so the interface can be
honest about the trade: a guest's takes live in that browser only and are not recoverable.
Signing up is what makes them yours and portable.

**This has a Phase 5 consequence.** Supabase auth and the RLS policies must account for
guests, not just registered users — anonymous sign-in, and an ownership rule that still
works when the author has no account. Deciding that late would mean either dropping guest
posting or reworking the policies.

### Reviews can be voted up or down

Thumbs up/down on each review, one vote per review per browser. Clicking the active thumb
again clears the vote, so a misclick is undoable.

The displayed count is the seeded total plus the viewer's own vote, so the number reacts
immediately instead of appearing stuck. Real aggregate counts need the database and arrive
in Phase 5 — until then the votes are local to the browser and are not shared between
viewers.

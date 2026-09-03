-- Hot Take — sample reviews
--
-- Run after schema.sql. Safe to re-run: it clears its own seeded rows first, so
-- it will not pile up duplicates, and it leaves real user reviews alone.
--
-- These are guest reviews (author_id null, guest_handle set) because seeding
-- authored ones would mean inventing auth.users rows, and the point here is to
-- have something on the page, not to fake accounts.
--
-- Titles are matched by slug rather than hardcoded uuids, so this works against
-- any project where schema.sql has been run.

-- Remove previously seeded rows, identified by the "@seed_" handle prefix.
delete from public.reviews where guest_handle like '@seed\_%';

insert into public.reviews (title_id, guest_handle, score, body)
select t.id, v.handle, v.score, v.body
from (values
  -- Films
  ('shawshank-redemption', '@seed_dana',    5, 'The patience of it is the whole point. Two hours of very little happening, and then you realise all of it was happening.'),
  ('shawshank-redemption', '@seed_ravi',    4, 'Narration does a lot of heavy lifting, and it earns it. The rooftop beers scene is perfect.'),
  ('the-godfather',        '@seed_ellis',   5, 'Every frame looks like a painting someone is about to be shot in. The baptism sequence has never been topped.'),
  ('the-godfather',        '@seed_marta',   5, 'A film about a man becoming exactly what his father hoped he never would, and never once saying so out loud.'),
  ('the-dark-knight',      '@seed_kofi',    5, 'The interrogation scene is the whole film in five minutes. Everything after it is consequence.'),
  ('the-dark-knight',      '@seed_lena',    4, 'The ferry sequence asks a real question and then loses its nerve slightly. Still the best of them.'),
  ('pulp-fiction',         '@seed_ravi',    4, 'Structure as a magic trick. Rearranged chronologically it would be half as good, which tells you the order is the story.'),
  ('parasite',             '@seed_dana',    5, 'Half a con, half the bill coming due. The house does more character work than most scripts manage.'),
  ('parasite',             '@seed_toma',    5, 'The rain sequence reframes everything you laughed at in the first hour. Devastating and very funny.'),
  ('spirited-away',        '@seed_lena',    5, 'The bathhouse feels like a place that existed before the film and kept going after it. Nothing is explained and nothing needs to be.'),
  ('interstellar',         '@seed_kofi',    3, 'The docking scene and the water planet are extraordinary. Every time someone explains the plot aloud it deflates.'),
  ('interstellar',         '@seed_marta',   4, 'Sentimental in a way I did not resist as much as I expected. The bookshelf still does not work for me.'),
  ('get-out',              '@seed_toma',    4, 'Funny for an hour, then not funny at all, and the hinge between the two is beautifully judged.'),
  ('blade-runner-2049',    '@seed_ellis',   5, 'Slow the way weather is slow. See it as big as you can and let the sound design do the rest.'),
  ('oppenheimer',          '@seed_dana',    4, 'Three hours of men in rooms, and the tension never drops. The sound cuts out at exactly the right moment.'),
  ('oppenheimer',          '@seed_ravi',    3, 'Technically stunning, emotionally at arm''s length. The hearing framing keeps interrupting the better film inside it.'),

  -- Series
  ('breaking-bad',         '@seed_jo',      5, 'The rare show where the pilot''s promise and the finale''s payoff are the same idea, carried the whole way without blinking.'),
  ('breaking-bad',         '@seed_marta',   5, 'Season four is the best sustained run of television I have watched. The plotting never cheats.'),
  ('the-sopranos',         '@seed_ellis',   5, 'Invented most of what came after it and is still sharper than nearly all of it. The dream episodes are worth the arguments.'),
  ('the-wire',             '@seed_kofi',    5, 'Season two is the one people skip and the one that explains the whole show. Stay with it.'),
  ('chernobyl',            '@seed_lena',    5, 'Five episodes, no fat on any of them. It understands the horror is procedural, not supernatural.'),
  ('severance',            '@seed_toma',    4, 'Production design doing enormous amounts of storytelling. Those corridors say more about the company than the dialogue does.'),
  ('severance',            '@seed_jo',      5, 'The premise could have been a single clever episode. That it sustains two seasons is the achievement.'),
  ('stranger-things',      '@seed_dana',    4, 'The first season is a tight little film. Everything since has been a bigger, looser version of it.'),
  ('game-of-thrones',      '@seed_ravi',    3, 'Astonishing for five seasons, then it ran out of book and never found a substitute. Worth watching, worth stopping.'),
  ('the-office',           '@seed_marta',   4, 'The first season is a shakier copy of the British one. From season two it becomes its own, warmer thing.')
) as v(slug, handle, score, body)
join public.titles t on t.slug = v.slug;

-- What landed, per title.
select t.kind, t.slug, count(r.id) as reviews, round(avg(r.score), 2) as avg_score
from public.titles t
left join public.reviews r on r.title_id = t.id
group by t.kind, t.slug
order by t.kind, t.slug;

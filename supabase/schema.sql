-- Hot Take — Supabase schema
--
-- Paste into the Supabase SQL editor and run. It is idempotent: safe to run
-- again after editing.
--
-- This mirrors what the app holds in lib/data.ts and ThemeUserProvider today, so
-- Phase 5 becomes "swap the data source" rather than "design the data model".
--
-- Two things drive the shape:
--   1. fanart.tv has no title search, so every title carries the external id its
--      artwork is fetched with: tmdb_id for films, tvdb_id for series.
--   2. Guests can post without an account (DECISIONS §8). Every policy below has
--      to work for an author with no registered identity, which is why reviews
--      carry both a nullable author_id and a guest_handle.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type media_kind as enum ('movie', 'show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vote_kind as enum ('up', 'down');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles — one row per registered user, keyed to Supabase auth
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  handle      text not null unique,
  display_name text not null,
  initials    text not null,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Registered users. Guests have no row here; their reviews carry guest_handle instead.';

-- Create the profile automatically whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, handle, display_name, initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', '@user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'you'), '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'initials', 'HT')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- titles — films and series in one table
-- ---------------------------------------------------------------------------
-- One table rather than two: they are queried together (search and the genre
-- filter both span films and shows) and every difference between them is a
-- nullable column. Two tables would mean a union on every read.

create table if not exists public.titles (
  id            uuid primary key default gen_random_uuid(),
  kind          media_kind not null,
  slug          text not null unique,
  title         text not null,
  genre         text not null,
  summary       text not null default '',
  score         smallint not null default 0 check (score between 0 and 5),

  -- Artwork ids. Exactly one is set, according to kind (enforced below).
  tmdb_id       integer,
  tvdb_id       integer,

  -- Film-only
  year          integer,
  runtime_min   integer,
  director      text,
  release_date  text,

  -- Series-only
  first_aired       integer,
  first_aired_date  text,
  creator           text,
  seasons           smallint,
  episodes          integer,
  network           text,

  created_at    timestamptz not null default now(),

  constraint titles_artwork_id_matches_kind check (
    (kind = 'movie' and tmdb_id is not null and tvdb_id is null) or
    (kind = 'show'  and tvdb_id is not null and tmdb_id is null)
  )
);

-- The decade/timeline filter on the roadmap does range queries on the release
-- year, so index the column it will actually filter on.
create index if not exists titles_year_idx        on public.titles (year);
create index if not exists titles_first_aired_idx on public.titles (first_aired);
create index if not exists titles_genre_idx       on public.titles (genre);
create index if not exists titles_kind_idx        on public.titles (kind);

-- Case-insensitive title search. pg_trgm makes `ilike '%term%'` use an index
-- instead of scanning every row.
create extension if not exists pg_trgm;
create index if not exists titles_title_trgm_idx on public.titles using gin (title gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
-- author_id is null for a guest. guest_handle carries the "@guest-4f2a" name so
-- two guests in a thread stay tellable apart, and exactly one of the two is set.

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  title_id     uuid not null references public.titles (id) on delete cascade,
  author_id    uuid references public.profiles (id) on delete cascade,
  guest_handle text,
  score        smallint not null check (score between 1 and 5),
  body         text not null check (char_length(body) between 1 and 5000),
  created_at   timestamptz not null default now(),

  constraint reviews_author_or_guest check (
    (author_id is not null and guest_handle is null) or
    (author_id is null     and guest_handle is not null)
  )
);

create index if not exists reviews_title_idx  on public.reviews (title_id, created_at desc);
create index if not exists reviews_author_idx on public.reviews (author_id);

-- One review per person per title, for registered users. Guests are not
-- constrained, because there is no identity to constrain them by.
create unique index if not exists reviews_one_per_user_per_title
  on public.reviews (title_id, author_id)
  where author_id is not null;

-- ---------------------------------------------------------------------------
-- review_votes — the thumbs up/down
-- ---------------------------------------------------------------------------

create table if not exists public.review_votes (
  review_id  uuid not null references public.reviews (id) on delete cascade,
  voter_id   uuid not null references public.profiles (id) on delete cascade,
  vote       vote_kind not null,
  created_at timestamptz not null default now(),
  primary key (review_id, voter_id)
);

create index if not exists review_votes_review_idx on public.review_votes (review_id);

-- Vote totals, so the UI reads one row instead of counting on every render.
create or replace view public.review_vote_totals as
select
  r.id as review_id,
  count(*) filter (where v.vote = 'up')   as upvotes,
  count(*) filter (where v.vote = 'down') as downvotes
from public.reviews r
left join public.review_votes v on v.review_id = r.id
group by r.id;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles     enable row level security;
alter table public.titles       enable row level security;
alter table public.reviews      enable row level security;
alter table public.review_votes enable row level security;

-- profiles: world-readable, self-writable.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- titles: anyone reads; only admins write. This is the "add/edit movie" flow
-- from Phase 1 being admin-gated at the database rather than in the UI, where it
-- could be bypassed.
drop policy if exists titles_read on public.titles;
create policy titles_read on public.titles
  for select using (true);

drop policy if exists titles_admin_write on public.titles;
create policy titles_admin_write on public.titles
  for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- reviews: anyone reads.
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews
  for select using (true);

-- Anyone may post, including guests. A signed-in user must claim their own
-- review; an anonymous poster must leave author_id null and supply a handle.
-- Requires anonymous sign-in to be enabled in Supabase Auth settings.
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews
  for insert
  with check (
    (author_id is not null and author_id = auth.uid())
    or (author_id is null and guest_handle is not null)
  );

-- Only the author can change or remove their own review. A guest review has no
-- author, so nobody can edit it afterwards -- that is the trade for not signing
-- up, and it is why the UI says a guest's takes are not recoverable.
drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
  for update using (author_id is not null and author_id = auth.uid())
  with check (author_id is not null and author_id = auth.uid());

drop policy if exists reviews_delete_own on public.reviews;
create policy reviews_delete_own on public.reviews
  for delete using (
    (author_id is not null and author_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- votes: anyone reads; you may only cast, change or clear your own.
drop policy if exists review_votes_read on public.review_votes;
create policy review_votes_read on public.review_votes
  for select using (true);

drop policy if exists review_votes_write_own on public.review_votes;
create policy review_votes_write_own on public.review_votes
  for all using (auth.uid() = voter_id) with check (auth.uid() = voter_id);

-- ---------------------------------------------------------------------------
-- Seed — the current catalogue
-- ---------------------------------------------------------------------------
-- Same ten films and eight series the app ships with, ids included so posters
-- keep resolving the moment the app reads from here instead of lib/data.ts.

insert into public.titles
  (kind, slug, title, genre, year, runtime_min, score, tmdb_id, director, release_date, summary)
values
  ('movie','shawshank-redemption','The Shawshank Redemption','Drama',1994,142,5,278,'Frank Darabont','September 23, 1994','A banker convicted of a murder he didn''t commit spends two decades in Shawshank State Penitentiary, forming an unlikely friendship with a fellow inmate and chipping away, patiently, at a way out.'),
  ('movie','the-godfather','The Godfather','Classics',1972,175,5,238,'Francis Ford Coppola','March 24, 1972','The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant youngest son, who is drawn deeper into the family business than he ever intended to go.'),
  ('movie','the-dark-knight','The Dark Knight','Thriller',2008,152,5,155,'Christopher Nolan','July 18, 2008','Batman raises the stakes in his war on crime with the help of Lieutenant Gordon and DA Harvey Dent, but a rising criminal mastermind known as the Joker throws Gotham into chaos.'),
  ('movie','pulp-fiction','Pulp Fiction','Crime',1994,154,4,680,'Quentin Tarantino','October 14, 1994','The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption, told wildly out of order.'),
  ('movie','parasite','Parasite','Thriller',2019,132,5,496243,'Bong Joon-ho','May 30, 2019','A poor family schemes to become employed by a wealthy household by posing as unrelated, highly qualified individuals, until the arrangement curdles.'),
  ('movie','spirited-away','Spirited Away','Animation',2001,125,5,129,'Hayao Miyazaki','July 20, 2001','A sullen ten-year-old wanders into a world of spirits and must work in a bathhouse for the gods to free her parents and find her way home.'),
  ('movie','interstellar','Interstellar','Epic',2014,169,4,157336,'Christopher Nolan','November 7, 2014','With Earth failing, a former pilot leads a mission through a wormhole to find humanity a new home, trading years of his daughter''s life for the attempt.'),
  ('movie','get-out','Get Out','Horror',2017,104,4,419430,'Jordan Peele','February 24, 2017','A young Black man visits his white girlfriend''s family estate for the weekend and finds that their relentless politeness is hiding something far worse.'),
  ('movie','blade-runner-2049','Blade Runner 2049','Drama',2017,164,4,335984,'Denis Villeneuve','October 6, 2017','A replicant blade runner uncovers a secret capable of breaking what is left of society, and goes looking for a man who disappeared thirty years ago.'),
  ('movie','oppenheimer','Oppenheimer','Drama',2023,180,4,872585,'Christopher Nolan','July 21, 2023','The physicist who led the Manhattan Project builds the bomb, and then spends the rest of his life inside what he made.')
on conflict (slug) do nothing;

insert into public.titles
  (kind, slug, title, genre, first_aired, first_aired_date, seasons, episodes, network, score, tvdb_id, creator, summary)
values
  ('show','breaking-bad','Breaking Bad','Crime',2008,'January 20, 2008',5,62,'AMC',5,81189,'Vince Gilligan','A high school chemistry teacher diagnosed with terminal cancer starts cooking methamphetamine to provide for his family, and discovers he is far better at it, and far worse a man, than anyone suspected.'),
  ('show','the-sopranos','The Sopranos','Drama',1999,'January 10, 1999',6,86,'HBO',5,75299,'David Chase','A New Jersey mob boss begins seeing a psychiatrist for panic attacks, and the two halves of his life refuse to stay apart.'),
  ('show','the-wire','The Wire','Crime',2002,'June 2, 2002',5,60,'HBO',5,79126,'David Simon','Baltimore seen from every side at once, in a portrait of a city where the institutions fail everyone equally.'),
  ('show','chernobyl','Chernobyl','Drama',2019,'May 6, 2019',1,5,'HBO',5,360893,'Craig Mazin','The 1986 reactor explosion and the months that followed, told through the people sent to contain it and the cost of the lies told around it.'),
  ('show','severance','Severance','Thriller',2022,'February 18, 2022',2,19,'Apple TV+',4,371980,'Dan Erickson','Employees undergo a procedure splitting their work memories from their personal ones, until the two selves start trying to reach each other.'),
  ('show','stranger-things','Stranger Things','Horror',2016,'July 15, 2016',4,42,'Netflix',4,305288,'The Duffer Brothers','When a boy vanishes from a small Indiana town in 1983, his friends uncover a government experiment and a door to somewhere that should have stayed shut.'),
  ('show','game-of-thrones','Game of Thrones','Epic',2011,'April 17, 2011',8,73,'HBO',4,121361,'David Benioff and D. B. Weiss','Noble families wage war for a continent''s throne while an older, colder threat gathers beyond the wall in the north.'),
  ('show','the-office','The Office (US)','Comedy',2005,'March 24, 2005',9,201,'NBC',4,73244,'Greg Daniels','A documentary crew films the staff of a failing paper company in Scranton, Pennsylvania, and the branch manager who wants, more than anything, to be liked.')
on conflict (slug) do nothing;

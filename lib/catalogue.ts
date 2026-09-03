import { getSupabase, hasSupabase } from "@/lib/supabase";
import {
  lobbyMovies,
  tvShows,
  communityReviews,
  showReviews,
  type Movie,
  type Show,
  type CommunityReview,
} from "@/lib/data";

// Reads the catalogue from Supabase, falling back to the hardcoded lists in
// lib/data.ts whenever the database is unconfigured or unreachable.
//
// The fallback is the point of this module. A review site whose database is down
// should still show films, and local development should not require credentials.
// Rows are mapped onto the existing Movie and Show types so nothing downstream
// has to know where the data came from.

type TitleRow = {
  id: string;
  kind: "movie" | "show";
  slug: string;
  title: string;
  genre: string;
  summary: string | null;
  score: number | null;
  tmdb_id: number | null;
  tvdb_id: number | null;
  year: number | null;
  runtime_min: number | null;
  director: string | null;
  release_date: string | null;
  first_aired: number | null;
  first_aired_date: string | null;
  creator: string | null;
  seasons: number | null;
  episodes: number | null;
  network: string | null;
};

const TITLE_COLUMNS =
  "id,kind,slug,title,genre,summary,score,tmdb_id,tvdb_id,year,runtime_min,director,release_date,first_aired,first_aired_date,creator,seasons,episodes,network";

function toMovie(r: TitleRow): Movie {
  return {
    slug: r.slug,
    title: r.title,
    genre: r.genre,
    year: r.year ?? 0,
    runtimeMin: r.runtime_min ?? 0,
    score: r.score ?? 0,
    tmdbId: r.tmdb_id ?? 0,
    director: r.director ?? "",
    releaseDate: r.release_date ?? "",
    summary: r.summary ?? "",
  };
}

function toShow(r: TitleRow): Show {
  return {
    slug: r.slug,
    title: r.title,
    genre: r.genre,
    firstAired: r.first_aired ?? 0,
    seasons: r.seasons ?? 0,
    score: r.score ?? 0,
    tvdbId: r.tvdb_id ?? 0,
    creator: r.creator ?? "",
    firstAiredDate: r.first_aired_date ?? "",
    summary: r.summary ?? "",
    network: r.network ?? "",
    episodes: r.episodes ?? 0,
  };
}

async function fetchTitles(kind: "movie" | "show"): Promise<TitleRow[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("titles")
      .select(TITLE_COLUMNS)
      .eq("kind", kind)
      .order("score", { ascending: false })
      .order("title");
    if (error) {
      console.warn(`[catalogue] ${kind} query failed:`, error.message);
      return null;
    }
    return (data as TitleRow[]) ?? null;
  } catch (err) {
    console.warn(`[catalogue] ${kind} query threw:`, err);
    return null;
  }
}

export async function getMovies(): Promise<Movie[]> {
  const rows = await fetchTitles("movie");
  if (!rows || rows.length === 0) return lobbyMovies;
  return rows.map(toMovie);
}

export async function getShows(): Promise<Show[]> {
  const rows = await fetchTitles("show");
  if (!rows || rows.length === 0) return tvShows;
  return rows.map(toShow);
}

/**
 * A miss in the cached list is checked against the database directly before the
 * caller gives up. A title added since the list was cached would otherwise 404,
 * and Next would cache that 404 — which is how a real title ended up
 * unreachable in production.
 */
async function fetchTitleBySlug(slug: string, kind: "movie" | "show"): Promise<TitleRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("titles")
      .select(TITLE_COLUMNS)
      .eq("slug", slug)
      .eq("kind", kind)
      .maybeSingle();
    if (error || !data) return null;
    return data as TitleRow;
  } catch {
    return null;
  }
}

export async function getMovie(slug: string): Promise<Movie | undefined> {
  const fromList = (await getMovies()).find((m) => m.slug === slug);
  if (fromList) return fromList;
  const row = await fetchTitleBySlug(slug, "movie");
  return row ? toMovie(row) : undefined;
}

export async function getShow(slug: string): Promise<Show | undefined> {
  const fromList = (await getShows()).find((s) => s.slug === slug);
  if (fromList) return fromList;
  const row = await fetchTitleBySlug(slug, "show");
  return row ? toShow(row) : undefined;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

type ReviewRow = {
  id: string;
  score: number;
  body: string;
  created_at: string;
  guest_handle: string | null;
  author_id: string | null;
  profiles: { handle: string; initials: string } | null;
};

function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/**
 * Reviews for one title, shaped as CommunityReview so the existing components
 * render them unchanged. Falls back to the seeded lists when unavailable.
 */
export async function getReviewsForSlug(slug: string): Promise<CommunityReview[]> {
  const seeded = [...communityReviews, ...showReviews].filter((r) => r.slug === slug);

  const supabase = getSupabase();
  if (!supabase) return seeded;

  try {
    const { data: title, error: titleErr } = await supabase
      .from("titles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (titleErr || !title) return seeded;

    const { data, error } = await supabase
      .from("reviews")
      // The FK is named explicitly: PostgREST can reach profiles from reviews two
      // ways (directly, and through review_votes) and refuses to guess, so an
      // unqualified embed fails with PGRST201.
      .select("id,score,body,created_at,guest_handle,author_id,profiles!reviews_author_id_fkey(handle,initials)")
      .eq("title_id", (title as { id: string }).id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.warn("[catalogue] reviews query failed:", error.message);
      return seeded;
    }

    const rows = (data as unknown as ReviewRow[]) ?? [];
    // Nothing in the database yet means the seeded copy is still the best thing
    // to show, rather than an empty section.
    if (rows.length === 0) return seeded;

    return rows.map((r) => ({
      id: r.id,
      film: "",
      slug,
      tag: r.score >= 4 ? ("Top rated" as const) : ("Mixed" as const),
      score: `${r.score} / 5`,
      body: r.body,
      initials: r.profiles?.initials ?? "G",
      byline: `${r.profiles?.handle ?? r.guest_handle ?? "@guest"} · ${relativeDay(r.created_at)}`,
      upvotes: 0,
      downvotes: 0,
    }));
  } catch (err) {
    console.warn("[catalogue] reviews query threw:", err);
    return seeded;
  }
}

export { hasSupabase };

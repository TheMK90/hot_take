import "server-only";

// Catalogue search against TMDb.
//
// This exists because fanart.tv cannot search: it is keyed strictly by TMDb id
// (films) and TVDB id (series), and a title-based lookup returns an empty object.
// TMDb provides the search and the ids; fanart stays responsible for the artwork
// on our own catalogue pages, and the two fit together because fanart is keyed by
// TMDb ids for films in the first place.
//
// Server-only, like lib/fanart.ts — the key is read here and never shipped to the
// browser. Callers reach this through /api/search.

const BASE = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w185";

// Search results move (new films appear, popularity reorders them), but not
// minute to minute. An hour keeps us far inside TMDb's rate limit.
const REVALIDATE_SECONDS = 60 * 60;

export type SearchHit = {
  kind: "movie" | "tv";
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
  overview: string;
};

type TmdbResult = {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
  popularity?: number;
};

let warnedAboutMissingKey = false;

export function hasTmdbKey(): boolean {
  return Boolean(process.env.TMDB_API_KEY);
}

function apiKey(): string | null {
  const key = process.env.TMDB_API_KEY;
  if (key) return key;
  if (!warnedAboutMissingKey) {
    warnedAboutMissingKey = true;
    console.warn(
      "[tmdb] TMDB_API_KEY is not set - global search is disabled and only the local " +
        "catalogue is searched. Add a free key from https://www.themoviedb.org/settings/api " +
        "to .env.local."
    );
  }
  return null;
}

function yearFrom(date: string | undefined): number | null {
  if (!date) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) && y > 0 ? y : null;
}

/**
 * Search films and series by title. Returns [] rather than throwing on any
 * failure — search degrading to the local catalogue is far better than a search
 * box that errors.
 */
export async function searchTitles(query: string, limit = 12): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const key = apiKey();
  if (!key) return [];

  try {
    const url =
      `${BASE}/search/multi?api_key=${key}` +
      `&query=${encodeURIComponent(q)}&include_adult=false&page=1`;
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

    if (!res.ok) {
      console.warn(`[tmdb] search returned HTTP ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { results?: TmdbResult[] };
    return (data.results ?? [])
      // multi search also returns people, which have nothing to review.
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, limit)
      .map((r) => ({
        kind: r.media_type === "tv" ? ("tv" as const) : ("movie" as const),
        tmdbId: r.id,
        title: r.title ?? r.name ?? "Untitled",
        year: yearFrom(r.release_date ?? r.first_air_date),
        posterUrl: r.poster_path ? `${IMAGE}${r.poster_path}` : null,
        overview: r.overview ?? "",
      }));
  } catch (err) {
    console.warn("[tmdb] search failed:", err);
    return [];
  }
}

/**
 * A series' TVDB id, which is what fanart.tv needs for show artwork. Separate
 * call, so only fetch it when actually rendering a show's own page — not for
 * every row of a search dropdown.
 */
export async function getShowTvdbId(tmdbId: number): Promise<number | null> {
  const key = apiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${BASE}/tv/${tmdbId}/external_ids?api_key=${key}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { tvdb_id?: number | null };
    return data.tvdb_id ?? null;
  } catch {
    return null;
  }
}

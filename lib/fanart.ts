import "server-only";

// Poster lookup against fanart.tv.
//
// Two things shape this module. First, the API key must never reach the
// browser, so everything here is server-only and callers pass finished image
// URLs down to client components. Second, fanart.tv has no title search -- it
// is keyed strictly by TMDb/IMDb id for movies and TVDB id for shows, which is
// why every catalogue entry in lib/data.ts carries an id.
//
// Artwork is decorative: any failure here resolves to null and the caller
// falls back to PlaceholderImage. A poster outage must never break the page.

const BASE = "https://webservice.fanart.tv/v3";

// Artwork for a given title changes rarely, so cache hard. Next dedupes and
// persists these across requests, which keeps us well inside fanart.tv's
// personal-key rate limit.
const REVALIDATE_SECONDS = 60 * 60 * 24;

export type MediaKind = "movie" | "tv";

type FanartImage = {
  id: string;
  url: string;
  lang: string;
  likes: string;
};

type FanartResponse = Record<string, unknown> & {
  name?: string;
  movieposter?: FanartImage[];
  tvposter?: FanartImage[];
  moviethumb?: FanartImage[];
  tvthumb?: FanartImage[];
  moviebackground?: FanartImage[];
  showbackground?: FanartImage[];
};

const ENDPOINT: Record<MediaKind, string> = { movie: "movies", tv: "tv" };

const POSTER_KEY: Record<MediaKind, keyof FanartResponse> = {
  movie: "movieposter",
  tv: "tvposter",
};

// Wide 16:9 art, used for the review cards rather than the 2:3 poster rail.
const BACKDROP_KEYS: Record<MediaKind, Array<keyof FanartResponse>> = {
  movie: ["moviethumb", "moviebackground"],
  tv: ["tvthumb", "showbackground"],
};

let warnedAboutMissingKey = false;

function apiKey(): string | null {
  const key = process.env.FANART_API_KEY;
  if (key) return key;
  if (!warnedAboutMissingKey) {
    warnedAboutMissingKey = true;
    console.warn(
      "[fanart] FANART_API_KEY is not set - posters will fall back to placeholders. " +
        "Copy .env.example to .env.local and add your key."
    );
  }
  return null;
}

/**
 * fanart.tv returns every poster anyone has uploaded, in every language. Prefer
 * English, then language-neutral (fanart marks these "00"), and within the
 * chosen pool take the community's most-liked image.
 */
function pickBest(images: FanartImage[] | undefined): string | null {
  if (!images || images.length === 0) return null;

  const english = images.filter((i) => i.lang === "en");
  const neutral = images.filter((i) => i.lang === "00" || i.lang === "");
  const pool = english.length > 0 ? english : neutral.length > 0 ? neutral : images;

  const best = pool.reduce((a, b) =>
    (Number(b.likes) || 0) > (Number(a.likes) || 0) ? b : a
  );
  return best.url ?? null;
}

async function fetchArtwork(kind: MediaKind, id: number | string): Promise<FanartResponse | null> {
  const key = apiKey();
  if (!key) return null;

  try {
    const res = await fetch(`${BASE}/${ENDPOINT[kind]}/${id}?api_key=${key}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    // 404 just means nobody has uploaded artwork for this title yet, which is
    // an ordinary outcome rather than an error worth shouting about.
    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn(`[fanart] ${kind} ${id} returned HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as FanartResponse;
  } catch (err) {
    console.warn(`[fanart] ${kind} ${id} lookup failed:`, err);
    return null;
  }
}

/** Best 2:3 poster for a title, or null if there is none. */
export async function getPoster(kind: MediaKind, id: number | string): Promise<string | null> {
  const data = await fetchArtwork(kind, id);
  if (!data) return null;
  return pickBest(data[POSTER_KEY[kind]] as FanartImage[] | undefined);
}

/** Best wide/landscape art for a title, falling back to the poster. */
export async function getBackdrop(kind: MediaKind, id: number | string): Promise<string | null> {
  const data = await fetchArtwork(kind, id);
  if (!data) return null;

  for (const key of BACKDROP_KEYS[kind]) {
    const url = pickBest(data[key] as FanartImage[] | undefined);
    if (url) return url;
  }
  return pickBest(data[POSTER_KEY[kind]] as FanartImage[] | undefined);
}

export type ArtLookup = { kind: MediaKind; id: number | string };

/**
 * Resolve many posters at once, keyed by whatever string the caller uses to
 * identify the title (a slug, usually). Lookups run in parallel and failures
 * are isolated -- one missing poster never takes down the others.
 */
export async function getPosterMap(
  items: Record<string, ArtLookup>
): Promise<Record<string, string | null>> {
  const entries = Object.entries(items);
  const urls = await Promise.all(entries.map(([, it]) => getPoster(it.kind, it.id)));
  return Object.fromEntries(entries.map(([key], i) => [key, urls[i]]));
}

export async function getBackdropMap(
  items: Record<string, ArtLookup>
): Promise<Record<string, string | null>> {
  const entries = Object.entries(items);
  const urls = await Promise.all(entries.map(([, it]) => getBackdrop(it.kind, it.id)));
  return Object.fromEntries(entries.map(([key], i) => [key, urls[i]]));
}

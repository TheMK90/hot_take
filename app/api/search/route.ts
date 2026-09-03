import { NextResponse } from "next/server";
import { searchTitles, hasTmdbKey } from "@/lib/tmdb";
import { matchesQuery } from "@/lib/data";
import { getMovies, getShows } from "@/lib/catalogue";

// Search endpoint for the header box. It exists so the TMDb key stays on the
// server; the browser only ever sees results.
//
// Two sources, deliberately separate in the response:
//   catalogue — titles we hold, which have their own pages and artwork
//   external  — anything else on TMDb, reviewable but without a page of its own
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ catalogue: [], external: [], tmdbEnabled: hasTmdbKey() });
  }

  const [movies, shows] = await Promise.all([getMovies(), getShows()]);

  const catalogue = [
    ...movies
      .filter((m) => matchesQuery(m.title, query))
      .map((m) => ({ kind: "movie" as const, slug: m.slug, title: m.title, year: m.year })),
    ...shows
      .filter((s) => matchesQuery(s.title, query))
      .map((s) => ({ kind: "tv" as const, slug: s.slug, title: s.title, year: s.firstAired })),
  ].slice(0, 8);

  const hits = await searchTitles(query);

  // Anything already in the catalogue is shown from the catalogue, with its own
  // page — no point offering the same film twice under two headings.
  const known = new Set([...movies, ...shows].map((t) => t.title.toLowerCase()));
  const external = hits.filter((h) => !known.has(h.title.toLowerCase())).slice(0, 8);

  return NextResponse.json({ catalogue, external, tmdbEnabled: hasTmdbKey() });
}

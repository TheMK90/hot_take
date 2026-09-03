import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getTitleDetails } from "@/lib/tmdb";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Adds a title to the catalogue on demand, so a film found through global search
// stops being a dead end and gets a real page.
//
// The write goes through the service-role client because `titles_admin_write`
// refuses anonymous inserts by design — otherwise anyone holding the public anon
// key could write straight into the catalogue. Instead the server does it, and
// only after TMDb has confirmed the id is real, so the worst a caller can do is
// add a genuine film.

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "title";
}

export async function POST(request: Request) {
  let payload: { kind?: string; tmdbId?: number };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const kind = payload.kind === "tv" ? "tv" : payload.kind === "movie" ? "movie" : null;
  const tmdbId = Number(payload.tmdbId);
  if (!kind || !Number.isInteger(tmdbId) || tmdbId <= 0) {
    return NextResponse.json({ error: "kind must be movie or tv, with a numeric tmdbId." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "The catalogue database is not configured on this deployment." },
      { status: 503 }
    );
  }

  const dbKind = kind === "tv" ? "show" : "movie";
  const idColumn = kind === "tv" ? "tvdb_id" : "tmdb_id";

  // Already present? Hand back the existing page rather than making a duplicate.
  if (kind === "movie") {
    const { data: existing } = await supabase
      .from("titles").select("slug").eq("kind", "movie").eq("tmdb_id", tmdbId).maybeSingle();
    if (existing) {
      const existingPath = `/movies/${(existing as { slug: string }).slug}`;
      // The page may be holding a cached 404 from before it existed.
      revalidateTag("catalogue");
      revalidatePath(existingPath);
      return NextResponse.json({ slug: (existing as { slug: string }).slug, path: existingPath, created: false });
    }
  }

  const details = await getTitleDetails(kind, tmdbId);
  if (!details) {
    return NextResponse.json({ error: "TMDb does not recognise that title." }, { status: 404 });
  }

  // Series are keyed by TVDB id for artwork, and the schema enforces that a show
  // carries one. TMDb does not always know it, and there is no honest row to
  // write without it.
  if (kind === "tv" && !details.tvdbId) {
    return NextResponse.json(
      { error: "That series has no TVDB id on TMDb, so it cannot be added yet." },
      { status: 422 }
    );
  }

  if (kind === "tv") {
    const { data: existing } = await supabase
      .from("titles").select("slug").eq("kind", "show").eq("tvdb_id", details.tvdbId).maybeSingle();
    if (existing) {
      const existingPath = `/shows/${(existing as { slug: string }).slug}`;
      revalidateTag("catalogue");
      revalidatePath(existingPath);
      return NextResponse.json({ slug: (existing as { slug: string }).slug, path: existingPath, created: false });
    }
  }

  // Disambiguate the slug rather than colliding with an existing title.
  const base = slugify(details.title);
  const year = details.year ?? details.firstAired;
  let slug = base;
  for (const candidate of [base, year ? `${base}-${year}` : null, `${base}-${idColumn === "tvdb_id" ? details.tvdbId : tmdbId}`]) {
    if (!candidate) continue;
    const { data: taken } = await supabase.from("titles").select("slug").eq("slug", candidate).maybeSingle();
    if (!taken) {
      slug = candidate;
      break;
    }
    slug = "";
  }
  if (!slug) {
    return NextResponse.json({ error: "Could not find a free slug for that title." }, { status: 409 });
  }

  const row = {
    kind: dbKind,
    slug,
    title: details.title,
    genre: details.genre,
    summary: details.summary,
    // Unrated until someone reviews it. 0 renders as an empty heat scale, which
    // is honest: nobody has scored it yet.
    score: 0,
    tmdb_id: kind === "movie" ? tmdbId : null,
    tvdb_id: kind === "tv" ? details.tvdbId : null,
    year: details.year,
    runtime_min: details.runtimeMin,
    director: details.director,
    release_date: details.releaseDate,
    first_aired: details.firstAired,
    first_aired_date: details.firstAiredDate,
    creator: details.creator,
    seasons: details.seasons,
    episodes: details.episodes,
    network: details.network,
  };

  const { error } = await supabase.from("titles").insert(row);
  if (error) {
    console.warn("[titles] insert failed:", error.message);
    return NextResponse.json({ error: "Could not add that title." }, { status: 500 });
  }

  const path = `${kind === "tv" ? "/shows" : "/movies"}/${slug}`;

  // Purge before returning, so the redirect that follows renders the new row
  // rather than a cached catalogue that predates it. Without this the page 404s
  // and the 404 itself gets cached.
  revalidateTag("catalogue");
  revalidatePath(path);
  revalidatePath("/");

  return NextResponse.json({ slug, path, created: true });
}

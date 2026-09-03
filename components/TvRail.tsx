"use client";

import Link from "next/link";
import { filterShows } from "@/lib/data";
import { HeatScale } from "@/components/HeatScale";
import { Poster } from "@/components/Poster";
import { useApp } from "@/components/ThemeUserProvider";

export function TvRail({ posters }: { posters: Record<string, string | null> }) {
  const { query, genre, filtering } = useApp();
  const shows = filterShows(query, genre);

  // With a filter on and nothing matching, drop the section entirely rather than
  // showing an empty grid under a heading -- the lobby rail above already
  // explains that nothing matched.
  if (filtering && shows.length === 0) return null;

  return (
    <section id="shows" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>On the small screen</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textTransform: "uppercase",
            letterSpacing: ".16em",
            fontSize: 12,
            color: "var(--dim)",
          }}
        >
          {filtering ? shows.length + " series" : "Series worth the weekend"}
        </span>
      </div>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 30,
        }}
      >
        {shows.map((s) => (
          <li key={s.slug}>
            <Link href={`/shows/${s.slug}`} style={{ display: "block", color: "inherit" }}>
            <div
              style={{
                padding: 10,
                borderRadius: 6,
                background: "linear-gradient(160deg,var(--frameA),var(--frameB))",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ padding: 7, background: "var(--matte)", borderRadius: 3 }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3" }}>
                  <Poster
                    src={posters[s.slug] ?? null}
                    label={s.title}
                    sizes="(max-width: 700px) 45vw, 220px"
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
              <p
                style={{
                  margin: "5px 0 9px",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  fontSize: 11,
                  color: "var(--dim)",
                }}
              >
                {s.genre} · {s.firstAired} · {s.seasons} {s.seasons === 1 ? "season" : "seasons"}
              </p>
              <HeatScale score={s.score} />
            </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

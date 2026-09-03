import Link from "next/link";
import type { Movie } from "@/lib/data";
import { Poster } from "@/components/Poster";
import { HeatScale } from "@/components/HeatScale";

export function SimilarMovies({ movies, posters }: { movies: Movie[]; posters: Record<string, string | null> }) {
  if (movies.length === 0) return null;

  return (
    <section style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "48px 28px 70px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>You might also like</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24 }}>
        {movies.map((m) => (
          <Link key={m.slug} href={`/movies/${m.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "inherit" }}>
            <div style={{ width: "100%", padding: 10, borderRadius: 6, background: "linear-gradient(160deg,var(--frameA),var(--frameB))", boxShadow: "var(--shadow)" }}>
              <div style={{ padding: 7, background: "var(--matte)", borderRadius: 3 }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3" }}>
                  <Poster src={posters[m.slug] ?? null} label={m.title} sizes="200px" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, textAlign: "center", width: "100%" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 16, fontWeight: 700 }}>{m.title}</h3>
              <p style={{ margin: "4px 0 8px", fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 10, color: "var(--dim)" }}>
                {m.genre} · {m.year}
              </p>
              <HeatScale score={m.score} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

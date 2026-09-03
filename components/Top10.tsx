import Link from "next/link";
import { top10, lobbyMovies } from "@/lib/data";

export function Top10() {
  return (
    <section id="top10" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Top 10 by user score</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, color: "var(--dim)" }}>
          Averaged from verified user ratings
        </span>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 44px" }}>
        {top10.map((entry) => {
          const movie = lobbyMovies.find((m) => m.title === entry.title);
          const title = movie ? (
            <Link href={`/movies/${movie.slug}`} className="hover-brand" style={{ flex: 1, fontSize: 16, fontWeight: 500, color: "inherit" }}>
              {entry.title}
            </Link>
          ) : (
            <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{entry.title}</span>
          );
          return (
            <li key={entry.rank} style={{ display: "flex", alignItems: "center", gap: 18, padding: "15px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontFamily: "var(--font-bodoni), serif", fontSize: 28, fontWeight: 900, color: "var(--brand)", minWidth: 44 }}>
                {String(entry.rank).padStart(2, "0")}
              </span>
              {title}
              <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", letterSpacing: ".12em", fontSize: 13, color: "var(--dim)" }}>{entry.score}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

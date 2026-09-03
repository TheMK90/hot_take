import { tvShows } from "@/lib/data";
import { RateDots } from "@/components/RateDots";
import { Poster } from "@/components/Poster";

export function TvRail({ posters }: { posters: Record<string, string | null> }) {
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
          Series worth the weekend
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
        {tvShows.map((s) => (
          <li key={s.slug}>
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
              <RateDots score={s.score} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

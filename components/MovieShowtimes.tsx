import type { Movie, Showtime } from "@/lib/data";

export function MovieShowtimes({ movie, showtime }: { movie: Movie; showtime: Showtime | undefined }) {
  return (
    <section id="showtimes" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "40px 28px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>Showtimes</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, color: "var(--dim)" }}>
          Odeon Wardour Street · Today
        </span>
      </div>

      {showtime ? (
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 4px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 19, fontWeight: 700 }}>{movie.title}</h3>
            <p style={{ margin: "4px 0 0", fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
              {showtime.format} · {showtime.runtimeMin} min
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {showtime.times.map((t) => (
              <button
                key={t}
                type="button"
                className="hover-fill-brand"
                style={{
                  padding: "7px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  background: "var(--card)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  letterSpacing: ".1em",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p
          style={{
            padding: "16px 4px",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            fontSize: 14,
            color: "var(--dim)",
          }}
        >
          Not currently screening at Odeon Wardour Street. Check{" "}
          <a href="/#showing" style={{ fontWeight: 600 }}>
            what&apos;s showing today
          </a>{" "}
          instead.
        </p>
      )}
    </section>
  );
}

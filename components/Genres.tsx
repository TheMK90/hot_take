import { genres } from "@/lib/data";

export function Genres() {
  return (
    <section id="genres" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 70px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Browse by genre</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 }}>
        {genres.map((g) => (
          <a
            key={g.name}
            href="#genres"
            className="hover-brand hover-brand-border"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 132,
              padding: 18,
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--card2)",
              color: "var(--ink)",
            }}
          >
            <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".18em", fontSize: 11, color: "var(--dim)" }}>
              {g.count} films
            </span>
            <span style={{ fontFamily: "var(--font-bodoni), serif", fontSize: 25, fontWeight: 800 }}>{g.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

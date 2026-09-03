import type { Show } from "@/lib/data";

// The show page's answer to the film page's Showtimes block. A series is not
// playing at a cinema, so the equivalent question is where you can watch it and
// how much there is of it.
//
// Like the film showtimes, this is decorative for now -- see DECISIONS §7. It
// names the original network rather than pretending to know what is streaming in
// the reader's country today, because that changes constantly and per region.
export function ShowWhereToWatch({ show }: { show: Show }) {
  const facts: Array<{ label: string; value: string }> = [
    { label: "Original network", value: show.network },
    { label: "Seasons", value: `${show.seasons}` },
    { label: "Episodes", value: `${show.episodes}` },
    { label: "First aired", value: show.firstAiredDate },
  ];

  return (
    <section id="where-to-watch" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "40px 28px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>Where to watch</h2>
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
          Streaming rights vary by region
        </span>
      </div>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
          gap: "0",
          margin: 0,
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {facts.map((f) => (
          <div key={f.label} style={{ padding: "18px 4px" }}>
            <dt
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".16em",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--dim)",
              }}
            >
              {f.label}
            </dt>
            <dd style={{ margin: "6px 0 0", fontFamily: "var(--font-bodoni), serif", fontSize: 21, fontWeight: 700 }}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

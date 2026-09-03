export function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid var(--line)", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "34px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-bodoni), serif", fontSize: 19, fontWeight: 900 }}>Hot Take</span>
        <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".18em", fontSize: 11, color: "var(--dim)" }}>
          Reviews written by film fans since 2019
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 22, fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, fontWeight: 600 }}>
          <a href="#reviews">Community rules</a>
          <a href="#showing">Cinemas</a>
          <a href="#top10">Archive</a>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import type { Show } from "@/lib/data";
import { Poster } from "@/components/Poster";
import { HeatScale } from "@/components/HeatScale";
import { WriteReviewButton } from "@/components/WriteReviewButton";

// The show equivalent of MovieHero. Same layout deliberately -- a series page
// should feel like a film page -- but the facts differ: a creator rather than a
// director, a first-aired date, a season count, and no showtimes link, because
// nothing here is playing at a cinema.
export function ShowHero({
  show,
  posterUrl,
  backdropUrl,
}: {
  show: Show;
  posterUrl: string | null;
  backdropUrl: string | null;
}) {
  return (
    <section style={{ position: "relative", zIndex: 2, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,var(--frameA),var(--frameB))" }} />
      {backdropUrl && (
        <>
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", opacity: "var(--photo-op, 1)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg,rgba(20,4,4,.55) 0%,rgba(20,4,4,.72) 55%,var(--bg) 100%)",
            }}
          />
        </>
      )}
      {!backdropUrl && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,.15) 45%,var(--bg) 100%)" }} />
      )}

      <div
        style={{
          position: "relative",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "48px 28px 60px",
          display: "flex",
          gap: 40,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "none",
            width: 220,
            padding: 12,
            borderRadius: 6,
            background: "linear-gradient(160deg,var(--frameA),var(--frameB))",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ padding: 8, background: "var(--matte)", borderRadius: 3 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3" }}>
              <Poster src={posterUrl} label={show.title} sizes="220px" priority />
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 360px", minWidth: 280, color: "#fffaf5" }}>
          <p
            style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".26em",
              fontSize: 12,
              fontWeight: 600,
              color: "#f6e4d4",
            }}
          >
            {show.genre} · Series · {show.firstAired}
          </p>
          <h1 style={{ margin: "0 0 14px", fontFamily: "var(--font-bodoni), serif", fontWeight: 900, fontSize: "clamp(32px,4.6vw,56px)", lineHeight: 1.02 }}>
            {show.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
            <HeatScale score={show.score} align="flex-start" />
            <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", letterSpacing: ".12em", fontSize: 13, color: "#f6e4d4" }}>
              {show.score} / 5 average
            </span>
          </div>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,auto))",
              gap: "10px 32px",
              margin: "0 0 22px",
              fontSize: 14,
            }}
          >
            <div>
              <dt style={dtStyle}>Created by</dt>
              <dd style={ddStyle}>{show.creator}</dd>
            </div>
            <div>
              <dt style={dtStyle}>First aired</dt>
              <dd style={ddStyle}>{show.firstAiredDate}</dd>
            </div>
            <div>
              <dt style={dtStyle}>Seasons</dt>
              <dd style={ddStyle}>
                {show.seasons} {show.seasons === 1 ? "season" : "seasons"}
              </dd>
            </div>
          </dl>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <WriteReviewButton film={show.title} />
            <a
              href="#reviews"
              style={{
                padding: "13px 24px",
                border: "1px solid rgba(255,250,245,.4)",
                borderRadius: 999,
                color: "#fffaf5",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const dtStyle: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  textTransform: "uppercase",
  letterSpacing: ".16em",
  fontSize: 10,
  fontWeight: 700,
  color: "#f6e4d4",
};

const ddStyle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 15,
  fontWeight: 500,
};

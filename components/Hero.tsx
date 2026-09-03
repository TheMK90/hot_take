"use client";

import { useApp } from "@/components/ThemeUserProvider";

export function Hero() {
  const { reviewCountLabel, openComposer } = useApp();

  return (
    <section style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "58px 28px 34px", display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: 920, border: "var(--plate-frame)", borderRadius: "var(--plate-radius)", boxShadow: "var(--plate-shadow)" }}>
        <div
          style={{
            overflow: "hidden",
            height: "var(--crest-h)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg,#8f121c,#5d070d)",
            border: "var(--plate-border)",
            borderBottom: 0,
            borderRadius: "var(--plate-radius) var(--plate-radius) 0 0",
            boxShadow: "inset 0 0 0 3px rgba(232,178,90,.85)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".42em",
              fontSize: 19,
              fontWeight: 700,
              color: "#ffe6a8",
              textShadow: "0 0 12px rgba(255,190,110,.9)",
            }}
          >
            Hot Take
          </span>
        </div>
        <div
          style={{
            overflow: "hidden",
            height: "var(--bulb-h)",
            background:
              "radial-gradient(circle at 12px 8px,#fff2cf 0 3.4px,rgba(255,242,207,0) 4.4px) repeat-x,linear-gradient(180deg,#e8b25a,#8a5a12)",
            backgroundSize: "32px var(--bulb-h),100% 100%",
            borderLeft: "var(--plate-border)",
            borderRight: "var(--plate-border)",
          }}
        />
        <div
          style={{
            position: "relative",
            background: "var(--plate-bg)",
            border: "var(--plate-border)",
            borderTop: 0,
            borderBottom: 0,
            padding: "var(--plate-pad)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 13px",
              border: "1px solid var(--line)",
              borderRadius: 2,
              background: "var(--card2)",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".26em",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--dim)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", animation: "neonpulse 1.8s ease-in-out infinite" }} />
            {reviewCountLabel} reviews from film fans
          </div>
          <h1
            style={{
              margin: "18px 0 0",
              fontFamily: "var(--font-bodoni), serif",
              fontWeight: 900,
              fontSize: "clamp(40px,5.8vw,78px)",
              lineHeight: 0.95,
              letterSpacing: "-.02em",
              color: "var(--plate-txt)",
              textWrap: "balance",
            }}
          >
            Every film,
            <br />
            one hot take.
          </h1>
          <p style={{ margin: "16px auto 0", maxWidth: 520, fontSize: 16, lineHeight: 1.55, color: "var(--dim)", textWrap: "pretty" }}>
            No critics on staff. Every score here comes from someone who bought a ticket. Rate what you have seen, and read what everyone else thought.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => openComposer()}
              className="hover-brighter"
              style={{
                padding: "13px 24px",
                border: "1px solid var(--brand)",
                borderRadius: 999,
                background: "var(--brand)",
                color: "var(--onbrand)",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Write your review
            </button>
            <a
              href="#reviews"
              className="hover-brand hover-brand-border"
              style={{
                padding: "13px 24px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--ink)",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Read reviews
            </a>
          </div>
        </div>
        <div
          style={{
            overflow: "hidden",
            height: "var(--valance-h)",
            background: "repeating-linear-gradient(90deg,#a5121c 0 6px,#f6e9dc 6px 12px)",
            border: "var(--plate-border)",
            borderTop: 0,
            borderRadius: "0 0 var(--plate-radius) var(--plate-radius)",
          }}
        />
      </div>
    </section>
  );
}

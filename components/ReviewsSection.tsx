"use client";

import { communityReviews } from "@/lib/data";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { useApp } from "@/components/ThemeUserProvider";

export function ReviewsSection() {
  const { myReviews, reviewCountLabel } = useApp();

  return (
    <section id="reviews" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 10px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 26 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Latest from the community</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <a href="#reviews" style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, fontWeight: 700 }}>
          All {reviewCountLabel} reviews
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
        {myReviews.map((rev, i) => (
          <article
            key={i}
            style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--brand)", borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow)" }}
          >
            <div style={{ padding: "20px 22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: ".18em",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: "var(--brand)",
                    color: "var(--onbrand)",
                  }}
                >
                  Your review
                </span>
                <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
                  {rev.score} / 5
                </span>
              </div>
              <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-bodoni), serif", fontSize: 23, fontWeight: 700 }}>{rev.film}</h3>
              <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", textWrap: "pretty" }}>{rev.body}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--brand)",
                    color: "var(--onbrand)",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontSize: 10,
                    letterSpacing: ".08em",
                    fontWeight: 700,
                  }}
                >
                  {rev.initials}
                </span>
                {rev.byline}
              </div>
            </div>
          </article>
        ))}

        {communityReviews.map((rev) => (
          <article
            key={rev.id}
            style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow)" }}
          >
            <div style={{ position: "relative", height: 180 }}>
              <PlaceholderImage label={`${rev.film} still`} />
            </div>
            <div style={{ padding: "20px 22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span
                  style={
                    rev.tag === "Top rated"
                      ? {
                          fontFamily: "var(--font-barlow-condensed), sans-serif",
                          textTransform: "uppercase",
                          letterSpacing: ".18em",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: 4,
                          background: "var(--brand)",
                          color: "var(--onbrand)",
                        }
                      : {
                          fontFamily: "var(--font-barlow-condensed), sans-serif",
                          textTransform: "uppercase",
                          letterSpacing: ".18em",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: "1px solid var(--line)",
                          color: "var(--dim)",
                        }
                  }
                >
                  {rev.tag}
                </span>
                <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
                  {rev.score}
                </span>
              </div>
              <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-bodoni), serif", fontSize: 23, fontWeight: 700 }}>{rev.film}</h3>
              <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.55, color: "var(--dim)", textWrap: "pretty" }}>{rev.body}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--card2)",
                    border: "1px solid var(--line)",
                    color: "var(--dim)",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontSize: 10,
                    letterSpacing: ".08em",
                    fontWeight: 700,
                  }}
                >
                  {rev.initials}
                </span>
                {rev.byline}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

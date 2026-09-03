"use client";

import { useApp } from "@/components/ThemeUserProvider";
import { HeatScale, heatLabel } from "@/components/HeatScale";

// Rating history, per ROADMAP Phase 1. Local state for now -- it persists to
// localStorage so it survives a reload, and moves to a real query in Phase 5.
// The full profile page this eventually belongs on is Phase 2.
export function MyRatings() {
  const { user, myReviews, openComposer } = useApp();

  // Signed out there is nothing to show, and an empty "your ratings" heading
  // reads as broken rather than as an invitation.
  if (!user) return null;

  return (
    <section
      id="your-ratings"
      style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 0" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Your ratings</h2>
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
          {myReviews.length === 0
            ? "Nothing rated yet"
            : `${myReviews.length} ${myReviews.length === 1 ? "take" : "takes"} as ${user.handle}`}
        </span>
      </div>

      {myReviews.length === 0 ? (
        <div
          style={{
            padding: "44px 28px",
            textAlign: "center",
            border: "1px dashed var(--line)",
            borderRadius: 10,
            background: "var(--card2)",
          }}
        >
          <p style={{ margin: "0 0 16px", fontSize: 15, color: "var(--dim)" }}>
            Rate something and it will show up here.
          </p>
          <button
            type="button"
            onClick={() => openComposer()}
            className="hover-fill-brand"
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Write your first hot take
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {myReviews.map((rev, i) => (
            <li
              key={`${rev.film}-${rev.ratedAt}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 4px",
                borderTop: "1px solid var(--line)",
                borderBottom: i === myReviews.length - 1 ? "1px solid var(--line)" : undefined,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 19, fontWeight: 700 }}>{rev.film}</h3>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 14,
                    color: "var(--dim)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {rev.body}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <HeatScale score={rev.score} align="flex-start" />
                <p
                  style={{
                    margin: "5px 0 0",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: ".14em",
                    fontSize: 11,
                    color: "var(--dim)",
                  }}
                >
                  {heatLabel(rev.score)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

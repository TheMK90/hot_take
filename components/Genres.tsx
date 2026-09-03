"use client";

import { type Genre } from "@/lib/data";
import { useApp } from "@/components/ThemeUserProvider";

export function Genres({ genres }: { genres: Genre[] }) {
  const { genre: active, toggleGenre } = useApp();

  return (
    <section id="genres" style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "56px 28px 70px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Browse by genre</h2>
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
          {active ? "Showing " + active : "Pick one to filter"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 }}>
        {genres.map((g) => {
          const on = active === g.name;
          return (
            <button
              key={g.name}
              type="button"
              onClick={() => toggleGenre(g.name)}
              aria-pressed={on}
              className="hover-brand hover-brand-border"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                textAlign: "left",
                height: 132,
                padding: 18,
                borderRadius: 10,
                border: `1px solid ${on ? "var(--brand)" : "var(--line)"}`,
                background: on ? "var(--card)" : "var(--card2)",
                color: "var(--ink)",
                cursor: "pointer",
                font: "inherit",
                transition: "border-color .12s, background .12s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".18em",
                  fontSize: 11,
                  color: on ? "var(--brand)" : "var(--dim)",
                }}
              >
                {g.count} {g.count === 1 ? "title" : "titles"}
              </span>
              <span style={{ fontFamily: "var(--font-bodoni), serif", fontSize: 25, fontWeight: 800 }}>{g.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

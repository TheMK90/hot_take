import Image from "next/image";
import { showtimes } from "@/lib/data";

export function NowShowing() {
  return (
    <section id="showing" style={{ position: "relative", zIndex: 2, marginTop: 64, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--bg2)" }}>
      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto", padding: "52px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 44, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 6px", fontFamily: "var(--font-bodoni), serif", fontSize: 34, fontWeight: 800 }}>Now showing</h2>
            <p style={{ margin: "0 0 26px", fontSize: 15, color: "var(--dim)" }}>Odeon Wardour Street · Today</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {showtimes.map((s, i) => (
                <div
                  key={s.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "16px 4px",
                    borderTop: "1px solid var(--line)",
                    borderBottom: i === showtimes.length - 1 ? "1px solid var(--line)" : undefined,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 19, fontWeight: 700 }}>{s.title}</h3>
                    <p style={{ margin: "4px 0 0", fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".14em", fontSize: 11, color: "var(--dim)" }}>
                      {s.format} · {s.runtimeMin} min
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {s.times.map((t) => (
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
              ))}
            </div>
          </div>

          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
            <Image
              src="/assets/theatre-chinese.png"
              alt="Cinema frontage at night"
              width={640}
              height={420}
              style={{ display: "block", width: "100%", height: 420, objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.78) 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 24, pointerEvents: "none" }}>
              <p style={{ margin: "0 0 6px", fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".2em", fontSize: 11, color: "#e9d9b6" }}>
                Screen of the week
              </p>
              <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>The big house, still the best seat</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

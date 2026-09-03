"use client";

import { useApp } from "@/components/ThemeUserProvider";
import { HeatScaleInput } from "@/components/HeatScale";

export function ComposerModal() {
  const { composerOpen, closeComposer, submitReview, draftScore, setDraftScore, user } = useApp();
  if (!composerOpen) return null;

  return (
    <div
      onClick={closeComposer}
      style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(20,4,4,.62)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, boxShadow: "var(--shadow)", overflow: "hidden" }}
      >
        <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#a5121c 0 6px,#f6e9dc 6px 12px)" }} />
        <div style={{ padding: "26px 28px 28px" }}>
          <h2 style={{ margin: "0 0 6px", fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>Write your hot take</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: "var(--dim)" }}>
            Posting as {user?.handle ?? "you"}. Keep it to what you thought, not what happens.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              submitReview(String(fd.get("film") || ""), String(fd.get("body") || ""));
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <label style={labelStyle}>
              Film
              <input name="film" type="text" required placeholder="Parasite" style={inputStyle} />
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={labelStyle}>Your score</span>
              <HeatScaleInput value={draftScore} onChange={setDraftScore} />
            </div>
            <label style={labelStyle}>
              Your take
              <textarea
                name="body"
                required
                rows={4}
                placeholder="Half the film is a con, half is the bill coming due."
                style={{ ...inputStyle, lineHeight: 1.5, resize: "vertical" }}
              />
            </label>
            <button
              type="submit"
              className="hover-brighter"
              style={{
                marginTop: 6,
                padding: 13,
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
              Post review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  textTransform: "uppercase",
  letterSpacing: ".16em",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--dim)",
};

const inputStyle: React.CSSProperties = {
  padding: "11px 13px",
  border: "1px solid var(--line)",
  borderRadius: 4,
  background: "var(--card2)",
  color: "var(--ink)",
  fontFamily: "var(--font-barlow), sans-serif",
  fontSize: 15,
  outline: 0,
};

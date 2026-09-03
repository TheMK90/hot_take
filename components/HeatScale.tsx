"use client";

import { useId } from "react";

// The rating control, per DECISIONS.md §2: five flames, whole steps only.
//
// One component, two modes. `readonly` renders a score for display (it replaced
// the old RateDots); the interactive mode is the input. Keeping them together is
// deliberate -- two components drift apart, and then a 4 looks like one thing in
// the composer and another in the rail.
//
// The interactive mode is a real radiogroup built from native radio inputs, so
// arrow keys, tab order and screen-reader announcement come from the platform
// rather than from hand-written key handlers.

export const HEAT_LABELS = ["Ice cold", "Lukewarm", "Warm", "Hot", "Scorcher"] as const;

export function heatLabel(score: number): string {
  return HEAT_LABELS[Math.min(5, Math.max(1, Math.round(score))) - 1];
}

// The drop from the logo, scaled out of its own coordinate space into a 24x24
// box, so the rating flame and the brand mark are literally the same shape.
const FLAME_PATH =
  "M 0 -44 C 8 -26 24 -18 28 -2 C 33 18 19 36 0 36 C -19 36 -33 18 -28 -2 C -25 -14 -14 -22 -12 -34 C -6 -28 -2 -36 0 -44 Z";

function Flame({ size, fill }: { size: number; fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g transform="translate(12,13.2) scale(0.26)">
        <path d={FLAME_PATH} fill={fill} />
      </g>
    </svg>
  );
}

// A 5 burns amber so a Scorcher is distinguishable at a glance, not just "one
// more flame than a 4".
function fillFor(index: number, score: number): string {
  if (index >= score) return "var(--rateoff)";
  return score >= 5 ? "#EE9B3E" : "var(--rate)";
}

export function HeatScale({
  score,
  size = 17,
  align = "center",
}: {
  score: number;
  size?: number;
  align?: "center" | "flex-start";
}) {
  return (
    <div
      role="img"
      aria-label={`${heatLabel(score)}, ${score} out of 5`}
      style={{ display: "flex", justifyContent: align, gap: 5 }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Flame key={i} size={size} fill={fillFor(i, score)} />
      ))}
    </div>
  );
}

export function HeatScaleInput({
  value,
  onChange,
  name = "score",
}: {
  value: number;
  onChange: (n: number) => void;
  name?: string;
}) {
  const groupId = useId();

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Your score"
        style={{ display: "flex", gap: 8 }}
        onMouseLeave={undefined}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          const selected = n === value;
          return (
            <label
              key={n}
              htmlFor={`${groupId}-${n}`}
              title={HEAT_LABELS[n - 1]}
              style={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                cursor: "pointer",
                border: `1px solid ${selected ? "var(--brand)" : "var(--line)"}`,
                background: selected ? "var(--card2)" : "transparent",
                transition: "border-color .12s, background .12s",
              }}
            >
              <input
                id={`${groupId}-${n}`}
                type="radio"
                name={name}
                value={n}
                checked={selected}
                onChange={() => onChange(n)}
                // Visually hidden, but still focusable and announced. Never
                // display:none -- that removes it from the tab order entirely.
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              />
              <Flame size={22} fill={active ? (value >= 5 ? "#EE9B3E" : "var(--rate)") : "var(--rateoff)"} />
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                  whiteSpace: "nowrap",
                }}
              >
                {HEAT_LABELS[n - 1]}, {n} of 5
              </span>
            </label>
          );
        })}
      </div>
      <p
        aria-live="polite"
        style={{
          margin: "8px 0 0",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          textTransform: "uppercase",
          letterSpacing: ".16em",
          fontSize: 11,
          color: "var(--dim)",
        }}
      >
        {heatLabel(value)}
      </p>
    </div>
  );
}

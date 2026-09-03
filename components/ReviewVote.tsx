"use client";

import { useApp } from "@/components/ThemeUserProvider";

// Thumbs up/down on a single review. One vote per review per browser; clicking
// the active thumb again clears it, so a misclick is undoable.
//
// The displayed count is the seeded total plus this viewer's own vote, so the
// number reacts immediately rather than looking stuck. Real aggregate counts
// arrive with the database in Phase 5.
export function ReviewVote({
  reviewId,
  baseUp = 0,
  baseDown = 0,
}: {
  reviewId: string;
  baseUp?: number;
  baseDown?: number;
}) {
  const { reviewVotes, voteReview } = useApp();
  const mine = reviewVotes[reviewId] ?? null;

  const up = baseUp + (mine === "up" ? 1 : 0);
  const down = baseDown + (mine === "down" ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Thumb
        direction="up"
        active={mine === "up"}
        count={up}
        label={`Helpful${mine === "up" ? ", your vote" : ""}`}
        onClick={() => voteReview(reviewId, "up")}
      />
      <Thumb
        direction="down"
        active={mine === "down"}
        count={down}
        label={`Not helpful${mine === "down" ? ", your vote" : ""}`}
        onClick={() => voteReview(reviewId, "down")}
      />
    </div>
  );
}

function Thumb({
  direction,
  active,
  count,
  label,
  onClick,
}: {
  direction: "up" | "down";
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className="hover-brand-border"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 11px",
        borderRadius: 999,
        border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`,
        background: active ? "var(--card2)" : "transparent",
        color: active ? "var(--brand)" : "var(--dim)",
        cursor: "pointer",
        font: "inherit",
        fontSize: 12,
        lineHeight: 1,
        transition: "border-color .12s, color .12s, background .12s",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: direction === "down" ? "rotate(180deg)" : undefined }}
      >
        <path d="M7 22V10l5-8a2.5 2.5 0 0 1 2.4 3.2L13.5 9H19a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 17.4 21H7Z" />
        <path d="M7 10H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </svg>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </button>
  );
}

"use client";

import { useApp } from "@/components/ThemeUserProvider";

export function WriteReviewButton({ film, label = "Write a review" }: { film: string; label?: string }) {
  const { openComposer } = useApp();

  return (
    <button
      type="button"
      onClick={() => openComposer(film)}
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
      {label}
    </button>
  );
}

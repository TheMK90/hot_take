export function PlaceholderImage({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "var(--card2)",
        border: "1px dashed var(--line)",
        borderRadius: 3,
        color: "var(--dim)",
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontSize: 11,
        fontWeight: 600,
        textAlign: "center",
        padding: 8,
      }}
    >
      {label}
    </div>
  );
}

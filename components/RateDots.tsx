export function RateDots({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24" style={{ color: i < score ? "var(--rate)" : "var(--rateoff)" }}>
          <circle cx="8" cy="9" r="5" fill="currentColor" />
          <circle cx="16" cy="8" r="4.4" fill="currentColor" />
          <circle cx="12" cy="15" r="5.6" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

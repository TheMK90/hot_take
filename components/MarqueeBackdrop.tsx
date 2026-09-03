export function MarqueeBackdrop() {
  return (
    <div style={{ position: "absolute", inset: 0, height: 1100, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: "var(--photo-op)",
          backgroundImage: "url('/assets/theatre-marquee.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "saturate(1.05) contrast(1.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: "var(--stripe-op)",
          background: "linear-gradient(180deg,#6d0d13 0,#87131a 250px,#8e2a22 430px,#c9a98c 510px,var(--bg) 560px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 520,
          opacity: "var(--stripe-op)",
          background:
            "repeating-linear-gradient(90deg,rgba(0,0,0,.20) 0 4px,rgba(255,238,220,.09) 4px 10px,rgba(0,0,0,0) 10px 104px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 150,
          opacity: "var(--stripe-op)",
          background: "repeating-linear-gradient(135deg,rgba(255,231,196,.11) 0 12px,rgba(0,0,0,0) 12px 24px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 434,
          height: 9,
          opacity: "var(--stripe-op)",
          background: "linear-gradient(180deg,#e8b25a,#8a5a12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(0,0,0,.32) 0%,rgba(0,0,0,.06) 24%,rgba(0,0,0,0) 42%,var(--bg) 78%,var(--bg) 100%)",
        }}
      />
    </div>
  );
}

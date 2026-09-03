export function Logo({ size = 54 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Hot Take logo"
      style={{ display: "block", flex: "none", alignSelf: "center", margin: "-4px 0" }}
    >
      <rect x="0" y="0" width="512" height="512" rx="104" fill="var(--logo-bg)" />
      <path
        d="M256 92c14 36 23 55 34 65 8 7 16 4 23-7 41 57 63 95 63 141 0 68-54 110-120 110s-120-42-120-110c0-46 22-84 63-141 11-10 20-29 34-58h23z"
        fill="var(--logo-ink)"
      />
      <path d="M312 322c40-26 78-36 106-36 29 0 49 17 49 39 0 23-21 39-49 39-32 0-68 12-98 30l-8-72z" fill="var(--logo-ink)" />
      <path d="M318 349c34-21 66-29 92-29 20 0 32 8 32 19 0 12-12 20-32 20-28 0-60 10-88 25l-4-35z" fill="var(--logo-bg)" />
      <g fill="var(--logo-ink)">
        <rect x="330" y="330" width="14" height="14" rx="3" />
        <rect x="360" y="323" width="14" height="14" rx="3" />
        <rect x="392" y="319" width="14" height="14" rx="3" />
        <rect x="330" y="382" width="14" height="14" rx="3" />
        <rect x="360" y="376" width="14" height="14" rx="3" />
        <rect x="392" y="372" width="14" height="14" rx="3" />
      </g>
      <circle cx="256" cy="292" r="74" fill="var(--logo-bg)" />
      <g fill="var(--logo-ink)">
        <circle cx="256" cy="292" r="21" />
        <circle cx="256" cy="245" r="17" />
        <circle cx="256" cy="339" r="17" />
        <circle cx="215" cy="268" r="17" />
        <circle cx="297" cy="268" r="17" />
        <circle cx="215" cy="316" r="17" />
        <circle cx="297" cy="316" r="17" />
      </g>
      <g fill="#181008">
        <ellipse cx="220" cy="196" rx="17" ry="20" />
        <ellipse cx="278" cy="196" rx="17" ry="20" />
      </g>
      <g fill="var(--logo-ink)">
        <circle cx="214" cy="189" r="6" />
        <circle cx="272" cy="189" r="6" />
      </g>
    </svg>
  );
}

// 「ブース・混雑」ナビ項目用アイコン。ブース（屋台）の右上に人型バッジを重ねて表現する。
export function BoothBusyIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  const badgeSize = Math.round(size * 0.55);

  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M3 9V7l1.5-4h15L21 7v2" />
        <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
        <path d="M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
        <path d="M9 21v-6h6v6" />
      </svg>
      <span
        className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-white shadow-sm"
        style={{ width: badgeSize, height: badgeSize }}
      >
        <svg width={badgeSize * 0.66} height={badgeSize * 0.66} viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.4">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      </span>
    </span>
  );
}

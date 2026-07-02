// 「ブース・混雑」ナビ項目用アイコン。
// 左下にブース（屋台）アイコン、右上に混雑（人型）アイコンを重ねて配置する。
export function BoothBusyIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  const boothSize = Math.round(size * 0.72);
  const personSize = Math.round(size * 0.62);

  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {/* ブース（左下） */}
      <svg
        width={boothSize}
        height={boothSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        className="absolute bottom-0 left-0"
      >
        <path d="M3 9V7l1.5-4h15L21 7v2" />
        <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
        <path d="M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
        <path d="M9 21v-6h6v6" />
      </svg>

      {/* 混雑（人型・右上） */}
      <svg
        width={personSize}
        height={personSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="absolute top-0 right-0"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    </span>
  );
}

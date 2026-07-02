// 「ブース・混雑」ナビ項目用アイコン（ブース＝屋台アイコンに統一）
export function BoothBusyIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M3 9V7l1.5-4h15L21 7v2" />
      <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
      <path d="M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

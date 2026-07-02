"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import BottomSheet from "@/components/BottomSheet";
import { BoothBusyIcon } from "@/components/icons/BoothBusyIcon";
import { ThemeIcon } from "@/components/icons/ThemeIcon";
import type { ViewerFeatures } from "@/lib/feature-flags";

type Item = {
  href: string;
  label: string;
  featureKey?: keyof ViewerFeatures;
  icon: React.ReactNode;
};

// ホーム中央のクイックリンクと同等の、利用可能な全コンテンツ
const MENU_ITEMS: Item[] = [
  {
    href: "/event", label: "日程", featureKey: "event",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: "/busy", label: "ブース・混雑", featureKey: "busy",
    icon: <BoothBusyIcon size={26} />,
  },
  {
    href: "/eat", label: "飲食", featureKey: "eat",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    href: "/notice", label: "お知らせ", featureKey: "notice",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  },
  {
    href: "/map", label: "校内マップ", featureKey: "map",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  },
  {
    href: "/digital", label: "デジタルパンフ", featureKey: "digital",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    href: "/support/faq", label: "よくある質問",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>,
  },
];

export default function AllMenuSheet({ onClose }: { onClose: () => void }) {
  const { features } = useApp();
  const { theme, toggleTheme } = useTheme();
  const items = MENU_ITEMS.filter(({ featureKey }) => !featureKey || features[featureKey] !== false);

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--color-text-main)]">すべてのメニュー</h2>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
              className="flex h-9 w-9 items-center justify-center text-[var(--color-text-sub)]"
            >
              <ThemeIcon theme={theme} size={20} />
            </button>
            <button
              onClick={onClose}
              aria-label="閉じる"
              className="flex h-9 w-9 items-center justify-center text-[var(--color-text-sub)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {items.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-[var(--color-surface)] border border-gray-100 dark:border-gray-700 shadow-sm py-4 px-1 text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-primary)]">{icon}</span>
              <span className="text-xs font-medium text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

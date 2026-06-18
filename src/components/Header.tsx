"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { getCookie } from "@/lib/cookies";

const PAGE_NAMES: Record<string, string> = {
  "/top": "ホーム",
  "/event": "イベントスケジュール",
  "/booth": "ブース一覧",
  "/busy": "混雑状況",
  "/eat/car": "キッチンカー",
  "/eat/pta": "PTAバザー",
  "/notice": "お知らせ",
  "/digital": "デジタルパンフレット",
  "/map": "校内マップ",
  "/about": "制作情報",
  "/faq": "よくある質問",
  "/terms": "利用規約",
  "/privacy": "プライバシーポリシー",
  "/cookie-policy": "Cookieポリシー",
};

export default function Header() {
  const pathname = usePathname();
  const { openHamburger, openUserRoleOverlay } = useApp();

  const isTop = pathname === "/top";
  const pageName = PAGE_NAMES[pathname] ?? "";

  function handleAccountClick() {
    const raw = getCookie("user_role");
    if (!raw) {
      openUserRoleOverlay();
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (data.role === "student" || data.role === "teacher") {
        const lines = [
          `種別: ${data.role === "student" ? "生徒" : "教員"}`,
          data.grade && data.grade !== "none" ? `学年: ${data.grade}年` : null,
          data.class ? `クラス: ${data.class}組` : null,
          data.studentId ? `学籍番号: ${data.studentId}` : null,
        ].filter(Boolean);
        alert(`現在の設定情報\n\n${lines.join("\n")}\n\n※変更はできません。`);
      } else {
        openUserRoleOverlay();
      }
    } catch {
      openUserRoleOverlay();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <button
          onClick={handleAccountClick}
          aria-label="アカウント"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-sub)] hover:bg-[var(--color-background)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>

        <Link href="/top" className="text-base font-bold text-[var(--color-text-main)]">
          {isTop ? "ISF" : pageName || "ISF"}
        </Link>

        <button
          onClick={openHamburger}
          aria-label="メニュー"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-sub)] hover:bg-[var(--color-background)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {!isTop && pageName && (
        <div className="border-t border-gray-50 bg-[var(--color-background)] px-4 py-1.5 text-xs text-[var(--color-text-sub)]">
          <Link href="/top" className="hover:underline">TOP</Link>
          <span className="mx-1">&gt;</span>
          <span>{pageName}</span>
        </div>
      )}
    </header>
  );
}

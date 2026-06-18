"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { getCookie } from "@/lib/cookies";

type Crumb = { label: string; href?: string };

function getBreadcrumbs(pathname: string): Crumb[] {
  if (pathname === "/top" || pathname === "/") return [];

  if (pathname.startsWith("/legal/")) {
    const labels: Record<string, string> = {
      "/legal/terms": "利用規約",
      "/legal/privacy": "プライバシーポリシー",
      "/legal/cookie-policy": "Cookieポリシー",
    };
    return [
      { label: "TOP", href: "/top" },
      { label: "法令・ポリシー" },
      { label: labels[pathname] ?? pathname },
    ];
  }

  if (pathname.startsWith("/support/")) {
    const labels: Record<string, string> = {
      "/support/faq": "よくある質問",
      "/support/contact": "お問い合わせ",
    };
    return [
      { label: "TOP", href: "/top" },
      { label: "サポート" },
      { label: labels[pathname] ?? pathname },
    ];
  }

  const PAGE_NAMES: Record<string, string> = {
    "/event": "イベントスケジュール",
    "/booth": "ブース一覧",
    "/busy": "混雑状況",
    "/eat": "飲食エリア",
    "/notice": "お知らせ",
    "/digital": "デジタルパンフレット",
    "/map": "校内マップ",
    "/about": "制作情報",
  };

  const label = PAGE_NAMES[pathname];
  if (!label) return [];
  return [{ label: "TOP", href: "/top" }, { label }];
}

export default function Header() {
  const pathname = usePathname();
  const { openHamburger, openUserRoleOverlay } = useApp();

  const isTop = pathname === "/top" || pathname === "/";
  const crumbs = getBreadcrumbs(pathname);
  const pageTitle = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : "ISF";

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
        <Link href="/top" className="text-base font-bold text-[var(--color-text-main)]">
          {isTop ? "ISF" : pageTitle}
        </Link>

        <div className="flex items-center gap-1">
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

          <button
            aria-label="通知"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-sub)] hover:bg-[var(--color-background)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>

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
      </div>

      {crumbs.length > 0 && (
        <div className="border-t border-gray-50 bg-[var(--color-background)] px-4 py-1.5 text-xs text-[var(--color-text-sub)] flex items-center gap-1 flex-wrap">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>&gt;</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:underline">{crumb.label}</Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

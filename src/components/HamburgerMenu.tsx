"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

const pages = [
  {
    href: "/top",
    label: "ホーム（TOP）",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    href: "/event",
    label: "イベントスケジュール",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: "/booth",
    label: "ブース一覧",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3h18v4H3z"/><path d="M3 7v13a1 1 0 001 1h16a1 1 0 001-1V7"/><path d="M9 21V11h6v10"/></svg>,
  },
  {
    href: "/busy",
    label: "混雑状況",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    href: "/eat",
    label: "飲食エリア",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    href: "/notice",
    label: "お知らせ",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  },
  {
    href: "/digital",
    label: "デジタルパンフレット",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    href: "/map",
    label: "校内マップ",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  },
  {
    href: "/about",
    label: "制作情報",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>,
  },
];

const supportPages = [
  {
    href: "/support/faq",
    label: "よくある質問",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>,
  },
];

const legalPages = [
  { href: "/legal/terms", label: "利用規約" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/cookie-policy", label: "Cookieポリシー" },
];

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function HamburgerMenu() {
  const { isHamburgerOpen, closeHamburger } = useApp();
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
  }, []);

  if (!isHamburgerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={closeHamburger} />
      <div className="fixed top-0 right-0 z-50 h-full w-72 overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="font-bold text-[var(--color-text-main)]">メニュー</span>
          <button onClick={closeHamburger} className="text-[var(--color-text-sub)]" aria-label="閉じる">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="py-2">
          {pages.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-text-sub)] shrink-0">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="mx-4 my-2 border-t border-gray-100" />

          {supportPages.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="flex items-center gap-3 px-5 py-3 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-text-sub)] shrink-0">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="mx-4 my-2 border-t border-gray-100" />

          {legalPages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="block px-5 py-2.5 text-xs text-[var(--color-text-sub)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              {label}
            </Link>
          ))}

          {ios && (
            <div className="mx-4 mt-2 border-t border-gray-100 pt-2">
              <button
                onClick={closeHamburger}
                className="block w-full rounded-lg bg-[var(--color-background)] px-4 py-3 text-left text-sm font-bold text-[var(--color-primary)]"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <path d="M9 7l3-3 3 3M12 4v8"/>
                  </svg>
                  ホーム画面への追加方法
                </span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

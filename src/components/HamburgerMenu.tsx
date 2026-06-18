"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

const pages = [
  { href: "/top", label: "ホーム（TOP）" },
  { href: "/event", label: "イベントスケジュール" },
  { href: "/booth", label: "ブース一覧" },
  { href: "/busy", label: "混雑状況" },
  { href: "/eat/car", label: "キッチンカー" },
  { href: "/eat/pta", label: "PTAバザー" },
  { href: "/notice", label: "お知らせ" },
  { href: "/digital", label: "デジタルパンフレット" },
  { href: "/map", label: "校内マップ" },
  { href: "/about", label: "制作情報" },
  { href: "/faq", label: "よくある質問" },
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/cookie-policy", label: "Cookieポリシー" },
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
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={closeHamburger}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-72 overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="font-bold text-[var(--color-text-main)]">メニュー</span>
          <button
            onClick={closeHamburger}
            className="text-[var(--color-text-sub)]"
            aria-label="閉じる"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="py-2">
          {pages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="block px-5 py-3 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
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
                📲 ホーム画面への追加方法
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

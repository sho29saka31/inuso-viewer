"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { BoothBusyIcon } from "@/components/icons/BoothBusyIcon";

type FeatureKey = "event" | "booth" | "busy" | "eat" | "notice" | "digital" | "map";

const pages: { href: string; label: string; featureKey?: FeatureKey; icon: React.ReactNode }[] = [
  {
    href: "/top",
    label: "ホーム（TOP）",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    href: "/event",
    featureKey: "event",
    label: "イベントスケジュール",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: "/busy",
    featureKey: "busy",
    label: "ブース・混雑",
    icon: <BoothBusyIcon size={18} />,
  },
  {
    href: "/eat",
    featureKey: "eat",
    label: "飲食エリア",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    href: "/notice",
    featureKey: "notice",
    label: "お知らせ",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  },
  {
    href: "/digital",
    featureKey: "digital",
    label: "デジタルパンフレット",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    href: "/map",
    featureKey: "map",
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

const externalPages = [
  {
    href: "https://isf-webapp.instatus.com/",
    label: "システムステータス",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  },
];

const legalPages = [
  { href: "/legal/terms", label: "利用規約" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/cookie-policy", label: "Cookieポリシー" },
];

export default function HamburgerMenu() {
  const { isHamburgerOpen, closeHamburger, features } = useApp();
  const visiblePages = pages.filter(({ featureKey }) => !featureKey || features[featureKey] !== false);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isHamburgerOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isHamburgerOpen]);

  // メニュー展開中は背面ページのスクロールをロックし、メニュー内のみスクロール可能にする
  // （iOS Safari でも確実に効かせるため body を position: fixed で固定する）
  useEffect(() => {
    if (!isHamburgerOpen) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isHamburgerOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={closeHamburger}
      />
      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-[80vw] max-w-72 overflow-y-auto overscroll-contain bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
        onTransitionEnd={() => { if (!visible) setShouldRender(false); }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
          <span className="font-bold text-[var(--color-text-main)]">メニュー</span>
          <button onClick={closeHamburger} className="flex h-11 w-11 items-center justify-center text-[var(--color-text-sub)]" aria-label="閉じる">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="py-2">
          {visiblePages.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="flex items-center gap-3 px-5 py-4 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-text-sub)] shrink-0">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="mx-4 my-2 border-t border-gray-100 dark:border-gray-800" />

          {supportPages.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="flex items-center gap-3 px-5 py-4 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-text-sub)] shrink-0">{icon}</span>
              {label}
            </Link>
          ))}

          <div className="mx-4 my-2 border-t border-gray-100 dark:border-gray-800" />

          {externalPages.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeHamburger}
              className="flex items-center gap-3 px-5 py-4 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-text-sub)] shrink-0">{icon}</span>
              {label}
              <svg className="ml-auto text-[var(--color-text-sub)] shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          ))}

          <div className="mx-4 my-2 border-t border-gray-100 dark:border-gray-800" />

          {legalPages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeHamburger}
              className="block px-5 py-3 text-sm text-[var(--color-text-sub)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

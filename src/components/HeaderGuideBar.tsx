"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { isMobileOS, isStandalone } from "@/lib/device";

// 同時に表示しない案内バー。
// - install: ブラウザ閲覧中（未インストール）→ アプリ追加のおすすめ（iOS/Android）
// - notification: アプリ化(standalone)中かつ通知未許可 → 通知許可のお願い
type Mode = "none" | "install" | "notification";

const DISMISS_PREFIX = "guidebar_dismissed_";

export default function HeaderGuideBar() {
  const { openPwaGuide } = useApp();
  const [mode, setMode] = useState<Mode>("none");

  useEffect(() => {
    // モバイル端末（Android / Apple）のみ表示
    if (!isMobileOS()) {
      setMode("none");
      return;
    }

    let next: Mode;
    if (isStandalone()) {
      // アプリ化中: 通知が許可済みなら何も出さない
      next =
        "Notification" in window && Notification.permission !== "granted"
          ? "notification"
          : "none";
    } else {
      // 未インストール: アプリ追加のおすすめ
      next = "install";
    }

    if (next !== "none" && sessionStorage.getItem(DISMISS_PREFIX + next)) {
      next = "none";
    }
    setMode(next);
  }, []);

  function dismiss(target: Exclude<Mode, "none">) {
    try {
      sessionStorage.setItem(DISMISS_PREFIX + target, "1");
    } catch {}
    setMode("none");
  }

  async function handleAllow() {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    if (result === "granted") setMode("none");
  }

  if (mode === "none") return null;

  if (mode === "notification") {
    return (
      <div className="flex items-center gap-3 border-b border-yellow-200 bg-yellow-50 px-4 py-2">
        <svg className="shrink-0 text-yellow-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <p className="flex-1 min-w-0 text-xs text-yellow-800">
          通知を許可すると、緊急のお知らせをリアルタイムで受け取れます。
        </p>
        <button
          onClick={handleAllow}
          className="shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-white active:opacity-80"
        >
          許可する
        </button>
        <button onClick={() => dismiss("notification")} aria-label="閉じる" className="shrink-0 text-yellow-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    );
  }

  // install
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 bg-[var(--color-background)] px-4 py-2">
      <svg className="shrink-0 text-[var(--color-primary)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7l3-3 3 3M12 4v8" />
      </svg>
      <p className="flex-1 min-w-0 text-xs text-[var(--color-text-main)]">
        ホーム画面に追加すると、アプリとして快適に使えます。
      </p>
      <button
        onClick={openPwaGuide}
        className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold text-white active:opacity-80"
      >
        追加方法
      </button>
      <button onClick={() => dismiss("install")} aria-label="閉じる" className="shrink-0 text-[var(--color-text-sub)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

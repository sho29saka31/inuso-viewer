"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { isMobileOS, isStandalone } from "@/lib/device";

// ハンバーガーメニューから移設した「ホーム画面への追加方法」案内。
// 通知許可バナーと同じ見た目で、未インストールのモバイル端末にのみ表示する。
export default function PwaInstallBanner() {
  const { openPwaGuide } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isMobileOS() && !isStandalone());
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-background)] px-4 py-3 flex items-start gap-3">
      <svg className="shrink-0 mt-0.5 text-[var(--color-primary)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7l3-3 3 3M12 4v8" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-main)]">ホーム画面に追加してアプリとして使おう</p>
        <p className="text-xs text-[var(--color-text-sub)] mt-0.5">ホーム画面に追加すると、通知の受け取りや素早い起動ができます。</p>
        <button
          onClick={openPwaGuide}
          className="mt-2 text-sm font-bold px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white active:opacity-80"
        >
          追加方法を見る
        </button>
      </div>
    </div>
  );
}

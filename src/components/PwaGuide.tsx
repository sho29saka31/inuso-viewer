"use client";

import { useEffect, useState } from "react";
import { setCookie } from "@/lib/cookies";
import { isIOS } from "@/lib/device";
import { useApp } from "@/contexts/AppContext";

type Props = {
  onComplete: () => void;
};

// iOS Safari の共有ボタン（四角＋上矢印）
function ShareIcon() {
  return (
    <svg className="inline-block align-text-bottom mx-0.5 text-[var(--color-primary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v11" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}

// ブラウザのメニュー（縦三点）
function MenuDotsIcon() {
  return (
    <svg className="inline-block align-text-bottom mx-0.5 text-[var(--color-primary)]" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

export default function PwaGuide({ onComplete }: Props) {
  const { installPrompt, clearInstallPrompt } = useApp();
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
  }, []);

  // Android/Chrome 等、その場でインストールダイアログを出せる場合のみ true
  const canInstall = !ios && !!installPrompt;

  function dismiss() {
    setCookie("pwa_guided", "1");
    onComplete();
  }

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    try {
      await installPrompt.userChoice;
    } catch {}
    clearInstallPrompt();
    dismiss();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-2xl">
        <div className="mb-4 text-center">
          <div className="mb-3 flex justify-center text-[var(--color-primary)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <line x1="12" y1="18" x2="12" y2="18.01"/>
              <path d="M9 7l3-3 3 3M12 4v8"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            ホーム画面に追加して<br />通知を受け取ろう
          </h2>
        </div>

        <div className="mb-6 rounded-xl bg-[var(--color-background)] p-4 text-sm text-[var(--color-text-main)]">
          <p className="mb-2 font-bold">追加方法：</p>
          {ios ? (
            <ol className="list-decimal pl-4 space-y-1.5 text-[var(--color-text-sub)]">
              <li>Safari 下部の共有ボタン<ShareIcon />をタップ</li>
              <li>メニューを下にスクロールし「ホーム画面に追加」をタップ</li>
              <li>右上の「追加」をタップ</li>
            </ol>
          ) : canInstall ? (
            <p className="text-[var(--color-text-sub)]">
              下の「アプリをインストール」をタップすると、インストールの確認ダイアログが表示されます。
            </p>
          ) : (
            <ol className="list-decimal pl-4 space-y-1.5 text-[var(--color-text-sub)]">
              <li>ブラウザのメニュー<MenuDotsIcon />をタップ</li>
              <li>「アプリをインストール」または「ホーム画面に追加」を選択</li>
              <li>表示に従ってインストール</li>
            </ol>
          )}
        </div>

        {canInstall && (
          <button
            onClick={handleInstall}
            className="mb-3 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white active:opacity-80"
          >
            アプリをインストール
          </button>
        )}
        <button
          onClick={dismiss}
          className="w-full rounded-xl py-3.5 text-sm text-[var(--color-text-sub)] underline"
        >
          {canInstall ? "あとで" : "閉じる"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { setCookie } from "@/lib/cookies";

type Props = {
  onComplete: () => void;
};

export default function PwaGuide({ onComplete }: Props) {
  function handleComplete() {
    setCookie("pwa_guided", "1");
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-4 text-center">
          <div className="mb-3 text-5xl">📲</div>
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            ホーム画面に追加して<br />通知を受け取ろう
          </h2>
        </div>

        <div className="mb-6 rounded-xl bg-[var(--color-background)] p-4 text-sm text-[var(--color-text-main)]">
          <p className="mb-2 font-bold">追加方法：</p>
          <ol className="list-decimal pl-4 space-y-1 text-[var(--color-text-sub)]">
            <li>画面下部の共有ボタン（□↑）をタップ</li>
            <li>「ホーム画面に追加」を選択</li>
            <li>「追加」をタップ</li>
          </ol>
        </div>

        <button
          onClick={handleComplete}
          className="mb-3 w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white active:opacity-80"
        >
          ホーム画面に追加する
        </button>
        <button
          onClick={handleComplete}
          className="w-full rounded-xl py-3 text-sm text-[var(--color-text-sub)] underline"
        >
          通知なしで続行する
        </button>
      </div>
    </div>
  );
}

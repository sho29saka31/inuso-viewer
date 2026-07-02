"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-background)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="1.8">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
        エラーが発生しました
      </h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-8 leading-relaxed">
        申し訳ありません。<br />
        もう一度お試しいただくか、ホームに戻ってください。
      </p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="w-full py-3 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-bold shadow-sm"
        >
          再試行
        </button>
        <Link
          href="/top"
          className="w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--color-surface)] text-[var(--color-text-main)] text-sm font-medium text-center"
        >
          ホームへ戻る
        </Link>
        <a
          href="https://isf-webapp.instatus.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-text-sub)] underline underline-offset-2 mt-1"
        >
          システムステータスを確認する
        </a>
      </div>
    </div>
  );
}

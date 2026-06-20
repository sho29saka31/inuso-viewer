"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

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
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-4xl">⚠️</p>
        <h1 className="text-lg font-bold text-gray-800">エラーが発生しました</h1>
        <p className="text-sm text-gray-500">申し訳ありません。もう一度お試しください。</p>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-[#1EA78C] text-white text-sm font-bold"
          >
            再試行
          </button>
          <a
            href="https://inuso-admin.vercel.app/status"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 underline underline-offset-2"
          >
            システムステータスを確認する
          </a>
        </div>
      </div>
    </div>
  );
}

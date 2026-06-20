"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="ja">
      <body style={{ margin: 0, backgroundColor: "#F4FAFA", fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100svh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#E8F5F3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            エラーが発生しました
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.6 }}>
            申し訳ありません。<br />
            もう一度お試しいただくか、ページを再読み込みしてください。
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
            <button
              onClick={reset}
              style={{ width: "100%", padding: "12px 0", borderRadius: 16, background: "#1EA78C", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              再試行
            </button>
            <button
              onClick={() => { window.location.href = "/top"; }}
              style={{ width: "100%", padding: "12px 0", borderRadius: 16, background: "white", color: "#111827", fontSize: 14, fontWeight: 500, border: "1px solid #E5E7EB", cursor: "pointer" }}
            >
              ホームへ戻る
            </button>
            <a
              href="https://inuso-admin.vercel.app/status"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "underline", textUnderlineOffset: 2, marginTop: 4 }}
            >
              システムステータスを確認する
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

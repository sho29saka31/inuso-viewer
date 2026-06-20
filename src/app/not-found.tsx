import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 - ページが見つかりません" };

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-background)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.8">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="11" y1="8" x2="11" y2="11" />
          <circle cx="11" cy="14" r="0.5" fill="var(--color-primary)" stroke="none" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
        ページが見つかりません
      </h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-8 leading-relaxed">
        お探しのページは存在しないか、<br />
        移動または削除された可能性があります。
      </p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <Link
          href="/top"
          className="w-full py-3 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-bold text-center shadow-sm"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}

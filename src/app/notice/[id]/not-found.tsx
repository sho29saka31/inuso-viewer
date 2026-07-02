import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "お知らせが見つかりません" };

export default function NoticeNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-background)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
          <line x1="4" y1="4" x2="20" y2="20"/>
        </svg>
      </div>

      <h1 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
        お知らせが見つかりません
      </h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-8 leading-relaxed">
        このお知らせは削除されたか、<br />
        URLが間違っている可能性があります。
      </p>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <Link
          href="/notice"
          className="w-full py-3 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-bold text-center shadow-sm"
        >
          お知らせ一覧へ
        </Link>
        <Link
          href="/top"
          className="w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-[var(--color-text-main)] text-sm font-medium text-center"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}

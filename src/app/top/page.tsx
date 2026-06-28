import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/firebase-admin";
import { formatDate } from "@/lib/formatDate";
import { getViewerFeatures } from "@/lib/feature-flags";

export const revalidate = 60;
export const metadata: Metadata = { title: "ホーム" };

interface Notice {
  noticeId: string;
  title: string;
  isUrgent: boolean;
  createdAt: { _seconds?: number; seconds?: number } | null;
}

async function getRecentNotices(): Promise<Notice[]> {
  try {
    const db = getDb();
    const snap = await db.collection("notices").orderBy("createdAt", "desc").limit(3).get();
    return snap.docs.map((d) => d.data() as Notice);
  } catch {
    return [];
  }
}

const QUICK_LINKS = [
  {
    href: "/event", label: "日程", featureKey: "event" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: "/booth", label: "ブース", featureKey: "booth" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3h18v4H3z"/><path d="M3 7v13a1 1 0 001 1h16a1 1 0 001-1V7"/><path d="M9 21V11h6v10"/></svg>,
  },
  {
    href: "/busy", label: "混雑", featureKey: "busy" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    href: "/eat", label: "飲食", featureKey: "eat" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    href: "/map", label: "マップ", featureKey: "map" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  },
  {
    href: "/digital", label: "パンフ", featureKey: "digital" as const,
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
];

export default async function TopPage() {
  const [notices, features] = await Promise.all([
    getRecentNotices(),
    getViewerFeatures(),
  ]);

  const visibleLinks = QUICK_LINKS.filter(({ featureKey }) => features[featureKey] !== false);

  return (
    <div className="px-4 py-6 pb-24">
      {/* Hero */}
      <div className="mb-6 rounded-2xl bg-[var(--color-primary)] px-5 py-6 text-white">
        <p className="text-xs opacity-80 mb-1">犬山総合高等学校</p>
        <h1 className="text-2xl font-bold">ISF 文化祭</h1>
        <p className="text-sm opacity-80 mt-1">2026年 いぬそう文化祭</p>
      </div>

      {/* Quick links */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-[var(--color-text-sub)] mb-3">メニュー</h2>
        <div className="grid grid-cols-3 gap-3">
          {visibleLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white border border-gray-100 shadow-sm py-4 text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-[var(--color-primary)]">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent notices */}
      {features.notice !== false && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[var(--color-text-sub)]">最新のお知らせ</h2>
            <Link href="/notice" className="text-xs text-[var(--color-primary)]">すべて見る</Link>
          </div>
          {notices.length === 0 ? (
            <p className="text-sm text-[var(--color-text-sub)]">お知らせはありません。</p>
          ) : (
            <div className="flex flex-col gap-2">
              {notices.map((n) => (
                <Link
                  key={n.noticeId}
                  href={`/notice/${n.noticeId}`}
                  className={`rounded-xl border p-3 flex items-start gap-2 ${
                    n.isUrgent ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
                  }`}
                >
                  {n.isUrgent && (
                    <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-red-500 text-white font-bold mt-0.5">緊急</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-main)] truncate">{n.title}</p>
                    <p className="text-xs text-[var(--color-text-sub)] mt-0.5">{formatDate(n.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

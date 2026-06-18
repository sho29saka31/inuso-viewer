import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/firebase-admin";

export const metadata: Metadata = { title: "ホーム" };

interface Notice {
  noticeId: string;
  title: string;
  isUrgent: boolean;
  createdAt: { _seconds: number } | null;
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
  { href: "/event", label: "日程", icon: "📅" },
  { href: "/booth", label: "ブース", icon: "🏠" },
  { href: "/busy", label: "混雑", icon: "👥" },
  { href: "/eat", label: "飲食", icon: "🍴" },
  { href: "/map", label: "マップ", icon: "🗺️" },
  { href: "/digital", label: "パンフ", icon: "📄" },
];

function formatDate(ts: { _seconds: number } | null | undefined): string {
  if (!ts) return "";
  const d = new Date(ts._seconds * 1000);
  return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default async function TopPage() {
  const notices = await getRecentNotices();

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
          {QUICK_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white border border-gray-100 shadow-sm py-4 text-[var(--color-text-main)] hover:bg-[var(--color-background)] active:bg-[var(--color-background)]"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent notices */}
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
                href="/notice"
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
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/firebase-admin";

export const revalidate = 300;
export const metadata: Metadata = { title: "お知らせ" };

interface Notice {
  noticeId: string;
  title: string;
  authorId: string;
  type?: string;
  isUrgent?: boolean;
  createdAt: { _seconds: number } | null;
}

function resolveType(n: Notice): string {
  if (n.type) return n.type;
  return n.isUrgent ? "urgent" : "info";
}

const TYPE_CONFIG: Record<string, { label: string; card: string; badge: string }> = {
  urgent:  { label: "緊急",    card: "bg-red-50 border-red-200",    badge: "bg-red-500 text-white" },
  warning: { label: "注意",    card: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-500 text-white" },
  info:    { label: "お知らせ", card: "bg-white border-gray-100",    badge: "bg-blue-100 text-blue-700" },
  other:   { label: "その他",  card: "bg-white border-gray-100",    badge: "bg-gray-100 text-gray-600" },
};

async function getNotices(): Promise<{ notices: Notice[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db.collection("notices").orderBy("createdAt", "desc").get();
    return { notices: snap.docs.map((d) => d.data() as Notice) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

function formatDate(ts: { _seconds: number } | null | undefined): string {
  if (!ts) return "";
  const d = new Date(ts._seconds * 1000);
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function NoticePage() {
  const result = await getNotices();

  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">お知らせ</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
        <p className="text-xs text-red-400 mt-2 break-all">{result.error}</p>
      </div>
    );
  }

  const { notices } = result;

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">お知らせ</h1>

      {notices.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">現在お知らせはありません。</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((n) => {
            const type = resolveType(n);
            const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
            return (
              <div
                key={n.noticeId}
                className={`rounded-xl border shadow-sm p-4 ${cfg.card}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-bold ${cfg.badge}`}>{cfg.label}</span>
                  <p className="font-bold text-sm text-[var(--color-text-main)]">{n.title}</p>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-[var(--color-text-sub)]">
                  <span>{n.authorId}</span>
                  <span>{formatDate(n.createdAt)}</span>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    href={`/notice/${n.noticeId}`}
                    className="text-xs text-[var(--color-primary)] font-medium"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

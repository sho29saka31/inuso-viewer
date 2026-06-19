import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebase-admin";

export const revalidate = 30;

interface Notice {
  noticeId: string;
  title: string;
  body: string;
  authorId: string;
  type?: string;
  isUrgent?: boolean;
  createdAt: { seconds?: number; _seconds?: number } | null;
}

function resolveType(n: Notice): string {
  if (n.type) return n.type;
  return n.isUrgent ? "urgent" : "info";
}

const TYPE_CONFIG: Record<string, { label: string; card: string; badge: string }> = {
  urgent:  { label: "緊急",    card: "bg-red-50 border-red-200",       badge: "bg-red-500 text-white" },
  warning: { label: "注意",    card: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-500 text-white" },
  info:    { label: "お知らせ", card: "bg-blue-50 border-blue-200",    badge: "bg-blue-500 text-white" },
  other:   { label: "その他",  card: "bg-gray-50 border-gray-200",    badge: "bg-gray-500 text-white" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const db = getDb();
    const snap = await db.collection("notices").doc(id).get();
    if (!snap.exists) return { title: "お知らせ" };
    const n = snap.data() as Notice;
    return { title: n.title };
  } catch {
    return { title: "お知らせ" };
  }
}

function formatDate(ts: { seconds?: number; _seconds?: number } | null | undefined): string {
  if (!ts) return "";
  const secs = ts.seconds ?? ts._seconds;
  if (secs == null) return "";
  const d = new Date(secs * 1000);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let notice: Notice | null = null;
  try {
    const db = getDb();
    const snap = await db.collection("notices").doc(id).get();
    if (!snap.exists) notFound();
    notice = snap.data() as Notice;
  } catch {
    return (
      <div className="px-4 py-6">
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
      </div>
    );
  }

  const type = resolveType(notice);
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  return (
    <div className="px-4 py-6 pb-24">
      <Link href="/notice" className="text-xs text-[var(--color-primary)] mb-4 inline-block">
        ← お知らせ一覧に戻る
      </Link>

      <div className={`rounded-xl border shadow-sm p-5 mt-2 ${cfg.card}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <h1 className="text-lg font-bold text-[var(--color-text-main)] mb-4">{notice.title}</h1>
        <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap leading-relaxed">{notice.body}</p>
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100 text-xs text-[var(--color-text-sub)]">
          <span>{notice.authorId}</span>
          <span>{formatDate(notice.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

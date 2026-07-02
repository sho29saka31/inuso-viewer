import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebase-admin";
import { formatDate } from "@/lib/formatDate";
import { TYPE_CONFIG, resolveType } from "../noticeConfig";

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

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let notice: Notice | null = null;
  try {
    const db = getDb();
    const snap = await db.collection("notices").doc(id).get();
    if (snap.exists) notice = snap.data() as Notice;
  } catch {
    return (
      <div className="px-4 py-6 pb-24 flex flex-col items-center gap-4 text-center mt-12">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-sub)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="var(--color-text-sub)"/>
        </svg>
        <div>
          <p className="font-bold text-[var(--color-text-main)]">読み込みエラー</p>
          <p className="text-sm text-[var(--color-text-sub)] mt-1">通信に失敗しました。<br />時間をおいて再度お試しください。</p>
        </div>
        <Link href="/notice" className="text-sm text-[var(--color-primary)] underline">お知らせ一覧に戻る</Link>
      </div>
    );
  }

  if (!notice) notFound();

  const type = resolveType(notice);
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  return (
    <div className="px-4 py-6 pb-24">
      <Link href="/notice" className="text-sm text-[var(--color-primary)] mb-2 py-2 inline-block">
        ← お知らせ一覧に戻る
      </Link>

      <div className={`rounded-xl border shadow-sm p-5 mt-2 ${cfg.card}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <h1 className="text-lg font-bold text-[var(--color-text-main)] mb-4">{notice.title}</h1>
        <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap leading-relaxed">{notice.body}</p>
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-[var(--color-text-sub)]">
          <span>{notice.authorId}</span>
          <span>{formatDate(notice.createdAt, { year: true, month: "long" })}</span>
        </div>
      </div>
    </div>
  );
}

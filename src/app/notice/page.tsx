import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const metadata: Metadata = { title: "お知らせ" };

interface Notice {
  noticeId: string;
  title: string;
  body: string;
  authorId: string;
  isUrgent: boolean;
  createdAt: { _seconds: number } | null;
}

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
          {notices.map((n) => (
            <div
              key={n.noticeId}
              className={`rounded-xl border shadow-sm p-4 ${
                n.isUrgent ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {n.isUrgent && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">緊急</span>
                )}
                <p className="font-bold text-sm text-[var(--color-text-main)]">{n.title}</p>
              </div>
              <p className="text-sm text-[var(--color-text-main)] whitespace-pre-wrap mt-1">{n.body}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-[var(--color-text-sub)]">
                <span>{n.authorId}</span>
                <span>{formatDate(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

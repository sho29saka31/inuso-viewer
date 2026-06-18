import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export const metadata: Metadata = { title: "混雑状況" };

const STATUS_LABELS = ["停止中", "非常に閑散", "閑散", "通常", "混雑", "非常に混雑"];
const STATUS_COLORS = [
  "bg-gray-200 text-gray-600",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
];
const STATUS_BAR_COLORS = [
  "bg-gray-300",
  "bg-blue-300",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-red-500",
];

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
}

async function getBooths(): Promise<{ booths: Booth[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db.collection("booths").orderBy("status", "desc").get();
    return { booths: snap.docs.map((d) => d.data() as Booth) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BusyPage() {
  const result = await getBooths();

  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">混雑状況</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
        <p className="text-xs text-red-400 mt-2 break-all">{result.error}</p>
      </div>
    );
  }

  const { booths } = result;

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">混雑状況</h1>
      <p className="text-xs text-[var(--color-text-sub)] mb-6">混雑度の高い順に表示しています</p>

      {booths.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">データがありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {booths.map((booth) => {
            const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
            const barWidth = `${(level / 5) * 100}%`;
            return (
              <div key={booth.boothId} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="font-bold text-sm text-[var(--color-text-main)] truncate flex-1">
                    {booth.name ?? booth.shopName}
                  </p>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[level]}`}>
                    {STATUS_LABELS[level]}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${STATUS_BAR_COLORS[level]}`}
                    style={{ width: barWidth }}
                  />
                </div>
                {booth.location && (
                  <p className="text-xs text-[var(--color-text-sub)] mt-1.5">{booth.location}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

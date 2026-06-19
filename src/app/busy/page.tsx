import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export const metadata: Metadata = { title: "混雑状況" };

const STATUS_LABELS = ["停止中", "非常に閑散", "閑散", "通常", "混雑", "非常に混雑"];
const STATUS_COLORS = [
  "bg-gray-400",
  "bg-blue-300",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-red-500",
];
const STATUS_TEXT_COLORS = [
  "text-gray-600",
  "text-blue-700",
  "text-green-700",
  "text-yellow-700",
  "text-orange-700",
  "text-red-700",
];

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
}

interface MapConfig {
  imageUrl?: string;
}

async function getData(): Promise<{ booths: Booth[]; mapImageUrl: string | null } | { error: string }> {
  try {
    const db = getDb();
    const [boothSnap, mapSnap] = await Promise.all([
      db.collection("booths").orderBy("status", "desc").get(),
      db.collection("config").doc("map").get(),
    ]);
    const booths = boothSnap.docs.map((d) => d.data() as Booth);
    const mapConfig = mapSnap.exists ? (mapSnap.data() as MapConfig) : {};
    return { booths, mapImageUrl: mapConfig.imageUrl ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BusyPage() {
  const result = await getData();

  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">混雑状況</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
        <p className="text-xs text-red-400 mt-2 break-all">{result.error}</p>
      </div>
    );
  }

  const { booths, mapImageUrl } = result;

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold mb-1">混雑状況</h1>
        <p className="text-xs text-[var(--color-text-sub)]">リアルタイム更新 (60秒ごと)</p>
      </div>

      {mapImageUrl && (
        <div className="relative mx-4 mb-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mapImageUrl} alt="校舎フロアマップ" className="w-full h-auto" />

          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div key={lvl} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[lvl]} shrink-0`} />
                <span className="text-white text-[10px]">{STATUS_LABELS[lvl]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {booths.length === 0 ? (
        <p className="px-4 text-sm text-[var(--color-text-sub)]">データがありません。</p>
      ) : (
        <div className="px-4 flex flex-col gap-2">
          {booths.map((booth) => {
            const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
            return (
              <div key={booth.boothId} className="rounded-xl bg-white border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${STATUS_COLORS[level]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[var(--color-text-main)] truncate">
                    {booth.name ?? booth.shopName}
                  </p>
                  {booth.location && (
                    <p className="text-xs text-[var(--color-text-sub)]">{booth.location}</p>
                  )}
                </div>
                <span className={`text-xs font-medium shrink-0 ${STATUS_TEXT_COLORS[level]}`}>
                  {STATUS_LABELS[level]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

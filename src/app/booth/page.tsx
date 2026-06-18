import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const metadata: Metadata = { title: "ブース一覧" };

const STATUS_LABELS = ["停止中", "非常に閑散", "閑散", "通常", "混雑", "非常に混雑"];
const STATUS_COLORS = [
  "bg-gray-200 text-gray-600",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
];

const CATEGORY_LABELS: Record<string, string> = {
  game: "ゲーム",
  food: "食品",
  stage: "ステージ",
  exhibition: "展示",
  other: "その他",
};

interface Booth {
  boothId: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  status: number;
}

async function getBooths(): Promise<{ booths: Booth[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db
      .collection("booths")
      .where("category", "!=", "eat")
      .orderBy("category")
      .get();
    return { booths: snap.docs.map((d) => d.data() as Booth) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BoothPage() {
  const result = await getBooths();

  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">ブース一覧</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
        <p className="text-xs text-red-400 mt-2 break-all">{result.error}</p>
      </div>
    );
  }

  const { booths } = result;

  const grouped = booths.reduce<Record<string, Booth[]>>((acc, b) => {
    const key = b.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">ブース一覧</h1>

      {booths.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">現在登録されているブースはありません。</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-sm font-bold text-[var(--color-text-sub)] uppercase mb-2">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((booth) => (
                  <div key={booth.boothId} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[var(--color-text-main)] truncate">{booth.name}</p>
                        {booth.location && (
                          <p className="text-xs text-[var(--color-text-sub)] mt-0.5">{booth.location}</p>
                        )}
                        {booth.description && (
                          <p className="text-xs text-[var(--color-text-sub)] mt-1 line-clamp-2">{booth.description}</p>
                        )}
                      </div>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booth.status] ?? STATUS_COLORS[3]}`}>
                        {STATUS_LABELS[booth.status] ?? "不明"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

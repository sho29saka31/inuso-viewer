"use client";

import { useState } from "react";

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

export interface Booth {
  boothId: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  status: number;
}

export default function BoothList({ booths }: { booths: Booth[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = Array.from(new Set(booths.map((b) => b.category)));
  const filtered = activeCategory === "all" ? booths : booths.filter((b) => b.category === activeCategory);

  const grouped = filtered.reduce<Record<string, Booth[]>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;
  }, {});

  return (
    <>
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeCategory === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white border border-gray-200 text-[var(--color-text-sub)]"
            }`}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-gray-200 text-[var(--color-text-sub)]"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">該当するブースはありません。</p>
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
    </>
  );
}

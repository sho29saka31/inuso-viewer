"use client";

import { useState } from "react";
import ZoomableMap from "./ZoomableMap";

const STATUS_CONFIG = [
  { label: "停止中",     bg: "#F1F5F9", text: "#64748B" },
  { label: "非常に閑散", bg: "#EFF6FF", text: "#1D4ED8" },
  { label: "閑散",       bg: "#F0FDFA", text: "#0F766E" },
  { label: "通常",       bg: "#F0FDF4", text: "#15803D" },
  { label: "混雑",       bg: "#FFF7ED", text: "#C2410C" },
  { label: "非常に混雑", bg: "#FEF2F2", text: "#B91C1C" },
];

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
}

export default function BusyClient({ booths, floorSvgs }: { booths: Booth[]; floorSvgs: string[] }) {
  const [tab, setTab] = useState<"map" | "list">("map");

  return (
    <>
      {/* タブ切替 */}
      <div className="px-4 flex gap-1 border-b border-gray-100">
        {(["map", "list"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-sub)]"
            }`}
          >
            {t === "map" ? "マップ表示" : "一覧表示"}
          </button>
        ))}
      </div>

      {/* マップ */}
      {tab === "map" && <ZoomableMap floorSvgs={floorSvgs} />}

      {/* 一覧 */}
      {tab === "list" && (
        booths.length === 0 ? (
          <p className="px-4 py-4 text-sm text-[var(--color-text-sub)]">データがありません。</p>
        ) : (
          <div className="px-4 pt-3 flex flex-col gap-2">
            {booths.map((booth) => {
              const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
              const { label, bg, text } = STATUS_CONFIG[level];
              return (
                <div
                  key={booth.boothId}
                  className="rounded-xl bg-white border border-gray-100 shadow-sm p-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[var(--color-text-main)] truncate">
                      {booth.name ?? booth.shopName}
                    </p>
                    {booth.location && (
                      <p className="text-xs text-[var(--color-text-sub)]">{booth.location}</p>
                    )}
                  </div>
                  <span
                    className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
}

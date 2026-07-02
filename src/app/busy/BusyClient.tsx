"use client";

import { useState } from "react";
import ZoomableMap from "./ZoomableMap";
import StaleBanner from "./StaleBanner";
import BoothDetailSheet from "./BoothDetailSheet";
import { useHeatData } from "./useHeatData";
import type { FloorHeatPoint, FloorDim } from "./page";

// SVG側のrect idとFirestoreのboothIdが異なるブースのみ逆引きする。
// page.tsxのBOOTH_ID_TO_SVGと対になる（そちらはboothId→svgId）。
const SVG_ID_TO_BOOTH_ID: Record<string, string> = {
  "club-esports": "club-game",
};

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
  heatScore?: number;
  waitCount?: number;
  isManual?: boolean;
  imageUrl?: string;
  description?: string;
  updatedAt?: { unix?: number; display?: string };
}

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const TABS = [
  { key: "map" as const,  label: "マップ", Icon: MapIcon },
  { key: "list" as const, label: "一覧",   Icon: ListIcon },
];

export default function BusyClient({
  booths,
  floorSvgs,
  floorHeatPoints,
  floorDims,
  initialHeat,
}: {
  booths: Booth[];
  floorSvgs: string[];
  floorHeatPoints: FloorHeatPoint[][];
  floorDims: FloorDim[];
  initialHeat: Record<string, number>;
}) {
  const [tab, setTab] = useState<"map" | "list">("map");
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const heatValues = useHeatData(initialHeat, "/api/booth/heat");

  const handleBoothTap = (svgId: string) => {
    const boothId = SVG_ID_TO_BOOTH_ID[svgId] ?? svgId;
    setSelectedBoothId(boothId);
  };

  const selectedBooth = booths.find((b) => b.boothId === selectedBoothId) ?? null;

  return (
    <>
      <StaleBanner booths={booths} />

      {/* セグメントコントロール */}
      <div className="mx-4 my-3 bg-gray-100 rounded-xl p-1 flex">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 ${
              tab === key
                ? "bg-white shadow-sm text-[var(--color-text-main)]"
                : "text-[var(--color-text-sub)]"
            }`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {/* マップ */}
      {tab === "map" && (
        <ZoomableMap
          floorSvgs={floorSvgs}
          floorHeatPoints={floorHeatPoints}
          floorDims={floorDims}
          heatValues={heatValues}
          onBoothTap={handleBoothTap}
        />
      )}

      {selectedBooth && (
        <BoothDetailSheet booth={selectedBooth} onClose={() => setSelectedBoothId(null)} />
      )}

      {/* 一覧 */}
      {tab === "list" && (
        booths.length === 0 ? (
          <p className="px-4 py-6 text-sm text-center text-[var(--color-text-sub)]">データがありません。</p>
        ) : (
          <div className="px-4 flex flex-col gap-2 pb-4">
            {booths.map((booth) => {
              const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
              const { label, bg, text } = STATUS_CONFIG[level];
              const mode = booth.isManual ? "manual" : "bluetooth";
              return (
                <button
                  key={booth.boothId}
                  type="button"
                  onClick={() => setSelectedBoothId(booth.boothId)}
                  className="w-full text-left rounded-xl bg-white border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 active:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[var(--color-text-main)] truncate">
                      {booth.name ?? booth.shopName}
                    </p>
                    {booth.location && (
                      <p className="text-xs text-[var(--color-text-sub)] mt-0.5">{booth.location}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--color-text-sub)]">
                      {typeof booth.waitCount === "number" && <span>待ち {booth.waitCount}組</span>}
                      {booth.updatedAt?.display && <span>最終更新: {booth.updatedAt.display}</span>}
                      <span>{mode === "manual" ? "手動更新" : "Bluetooth"}</span>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold shrink-0 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )
      )}
    </>
  );
}

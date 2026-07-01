"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  waitCount?: number;
  isManual?: boolean;
  updatedAt?: { unix?: number; display?: string };
}

export default function BoothDetailSheet({ booth, onClose }: { booth: Booth; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
  const { label, bg, text } = STATUS_CONFIG[level];
  const mode = booth.isManual ? "manual" : "bluetooth";

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md rounded-t-2xl bg-white p-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            {booth.name ?? booth.shopName ?? booth.boothId}
          </h2>
          <span
            className="text-xs font-semibold shrink-0 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: bg, color: text }}
          >
            {label}
          </span>
        </div>

        {booth.location && (
          <p className="text-sm text-[var(--color-text-sub)] mb-1">{booth.location}</p>
        )}

        <div className="flex flex-col gap-1 mt-2 text-xs text-[var(--color-text-sub)]">
          {typeof booth.waitCount === "number" && <p>待ち組数: {booth.waitCount}組</p>}
          {booth.updatedAt?.display && <p>最終更新: {booth.updatedAt.display}</p>}
          <p>更新方式: {mode === "manual" ? "手動更新" : "Bluetooth自動更新"}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl bg-gray-100 text-sm font-semibold text-[var(--color-text-main)]"
        >
          閉じる
        </button>
      </div>
    </div>,
    document.body
  );
}

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

const CATEGORY_LABELS: Record<string, string> = {
  class: "クラス発表",
  club: "部活動",
  pe: "有志発表",
  "pe-gym": "有志発表",
  health: "委員会",
  committee: "委員会",
  game: "ゲーム",
  food: "食品",
  eat: "飲食",
  stage: "ステージ",
  exhibition: "展示",
  other: "その他",
};

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
  waitCount?: number;
  isManual?: boolean;
  imageUrl?: string;
  description?: string;
  updatedAt?: { unix?: number; display?: string };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="shrink-0 w-24 text-[var(--color-text-sub)]">{label}</span>
      <span className="flex-1 text-[var(--color-text-main)] break-words">{value}</span>
    </div>
  );
}

export default function BoothDetailSheet({ booth, onClose }: { booth: Booth; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
  const { label, bg, text } = STATUS_CONFIG[level];
  const source = booth.isManual ? "手動更新" : "Bluetooth（自動）";
  const categoryLabel = CATEGORY_LABELS[booth.category] ?? booth.category;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />

        {/* ブース画像 */}
        {booth.imageUrl && (
          // 外部URLを含むため next/image ではなく img を使用
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={booth.imageUrl}
            alt={booth.name ?? booth.shopName ?? booth.boothId}
            className="mb-4 h-44 w-full rounded-xl object-cover bg-gray-100"
          />
        )}

        {/* ブース名 + ステータス */}
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

        {/* 詳細情報 */}
        <div className="flex flex-col gap-2">
          {booth.location && <Row label="場所" value={booth.location} />}
          {booth.category && <Row label="カテゴリ" value={categoryLabel} />}
          {typeof booth.waitCount === "number" && (
            <Row label="待ち組数（推定）" value={`${booth.waitCount}組`} />
          )}
          <Row label="ステータス" value={label} />
          {booth.updatedAt?.display && <Row label="最終更新" value={booth.updatedAt.display} />}
          <Row label="情報元" value={source} />
        </div>

        {/* 詳細文章 */}
        {booth.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--color-text-main)] leading-relaxed">
            {booth.description}
          </p>
        )}

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

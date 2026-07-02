"use client";

import BottomSheet from "@/components/BottomSheet";
import { CATEGORY_LABELS } from "./categoryConfig";

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
  imageUrl?: string;
  boothImage?: string;
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
  const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
  const { label, bg, text } = STATUS_CONFIG[level];
  const source = booth.isManual ? "手動更新" : "Bluetooth（自動）";
  const categoryLabel = CATEGORY_LABELS[booth.category] ?? booth.category;
  // 飲食ブースはimageUrl、それ以外はboothImageにadmin側で保存されるため両方見る
  const imageSrc = booth.imageUrl ?? booth.boothImage;

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pb-8">
        {/* ブース画像 */}
        {imageSrc && (
          // 外部URLを含むため next/image ではなく img を使用
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
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
            <Row label="待ち組数" value={`${booth.waitCount}組`} />
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
    </BottomSheet>
  );
}

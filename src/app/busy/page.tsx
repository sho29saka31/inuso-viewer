import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import * as Sentry from "@sentry/nextjs";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";
import { FLOORMAP_SVG } from "./floormap-svg";
import { categorySortRank } from "./categoryConfig";
import BusyClient from "./BusyClient";

export const revalidate = 300;

export const metadata: Metadata = { title: "混雑状況" };

// ブース枠は流動的ヒートマップキャンバス（下層）を透かして見せるため、
// 半透明の白で統一し、ラベル文字は背景色に依存しない固定の濃色にする。
// 混雑度の色表現はキャンバス側の連続グラデーションが担う。
const BOOTH_RECT_FILL = "rgba(255,255,255,0.55)";
const BOOTH_TEXT_FILL = "#0F172A";

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
  heatScore?: number;
  heatPoint?: { x: number; y: number } | null;
  waitCount?: number;
  isManual?: boolean;
  imageUrl?: string;
  boothImage?: string;
  description?: string;
  updatedAt?: { unix?: number; display?: string };
}

// Firestore boothId と SVG の id が異なるブースのみマッピングする。
// e-スポーツ部はFirestore側もclub-esportsに統一済みのため、現在は
// 特例マッピング不要（SVG idをそのままboothIdとして使うフォールバックで一致する）。
const BOOTH_ID_TO_SVG: Record<string, string> = {};

const FLOOR_VIEWBOXES = [
  "20 110 1360 110", "20 320 1360 290", "20 650 1360 270",
  "20 960 1360 270", "20 1330 1360 110", "1110 1455 280 125",
  "20 1568 880 120",
];

export interface FloorHeatPoint {
  boothId: string;
  x: number;
  y: number;
}

export interface FloorDim {
  width: number;
  height: number;
}

// FLOORMAP_SVG中の<rect id="...">からブース中心座標を1回だけ抽出し、
// 各フロアのviewBoxに応じてフロアローカル座標へ振り分ける。
// heatmap.jsのcanvasオーバーレイをフロアごとに正しい位置へ重ねるために使う。
const SVG_ID_TO_BOOTH_ID: Record<string, string> = Object.fromEntries(
  Object.entries(BOOTH_ID_TO_SVG).map(([boothId, svgId]) => [svgId, boothId])
);

// floorHeatPointsはFirestoreのboothId空間で持つ（/api/booth/heatのレスポンスと同じキー）。
// overrides: 管理画面でブースごとに手動指定されたヒートマップ中心点（SVG viewBox座標系）。
// 指定があればブース矩形の自動中心より優先する。
function extractFloorHeatPoints(
  svgBoothIds: Set<string>,
  overrides: Record<string, { x: number; y: number }>
): { floorHeatPoints: FloorHeatPoint[][]; floorDims: FloorDim[] } {
  const rectRe = /<rect id="([a-z0-9-]+)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g;
  const centers: { id: string; x: number; y: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = rectRe.exec(FLOORMAP_SVG)) !== null) {
    const [, svgId, x, y, width, height] = m;
    if (!svgBoothIds.has(svgId)) continue;
    const boothId = SVG_ID_TO_BOOTH_ID[svgId] ?? svgId;
    const override = overrides[boothId];
    centers.push(
      override
        ? { id: boothId, x: override.x, y: override.y }
        : { id: boothId, x: Number(x) + Number(width) / 2, y: Number(y) + Number(height) / 2 }
    );
  }

  const floorHeatPoints: FloorHeatPoint[][] = [];
  const floorDims: FloorDim[] = [];
  for (const vb of FLOOR_VIEWBOXES) {
    const [vbX, vbY, vbW, vbH] = vb.split(/\s+/).map(Number);
    floorDims.push({ width: vbW, height: vbH });
    floorHeatPoints.push(
      centers
        .filter((c) => c.x >= vbX && c.x <= vbX + vbW && c.y >= vbY && c.y <= vbY + vbH)
        .map((c) => ({ boothId: c.id, x: c.x - vbX, y: c.y - vbY }))
    );
  }
  return { floorHeatPoints, floorDims };
}

async function getData(): Promise<
  | {
      booths: Booth[];
      floorSvgs: string[];
      floorHeatPoints: FloorHeatPoint[][];
      floorDims: FloorDim[];
    }
  | { error: string }
> {
  try {
    const db = getDb();
    const boothSnap = await db.collection("booths").get();
    const booths = boothSnap.docs
      .map((d) => {
        const data = d.data() as Booth;
        if (!data.boothId) data.boothId = d.id;
        return data;
      })
      .sort((a, b) => categorySortRank(a.category) - categorySortRank(b.category));

    const boothIds = new Set<string>();
    for (const booth of booths) {
      const id = booth.boothId ?? "";
      if (!id) continue;
      boothIds.add(BOOTH_ID_TO_SVG[id] ?? id);
    }

    let svg = FLOORMAP_SVG;
    for (const svgId of boothIds) {
      const re = new RegExp(`(<rect\\b[^>]*\\bid="${svgId}"[^>]*\\bfill=")[^"]*(")`);
      svg = svg.replace(re, `$1${BOOTH_RECT_FILL}$2`);
      const textRe = new RegExp(
        `(<rect\\b[^>]*\\bid="${svgId}"[^>]*/>\\s*<text\\b[^>]*\\bfill=")[^"]*(")`
      );
      svg = svg.replace(textRe, `$1${BOOTH_TEXT_FILL}$2`);
    }

    const floorSvgs = FLOOR_VIEWBOXES.map((vb) => {
      const [, , vbW, vbH] = vb.split(/\s+/).map(Number);
      return svg
        .replace(/viewBox="[^"]*"/, `viewBox="${vb}"`)
        .replace(/width="1400" height="1700"/, `width="${vbW}" height="${vbH}" style="display:block"`);
    });

    const heatPointOverrides: Record<string, { x: number; y: number }> = {};
    for (const booth of booths) {
      const id = booth.boothId ?? "";
      if (!id || !booth.heatPoint) continue;
      const { x, y } = booth.heatPoint;
      if (typeof x === "number" && typeof y === "number") heatPointOverrides[id] = { x, y };
    }

    const { floorHeatPoints, floorDims } = extractFloorHeatPoints(boothIds, heatPointOverrides);

    return { booths, floorSvgs, floorHeatPoints, floorDims };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BusyPage() {
  const features = await getViewerFeatures();
  if (!features.busy) return <FeatureDisabled />;
  const result = await getData();

  if ("error" in result) {
    Sentry.captureException(new Error(result.error));
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">混雑状況</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。時間をおいて再度お試しください。</p>
      </div>
    );
  }

  const { booths, floorSvgs, floorHeatPoints, floorDims } = result;

  const initialHeat: Record<string, number> = {};
  for (const booth of booths) {
    const id = booth.boothId ?? "";
    if (!id) continue;
    initialHeat[id] = typeof booth.heatScore === "number" ? booth.heatScore : (booth.status ?? 0) * 20;
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold mb-1">混雑状況</h1>
        <p className="text-xs text-[var(--color-text-sub)]">リアルタイム更新 (60秒ごと)</p>
      </div>
      <BusyClient
        booths={booths}
        floorSvgs={floorSvgs}
        floorHeatPoints={floorHeatPoints}
        floorDims={floorDims}
        initialHeat={initialHeat}
        heatPolling={features.heatPolling}
      />
    </div>
  );
}

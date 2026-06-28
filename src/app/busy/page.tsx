import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import * as Sentry from "@sentry/nextjs";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";
import { FLOORMAP_SVG } from "./floormap-svg";
import ZoomableMap from "./ZoomableMap";

export const revalidate = 60;

export const metadata: Metadata = { title: "混雑状況" };

const STATUS_LABELS = ["停止中", "非常に閑散", "閑散", "通常", "混雑", "非常に混雑"];
const STATUS_DOT_COLORS = [
  "#94A3B8",
  "#2C7BB6",
  "#ABD9E9",
  "#FFFFBF",
  "#FDAE61",
  "#D7191C",
];
const STATUS_TEXT_COLORS = [
  "#64748B",
  "#1E5A8A",
  "#0E7490",
  "#A16207",
  "#C2410C",
  "#B91C1C",
];

const SVG_FILL_COLORS: Record<number, string> = {
  0: "#94A3B8",
  1: "#2C7BB6",
  2: "#ABD9E9",
  3: "#FFFFBF",
  4: "#FDAE61",
  5: "#D7191C",
};

interface Booth {
  boothId: string;
  name?: string;
  shopName?: string;
  category: string;
  location?: string;
  status: number;
}

const BOOTH_ID_TO_SVG: Record<string, string> = {
  "club-game": "club-esports",
  "eat-1": "pta-bazaar",
  "eat-2": "eat-car-1",
  "eat-3": "eat-car-2",
  "eat-4": "eat-car-3",
};

const FLOOR_VIEWBOXES = [
  "20 110 1360 110", "20 320 1360 290", "20 650 1360 270",
  "20 960 1360 270", "20 1330 1360 110", "1110 1455 280 125",
  "20 1568 880 120",
];

async function getData(): Promise<{ booths: Booth[]; floorSvgs: string[] } | { error: string }> {
  try {
    const db = getDb();
    const boothSnap = await db.collection("booths").orderBy("status", "asc").get();
    const booths = boothSnap.docs.map((d) => {
      const data = d.data() as Booth;
      if (!data.boothId) data.boothId = d.id;
      return data;
    });

    const statusMap: Record<string, number> = {};
    for (const booth of booths) {
      const id = booth.boothId ?? "";
      const svgId = BOOTH_ID_TO_SVG[id] ?? id;
      statusMap[svgId] = typeof booth.status === "number" ? booth.status : 0;
    }

    let svg = FLOORMAP_SVG;

    for (const [boothId, status] of Object.entries(statusMap)) {
      if (!boothId) continue;
      const color = SVG_FILL_COLORS[status] ?? SVG_FILL_COLORS[0];
      const re = new RegExp(
        `(<rect\\b[^>]*\\bid="${boothId}"[^>]*\\bfill=")[^"]*(")`
      );
      svg = svg.replace(re, `$1${color}$2`);
    }

    const floorSvgs = FLOOR_VIEWBOXES.map((vb) => {
      const [, , vbW, vbH] = vb.split(/\s+/).map(Number);
      return svg
        .replace(/viewBox="[^"]*"/, `viewBox="${vb}"`)
        .replace(/width="1400" height="1700"/, `width="${vbW}" height="${vbH}" style="display:block"`);
    });

    return { booths, floorSvgs };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BusyPage() {
  if (!(await getViewerFeatures()).busy) return <FeatureDisabled />;
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

  const { booths, floorSvgs } = result;

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold mb-1">混雑状況</h1>
        <p className="text-xs text-[var(--color-text-sub)]">リアルタイム更新 (60秒ごと)</p>
      </div>

      <ZoomableMap floorSvgs={floorSvgs} />

      {booths.length === 0 ? (
        <p className="px-4 text-sm text-[var(--color-text-sub)]">データがありません。</p>
      ) : (
        <div className="px-4 flex flex-col gap-2">
          {booths.map((booth) => {
            const level = Math.min(Math.max(booth.status ?? 0, 0), 5);
            return (
              <div key={booth.boothId} className="rounded-xl bg-white border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-gray-200"
                  style={{ backgroundColor: STATUS_DOT_COLORS[level] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[var(--color-text-main)] truncate">
                    {booth.name ?? booth.shopName}
                  </p>
                  {booth.location && (
                    <p className="text-xs text-[var(--color-text-sub)]">{booth.location}</p>
                  )}
                </div>
                <span
                  className="text-xs font-medium shrink-0"
                  style={{ color: STATUS_TEXT_COLORS[level] }}
                >
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

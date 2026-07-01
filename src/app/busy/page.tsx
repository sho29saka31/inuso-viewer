import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import * as Sentry from "@sentry/nextjs";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";
import { FLOORMAP_SVG } from "./floormap-svg";
import BusyClient from "./BusyClient";

export const revalidate = 300;

export const metadata: Metadata = { title: "混雑状況" };

// オーバーレイ透明度は完全不透明（fill-opacity指定なし）で確定。
// フロアマップは写真ではなく模式図のため下に透過させる背景がなく、
// 不透明の方がラベル文字とのコントラストを確保できるため。
const SVG_FILL_COLORS: Record<number, string> = {
  0: "#94A3B8",
  1: "#2C7BB6",
  2: "#ABD9E9",
  3: "#FFFFBF",
  4: "#FDAE61",
  5: "#D7191C",
};

const SVG_TEXT_COLORS: Record<number, string> = {
  0: "#FFFFFF",
  1: "#FFFFFF",
  2: "#1E3A5F",
  3: "#5D4E00",
  4: "#7C2D12",
  5: "#FFFFFF",
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
  updatedAt?: { unix?: number; display?: string };
}

// Firestore boothId と SVG の id が異なるブースのみマッピングする。
// 飲食（eat-car-1/2/3・pta-bazaar）は boothId と SVG id が一致するため
// 下の statusMap で boothId をそのまま使う（フォールバック）。
const BOOTH_ID_TO_SVG: Record<string, string> = {
  "club-game": "club-esports",
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
      const textColor = SVG_TEXT_COLORS[status] ?? SVG_TEXT_COLORS[0];
      const re = new RegExp(
        `(<rect\\b[^>]*\\bid="${boothId}"[^>]*\\bfill=")[^"]*(")`
      );
      svg = svg.replace(re, `$1${color}$2`);
      const textRe = new RegExp(
        `(<rect\\b[^>]*\\bid="${boothId}"[^>]*/>\\s*<text\\b[^>]*\\bfill=")[^"]*(")`
      );
      svg = svg.replace(textRe, `$1${textColor}$2`);
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
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold mb-1">混雑状況</h1>
        <p className="text-xs text-[var(--color-text-sub)]">リアルタイム更新 (60秒ごと)</p>
      </div>
      <BusyClient booths={booths} floorSvgs={floorSvgs} />
    </div>
  );
}

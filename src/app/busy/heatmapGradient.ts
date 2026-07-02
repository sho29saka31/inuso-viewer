// 青→黄褐→橙→赤の多色相グラデーション。dataviz skillの
// validate_palette.js（categorical, --pairs all）で全隣接ペアの
// CVD分離度(ΔE)が目標値12を上回ることを検証済み（最小16.2、色覚特性
// によらず隣接レベルを判別できる）。旧配色（青→水色→黄→橙→赤の
// RdYlBu反転）と違い、中間色に低コントラストな純黄色は使わない。
// なお明度自体は非単調（通常が最も明るい）。凡例・タップ時の詳細
// シート・一覧のステータス文字表示が常に併記されるため、色だけに
// 依存しない設計になっている。
// 0=停止中(#94A3B8)は対象外。レベル1〜5の色をheatScore 0〜100に均等割りする。
const GRADIENT_STOPS: [number, string][] = [
  [0.0, "#2A78D6"], // 非常に閑散
  [0.25, "#6DA7EC"], // 閑散
  [0.5, "#EDA100"], // 通常
  [0.75, "#EB6834"], // 混雑
  [1.0, "#E34948"], // 非常に混雑
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// alpha(0-255) -> [r,g,b,a] のルックアップテーブルを1回だけ生成する。
export function buildGradientLUT(): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 4);
  const stopsRgb = GRADIENT_STOPS.map(([pos, hex]) => [pos, ...hexToRgb(hex)] as const);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let lo = stopsRgb[0];
    let hi = stopsRgb[stopsRgb.length - 1];
    for (let s = 0; s < stopsRgb.length - 1; s++) {
      if (t >= stopsRgb[s][0] && t <= stopsRgb[s + 1][0]) {
        lo = stopsRgb[s];
        hi = stopsRgb[s + 1];
        break;
      }
    }
    const span = hi[0] - lo[0] || 1;
    const localT = (t - lo[0]) / span;
    lut[i * 4] = lerp(lo[1], hi[1], localT);
    lut[i * 4 + 1] = lerp(lo[2], hi[2], localT);
    lut[i * 4 + 2] = lerp(lo[3], hi[3], localT);
    lut[i * 4 + 3] = i;
  }
  return lut;
}

// heatmap.js方式: ぼかした円形ブラシを1回だけ生成し、各点で使い回す。
// blur(0-1): 1に近いほど中心から外側まで滑らかにフェードする。
export function buildBrush(radius: number, blur: number): HTMLCanvasElement {
  const size = radius * 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  const innerStop = Math.max(0, 1 - blur);
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(innerStop, "rgba(0,0,0,1)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

export const CSS_GRADIENT = `linear-gradient(to right, ${GRADIENT_STOPS.map(
  ([pos, hex]) => `${hex} ${pos * 100}%`
).join(", ")})`;

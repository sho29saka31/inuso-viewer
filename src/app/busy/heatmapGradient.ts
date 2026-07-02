// 既存の6段階ColorBrewer(RdYlBu反転)パレットの色値を流用した連続グラデーション。
// 0=停止中(#94A3B8)は除き、レベル1〜5の色をheatScore 0〜100に均等割りする。
const GRADIENT_STOPS: [number, string][] = [
  [0.0, "#2C7BB6"], // 非常に閑散
  [0.25, "#ABD9E9"], // 閑散
  [0.5, "#FFFFBF"], // 通常
  [0.75, "#FDAE61"], // 混雑
  [1.0, "#D7191C"], // 非常に混雑
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

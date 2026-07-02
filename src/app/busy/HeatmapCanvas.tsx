"use client";

import { useEffect, useRef } from "react";
import { buildBrush, buildGradientLUT } from "./heatmapGradient";

const RADIUS = 120;
const BLUR = 0.85;
const MAX_OPACITY = 0.75;
const MIN_OPACITY = 0.15;

export interface HeatPoint {
  x: number;
  y: number;
  value: number; // 0-100
}

// heatmap.js相当の描画をcanvas 2Dで直接行う軽量実装。
// 1) 各点をぼかしブラシでグレースケール(alpha)キャンバスに重ね描き
// 2) alpha値をグラデーションLUTで着色し、min/maxOpacityで透明度を補正
export default function HeatmapCanvas({
  width,
  height,
  points,
}: {
  width: number;
  height: number;
  points: HeatPoint[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const alphaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushRef = useRef<HTMLCanvasElement | null>(null);
  const lutRef = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    brushRef.current = buildBrush(RADIUS, BLUR);
    lutRef.current = buildGradientLUT();
  }, []);

  useEffect(() => {
    const alpha = document.createElement("canvas");
    alpha.width = width;
    alpha.height = height;
    alphaCanvasRef.current = alpha;
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const alphaCanvas = alphaCanvasRef.current;
    const brush = brushRef.current;
    const lut = lutRef.current;
    if (!canvas || !alphaCanvas || !brush || !lut) return;

    const alphaCtx = alphaCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    if (!alphaCtx || !ctx) return;

    alphaCtx.clearRect(0, 0, width, height);
    for (const p of points) {
      const v = Math.max(0, Math.min(100, p.value));
      if (v <= 0) continue;
      alphaCtx.globalAlpha = v / 100;
      alphaCtx.drawImage(brush, p.x - RADIUS, p.y - RADIUS);
    }
    alphaCtx.globalAlpha = 1;

    const alphaData = alphaCtx.getImageData(0, 0, width, height);
    const out = ctx.createImageData(width, height);
    const src = alphaData.data;
    const dst = out.data;
    for (let i = 0; i < src.length; i += 4) {
      const a = src[i + 3];
      if (a === 0) continue;
      const li = a * 4;
      dst[i] = lut[li];
      dst[i + 1] = lut[li + 1];
      dst[i + 2] = lut[li + 2];
      dst[i + 3] = Math.round((MIN_OPACITY + (a / 255) * (MAX_OPACITY - MIN_OPACITY)) * 255);
    }
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(out, 0, 0);
  }, [points, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ width, height }}
    />
  );
}

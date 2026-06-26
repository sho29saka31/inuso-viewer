"use client";

import { useRef, useState, useCallback, useMemo, type TouchEvent, type WheelEvent } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const FLOORS = [
  { label: "5F", viewBox: "20 110 1360 110" },
  { label: "4F", viewBox: "20 320 1360 290" },
  { label: "3F", viewBox: "20 650 1360 270" },
  { label: "2F", viewBox: "20 960 1360 270" },
  { label: "1F", viewBox: "20 1330 1360 110" },
  { label: "体育館", viewBox: "20 1445 1360 120" },
  { label: "屋外", viewBox: "20 1568 1360 120" },
];

const LEGEND = [
  { label: "停止中", color: "#94A3B8" },
  { label: "非常に閑散", color: "#2C7BB6" },
  { label: "閑散", color: "#ABD9E9" },
  { label: "通常", color: "#FFFFBF" },
  { label: "混雑", color: "#FDAE61" },
  { label: "非常に混雑", color: "#D7191C" },
];

export default function ZoomableMap({ svgHtml }: { svgHtml: string }) {
  const [floor, setFloor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const floorSvgs = useMemo(() => {
    return FLOORS.map((f) => {
      const [, , vbW, vbH] = f.viewBox.split(/\s+/).map(Number);
      return svgHtml
        .replace(/viewBox="[^"]*"/, `viewBox="${f.viewBox}"`)
        .replace(
          /width="1400" height="1700"/,
          `width="${vbW}" height="${vbH}" style="display:block"`,
        );
    });
  }, [svgHtml]);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const clampTranslate = useCallback((x: number, y: number, s: number) => {
    const cont = containerRef.current;
    const content = contentRef.current;
    if (!cont || !content) return { x, y };
    const baseW = content.offsetWidth;
    const baseH = content.offsetHeight;
    const minX = Math.min(0, cont.clientWidth - baseW * s);
    const minY = Math.min(0, cont.clientHeight - baseH * s);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * delta));
      setTranslate((t) => clampTranslate(t.x, t.y, next));
      return next;
    });
  }, [clampTranslate]);

  const getTouchDist = (e: TouchEvent) => {
    const [a, b] = [e.touches[0], e.touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: getTouchDist(e), scale };
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      dragRef.current = { startX: t.clientX, startY: t.clientY, origX: translate.x, origY: translate.y };
    }
  }, [scale, translate]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const newDist = getTouchDist(e);
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchRef.current.scale * (newDist / pinchRef.current.dist)));
      setScale(newScale);
      setTranslate((t) => clampTranslate(t.x, t.y, newScale));
    } else if (e.touches.length === 1 && dragRef.current) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;
      setTranslate(clampTranslate(dragRef.current.origX + dx, dragRef.current.origY + dy, scale));
    }
  }, [scale, clampTranslate]);

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
    dragRef.current = null;
  }, []);

  const switchFloor = useCallback((i: number) => {
    setFloor(i);
    resetView();
  }, [resetView]);

  const vb = FLOORS[floor].viewBox;
  const [, , , vbH] = vb.split(/\s+/).map(Number);
  const containerH = Math.min(360, Math.max(220, vbH + 10));

  return (
    <div>
      {/* フロアタブ */}
      <div className="flex gap-1 px-4 mb-2 overflow-x-auto scrollbar-hide">
        {FLOORS.map((f, i) => (
          <button
            key={f.label}
            onClick={() => switchFloor(i)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              i === floor
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 active:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* マップ */}
      <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        <div
          ref={containerRef}
          className="w-full overflow-hidden touch-none relative bg-[#F1F5F9]"
          style={{ height: `${containerH}px` }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={contentRef}
            className="w-max h-max"
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "0 0",
              transition: pinchRef.current || dragRef.current ? "none" : "transform 0.15s ease-out",
            }}
            dangerouslySetInnerHTML={{ __html: floorSvgs[floor] }}
          />

          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-black/5 to-transparent" />

          {scale > 1 && (
            <button
              onClick={resetView}
              className="absolute top-2 right-2 bg-white/90 border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-700 shadow-sm active:bg-gray-100"
            >
              リセット
            </button>
          )}
        </div>

        {/* 凡例 */}
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-1.5 flex items-center justify-center gap-2 flex-wrap">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-0.5">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0 border border-gray-300"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="px-4 mb-3 text-[11px] text-gray-400 text-center">
        横にスクロール・ピンチで拡大できます
      </p>
    </div>
  );
}

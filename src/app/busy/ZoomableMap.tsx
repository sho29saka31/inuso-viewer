"use client";

import { useRef, useState, useCallback, type TouchEvent, type WheelEvent } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export default function ZoomableMap({ svgHtml }: { svgHtml: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const clampTranslate = useCallback((x: number, y: number, s: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxX = (el.scrollWidth * (s - 1)) / 2;
    const maxY = (el.scrollHeight * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * delta));
      if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const getTouchDist = (e: TouchEvent) => {
    const [a, b] = [e.touches[0], e.touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: getTouchDist(e), scale };
    } else if (e.touches.length === 1 && scale > 1) {
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
      if (newScale === MIN_SCALE) setTranslate({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && dragRef.current && scale > 1) {
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

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full overflow-hidden touch-none"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "center top",
            transition: pinchRef.current || dragRef.current ? "none" : "transform 0.15s ease-out",
          }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>
      {scale > 1 && (
        <button
          onClick={resetZoom}
          className="absolute top-2 right-2 bg-white/90 border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-700 shadow-sm"
        >
          リセット
        </button>
      )}
    </div>
  );
}

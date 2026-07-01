"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";

const PULL_THRESHOLD = 64;
const MAX_PULL = 100;

export default function PullToRefresh() {
  const { refresh, isRefreshing } = useApp();
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);
  const pullYRef = useRef(0);
  const isRefreshingRef = useRef(isRefreshing);

  useEffect(() => { isRefreshingRef.current = isRefreshing; }, [isRefreshing]);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      // ポップアップ表示中（BottomSheet/HamburgerMenu）はスクロールロックのため無効化
      if (isRefreshingRef.current) return;
      if (document.body.style.position === "fixed") return;
      if (window.scrollY > 0) return;
      startYRef.current = e.touches[0].clientY;
      draggingRef.current = true;
      setIsDragging(true);
    }

    function handleTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy <= 0) {
        pullYRef.current = 0;
        setPullY(0);
        return;
      }
      // 画面本来のpull-to-refresh・バウンドと競合しないよう抑止
      e.preventDefault();
      const clamped = Math.min(dy * 0.5, MAX_PULL);
      pullYRef.current = clamped;
      setPullY(clamped);
    }

    function handleTouchEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      if (pullYRef.current > PULL_THRESHOLD) {
        refresh();
      }
      pullYRef.current = 0;
      setPullY(0);
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [refresh]);

  const progress = Math.min(pullY / PULL_THRESHOLD, 1);
  const visible = pullY > 4 || isRefreshing;
  const RESTING_Y = 20;
  const HIDDEN_Y = -48;
  const translateY = isRefreshing
    ? RESTING_Y
    : visible
    ? Math.min(pullY - 24, RESTING_Y)
    : HIDDEN_Y;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: visible ? 1 : 0,
        transition: isDragging ? "none" : "transform 0.2s ease, opacity 0.2s ease",
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          className={isRefreshing ? "animate-spin" : ""}
          style={!isRefreshing ? { transform: `rotate(${progress * 360}deg)` } : undefined}
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
      </div>
    </div>
  );
}

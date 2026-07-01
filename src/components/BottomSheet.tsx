"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const startYRef = useRef(0);
  const dragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // スクロールロック（iOS Safari 対応: position:fixed + scrollY 記憶）
  useEffect(() => {
    if (!mounted) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.overflow = "hidden";
    style.width = "100%";
    return () => {
      style.position = "";
      style.top = "";
      style.overflow = "";
      style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [mounted]);

  function onHandleTouchStart(e: React.TouchEvent) {
    startYRef.current = e.touches[0].clientY;
    dragging.current = true;
  }

  function onHandleTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const dy = e.touches[0].clientY - startYRef.current;
    setTranslateY(Math.max(0, dy));
  }

  function onHandleTouchEnd() {
    dragging.current = false;
    if (translateY > 80) {
      onClose();
    } else {
      setTranslateY(0);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: translateY === 0 ? "transform 0.25s cubic-bezier(0.32,0.72,0,1)" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ドラッグハンドル */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab"
          style={{ touchAction: "none" }}
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
        >
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

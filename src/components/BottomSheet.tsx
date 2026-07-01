"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CLOSE_THRESHOLD = 80;
const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, [role='button']";

export default function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);
  const translateYRef = useRef(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

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

  // ボタン・リンク以外のエリアをドラッグでシートを閉じる（iOSのシート挙動を再現）
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || !mounted) return;

    function handleTouchStart(e: TouchEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      if (sheet!.scrollTop > 0) return;
      startYRef.current = e.touches[0].clientY;
      draggingRef.current = true;
    }

    function handleTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy <= 0) {
        translateYRef.current = 0;
        setTranslateY(0);
        return;
      }
      // 下方向ドラッグ中はページ側のpull-to-refreshやバウンドと競合しないよう抑止
      e.preventDefault();
      translateYRef.current = dy;
      setTranslateY(dy);
    }

    function handleTouchEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (translateYRef.current > CLOSE_THRESHOLD) {
        onCloseRef.current();
      } else {
        setTranslateY(0);
      }
    }

    sheet.addEventListener("touchstart", handleTouchStart, { passive: true });
    sheet.addEventListener("touchmove", handleTouchMove, { passive: false });
    sheet.addEventListener("touchend", handleTouchEnd);
    return () => {
      sheet.removeEventListener("touchstart", handleTouchStart);
      sheet.removeEventListener("touchmove", handleTouchMove);
      sheet.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        ref={sheetRef}
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-2xl bg-white shadow-xl"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: translateY === 0 ? "transform 0.25s cubic-bezier(0.32,0.72,0,1)" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 20_000;
const TRANSITION_MS = 1000;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// heatScoreを定期ポーリングし、新しい値を受け取るたびに約1秒でease補間する。
// タブが非アクティブな間(document.hidden)はポーリングをスキップし、
// 新しい値が来ない限りrAFループも走らないため実質的にアニメーションも止まる。
export function useHeatData(
  initial: Record<string, number>,
  fetchUrl: string
): Record<string, number> {
  const [display, setDisplay] = useState<Record<string, number>>(initial);
  const displayedRef = useRef<Record<string, number>>(initial);
  const fromRef = useRef<Record<string, number>>(initial);
  const targetRef = useRef<Record<string, number>>(initial);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // requestAnimationFrame内から自身を再度呼び出すため、const束縛のTDZを避けてrefで保持する。
  // refに閉じ込めるのはref群のみで状態や props は持たないため、マウント時に1回だけ設定すればよい。
  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    tickRef.current = () => {
      const now = performance.now();
      const t = Math.min(1, (now - startRef.current) / TRANSITION_MS);
      const eased = easeOutCubic(t);
      const from = fromRef.current;
      const to = targetRef.current;
      const next: Record<string, number> = {};
      for (const id of Object.keys(to)) {
        const a = from[id] ?? to[id];
        next[id] = a + (to[id] - a) * eased;
      }
      displayedRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(() => tickRef.current());
      } else {
        rafRef.current = null;
      }
    };
  }, []);

  const applyNewValues = useCallback((values: Record<string, number>) => {
    fromRef.current = displayedRef.current;
    targetRef.current = values;
    startRef.current = performance.now();
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => tickRef.current());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(fetchUrl, { cache: "no-store" });
        if (!res.ok) return;
        const data: { boothId: string; heatScore: number }[] = await res.json();
        if (cancelled) return;
        const values: Record<string, number> = {};
        for (const d of data) values[d.boothId] = d.heatScore;
        applyNewValues(values);
      } catch {
        // ネットワークエラー時は直前の表示を維持する
      }
    };

    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [fetchUrl, applyNewValues]);

  return display;
}

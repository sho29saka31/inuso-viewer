"use client";

import { useEffect, useState } from "react";

const STALE_THRESHOLD_MS = 15 * 60 * 1000;

interface Booth {
  status: number;
  isManual?: boolean;
  updatedAt?: { unix?: number };
}

// Bluetoothによる自動更新ブースのみを対象にする。
// 手動運用ブースはオペレーターが必要な時にしか更新しないため、
// 単純な経過時間だけでは「途絶」と判定できない。
export default function StaleBanner({ booths }: { booths: Booth[] }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const autoBooths = booths.filter((b) => !b.isManual && b.status !== 0);
  if (autoBooths.length === 0) return null;

  const isStale = autoBooths.some((b) => {
    const unix = b.updatedAt?.unix;
    return typeof unix !== "number" || now - unix > STALE_THRESHOLD_MS;
  });

  if (!isStale) return null;

  return (
    <div className="mx-4 mb-3 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-800 flex items-start gap-2">
      <span>⚠️</span>
      <span>現在最新情報が取得できません。しばらくしてから再度ご確認ください。</span>
    </div>
  );
}

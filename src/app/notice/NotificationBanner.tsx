"use client";

import { useEffect, useState } from "react";

export default function NotificationBanner() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      setPermission("denied");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  async function handleRequest() {
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  if (permission === null || permission === "granted") return null;

  return (
    <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 flex items-start gap-3">
      <svg className="shrink-0 mt-0.5 text-yellow-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-yellow-800">プッシュ通知が許可されていません</p>
        <p className="text-xs text-yellow-700 mt-0.5">緊急のお知らせをリアルタイムで受け取るには通知を許可してください。</p>
        {permission === "default" && (
          <button
            onClick={handleRequest}
            className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-500 text-white"
          >
            通知を許可する
          </button>
        )}
      </div>
    </div>
  );
}

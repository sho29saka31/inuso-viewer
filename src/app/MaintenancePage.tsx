"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { revalidateAll } from "@/app/actions";

export default function MaintenancePage() {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6 text-center">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: "#9CA3AF" }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
      <h1 style={{ fontSize: "1.125rem", fontWeight: "700" }}>サービスは現在停止中です</h1>
      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>しばらくお待ちください。</p>
      <button
        onClick={() => startRefresh(async () => { try { await revalidateAll(); } catch {} router.refresh(); })}
        disabled={isRefreshing}
        style={{
          marginTop: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          padding: "0.5rem 1.25rem",
          borderRadius: "0.5rem",
          border: "1px solid #D1D5DB",
          background: "#fff",
          color: "#374151",
          fontWeight: "600",
          cursor: isRefreshing ? "not-allowed" : "pointer",
          opacity: isRefreshing ? 0.6 : 1,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
        再読み込みする
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

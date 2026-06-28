"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { revalidateAll } from "@/app/actions";

const ADMIN_FEATURES_URL = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "") + "/db/features";

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
      <a
        href={ADMIN_FEATURES_URL}
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          padding: "0.5rem 1.25rem",
          borderRadius: "0.5rem",
          background: "#1EA78C",
          color: "#fff",
          fontWeight: "700",
          textDecoration: "none",
        }}
      >
        機能ON/OFF設定ページへ
      </a>
      <button
        onClick={() => startRefresh(async () => { try { await revalidateAll(); } catch {} router.refresh(); })}
        aria-label="再読み込み"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-sub)] hover:bg-[var(--color-background)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          className={isRefreshing ? "animate-spin" : ""}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
      </button>
    </div>
  );
}

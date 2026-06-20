"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Notice {
  noticeId: string;
  title: string;
  authorId: string;
  target?: string;
  type?: string;
  isUrgent?: boolean;
  createdAt: { seconds?: number; _seconds?: number } | null;
}

interface UserRole {
  role: "student" | "teacher" | "guest";
  grade?: string;
}

const TYPE_CONFIG: Record<string, { label: string; card: string; badge: string }> = {
  urgent:  { label: "緊急",    card: "bg-red-50 border-red-200",       badge: "bg-red-500 text-white" },
  warning: { label: "注意",    card: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-500 text-white" },
  info:    { label: "お知らせ", card: "bg-blue-50 border-blue-200",    badge: "bg-blue-500 text-white" },
  other:   { label: "その他",  card: "bg-gray-50 border-gray-200",    badge: "bg-gray-500 text-white" },
};

function resolveType(n: Notice): string {
  if (n.type) return n.type;
  return n.isUrgent ? "urgent" : "info";
}

function formatDate(ts: { seconds?: number; _seconds?: number } | null | undefined): string {
  if (!ts) return "";
  const secs = ts.seconds ?? ts._seconds;
  if (secs == null) return "";
  const d = new Date(secs * 1000);
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getUserRole(): UserRole | null {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith("user_role="))?.split("=")[1];
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function shouldShow(notice: Notice, userRole: UserRole | null): boolean {
  const target = notice.target ?? "all";
  if (target === "all") return true;
  if (!userRole) return target === "guest";
  const { role, grade } = userRole;
  if (target === "guest") return role === "guest";
  if (target === "edu") return role === "student";
  if (target === "prof") return role === "teacher";
  if (target === "1nen") return role === "student" && grade === "1";
  if (target === "2nen") return role === "student" && grade === "2";
  if (target === "3nen") return role === "student" && grade === "3";
  return true;
}

export default function NoticeList({ notices }: { notices: Notice[] }) {
  const [userRole, setUserRole] = useState<UserRole | null | undefined>(undefined);

  useEffect(() => {
    setUserRole(getUserRole());
  }, []);

  // フィルタリング前はすべて表示（SSR後のhydration flash防止）
  const filtered = userRole === undefined ? notices : notices.filter((n) => shouldShow(n, userRole));

  if (filtered.length === 0) {
    return <p className="text-sm text-[var(--color-text-sub)]">現在お知らせはありません。</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((n) => {
        const type = resolveType(n);
        const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
        return (
          <div key={n.noticeId} className={`rounded-xl border shadow-sm p-4 ${cfg.card}`}>
            <div className="flex items-start gap-2 mb-1">
              <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-bold ${cfg.badge}`}>{cfg.label}</span>
              <p className="font-bold text-sm text-[var(--color-text-main)]">{n.title}</p>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-[var(--color-text-sub)]">
              <span>{n.authorId}</span>
              <span>{formatDate(n.createdAt)}</span>
            </div>
            <div className="flex justify-end mt-2">
              <Link href={`/notice/${n.noticeId}`} className="text-xs text-[var(--color-primary)] font-medium">
                詳細を見る →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

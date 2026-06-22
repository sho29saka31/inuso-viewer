"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie } from "@/lib/cookies";
import { formatDate } from "@/lib/formatDate";
import { TYPE_CONFIG, resolveType } from "./noticeConfig";

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

function getUserRole(): UserRole | null {
  try {
    const raw = getCookie("user_role");
    if (!raw) return null;
    return JSON.parse(raw);
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
  // 未知のtargetはフォールスルーせず非表示
  return false;
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
              <span>{formatDate(n.createdAt, { month: "long" })}</span>
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

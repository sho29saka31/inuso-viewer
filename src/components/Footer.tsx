"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import AllMenuSheet from "@/components/AllMenuSheet";

type FeatureKey = "event" | "busy" | "eat";

const tabs: { href: string; label: string; featureKey?: FeatureKey; icon: (active: boolean) => React.ReactNode }[] = [
  {
    href: "/event",
    featureKey: "event",
    label: "日程",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "currentColor"} strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/busy",
    featureKey: "busy",
    label: "混雑",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "currentColor"} strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/top",
    label: "ホーム",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "currentColor"} strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/eat",
    featureKey: "eat",
    label: "飲食",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "currentColor"} strokeWidth="1.8">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
];

const LEGAL_PATHS = ["/legal/terms", "/legal/privacy", "/legal/cookie-policy"];

export default function Footer() {
  const pathname = usePathname();
  const { features } = useApp();
  const [showAllMenu, setShowAllMenu] = useState(false);

  if (LEGAL_PATHS.includes(pathname)) return null;

  const visibleTabs = tabs.filter(({ featureKey }) => !featureKey || features[featureKey] !== false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white pb-safe">
        <div className="flex items-center h-16">
          {visibleTabs.map(({ href, label, icon }) => {
            const active =
              href === "/top"
                ? pathname === "/top" || pathname === "/"
                : href === "/eat"
                ? pathname === href || pathname.startsWith("/eat")
                : pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-0.5"
                aria-label={label}
              >
                {active ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-md">
                    {icon(active)}
                  </div>
                ) : (
                  <span className="text-[var(--color-text-sub)]">
                    {icon(active)}
                  </span>
                )}
                <span className={`text-xs font-medium ${active ? "text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
            aria-label="すべてのメニュー"
            onClick={() => setShowAllMenu(true)}
          >
            <span className="text-[var(--color-text-sub)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span className="text-xs font-medium text-[var(--color-text-sub)]">すべて</span>
          </button>
        </div>
      </footer>

      {showAllMenu && <AllMenuSheet onClose={() => setShowAllMenu(false)} />}
    </>
  );
}

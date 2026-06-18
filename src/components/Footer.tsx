"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/event",
    label: "日程",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/booth",
    label: "ブース",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/busy",
    label: "混雑",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/eat",
    label: "飲食",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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

  if (LEGAL_PATHS.includes(pathname)) return null;

  const homeActive = pathname === "/top" || pathname === "/";

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white pb-safe">
      <div className="flex items-end">
        {/* Left 2 tabs */}
        {tabs.slice(0, 2).map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
                active ? "text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"
              }`}
            >
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Home center button */}
        <Link
          href="/top"
          className="flex flex-col items-center justify-center px-4 pb-1"
          aria-label="ホーム"
        >
          <div className={`-mt-5 flex h-14 w-14 flex-col items-center justify-center rounded-full border-4 border-white shadow-md transition-colors ${
            homeActive ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary)] opacity-80"
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className={`mt-0.5 text-xs font-medium ${homeActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"}`}>
            ホーム
          </span>
        </Link>

        {/* Right 2 tabs */}
        {tabs.slice(2).map(({ href, label, icon }) => {
          const active = pathname === href || (href === "/eat" && pathname.startsWith("/eat"));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
                active ? "text-[var(--color-primary)]" : "text-[var(--color-text-sub)]"
              }`}
            >
              <span>{icon}</span>
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

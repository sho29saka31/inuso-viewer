"use client";

import { useState } from "react";
import FaqCookieReset from "./FaqCookieReset";

interface FaqItem {
  q: string;
  a: string;
  resetButton?: boolean;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export default function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {faqs.map(({ category, items }) => (
        <section key={category}>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">{category}</h2>
          <div className="flex flex-col gap-2">
            {items.map(({ q, a, resetButton }, i) => {
              const key = `${category}-${i}`;
              const open = openKey === key;
              return (
                <div key={key} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-2"
                    onClick={() => setOpenKey(open ? null : key)}
                    aria-expanded={open}
                  >
                    <span className="text-sm font-bold text-[var(--color-text-main)]">Q. {q}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className={`shrink-0 text-[var(--color-text-sub)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-sm text-[var(--color-text-sub)] leading-relaxed mt-3 whitespace-pre-line">A. {a}</p>
                      {resetButton && (
                        <div className="mt-4">
                          <FaqCookieReset />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

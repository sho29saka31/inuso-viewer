"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function FilterModal({
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  title: string;
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-xs max-h-[70vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-3">{title}</h3>
        <div className="flex flex-col gap-1">
          {options.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelect(key);
                onClose();
              }}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                key === selected
                  ? "bg-[var(--color-background)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-main)]"
              }`}
            >
              {label}
              {key === selected && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

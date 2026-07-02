"use client";

import { useState } from "react";
import SelectModal from "./SelectModal";

export default function SelectField({
  label,
  placeholder = "▼ 選択してください",
  title,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder?: string;
  title: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.key === value)?.label ?? placeholder;

  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-[var(--color-text-sub)]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)] px-3 py-2 text-sm text-left"
      >
        <span className={value ? "text-[var(--color-text-main)]" : "text-[var(--color-text-sub)]"}>
          {selectedLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--color-text-sub)]">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <SelectModal
          title={title}
          options={options}
          selected={value}
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

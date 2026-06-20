"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-[var(--color-text-main)] leading-relaxed whitespace-pre-line mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[var(--color-text-sub)]"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

interface AlertDialogProps {
  message: string;
  onClose: () => void;
}

export function AlertDialog({ message, onClose }: AlertDialogProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-[var(--color-text-main)] leading-relaxed whitespace-pre-line mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}

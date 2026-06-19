"use client";

import { useState, useTransition } from "react";

interface ContactFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export default function ContactForm({ action }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await action(fd);
      setResult(res);
    });
  }

  if (result?.success) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
        <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="font-bold text-sm text-green-700 mb-1">送信しました</p>
        <p className="text-xs text-green-600">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {result && !result.success && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{result.message}</p>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-text-main)]">
          種別 <span className="text-red-500">*</span>
        </span>
        <select name="category" required className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">選択してください</option>
          <option value="bug">アプリの不具合・エラー</option>
          <option value="display">表示がおかしい</option>
          <option value="data">データが正しくない</option>
          <option value="notification">通知に関するご質問</option>
          <option value="other">その他</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-text-main)]">
          ユーザー種別
        </span>
        <select name="userType" className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">選択してください</option>
          <option value="student">生徒</option>
          <option value="teacher">教員</option>
          <option value="parent">保護者</option>
          <option value="guest">来賓・一般来場者</option>
          <option value="other">その他</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-text-main)]">
          使用端末・ブラウザ
        </span>
        <input
          name="device"
          className="border rounded-lg px-3 py-2 text-sm"
          placeholder="例: iPhone 15 / Safari"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--color-text-main)]">
          内容 <span className="text-red-500">*</span>
        </span>
        <textarea
          name="body"
          required
          rows={5}
          className="border rounded-lg px-3 py-2 text-sm resize-none"
          placeholder="発生している問題や質問を詳しくお書きください。"
        />
      </label>

      <p className="text-xs text-[var(--color-text-sub)]">
        ※ 個人情報（氏名・連絡先等）は入力しないでください。
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm disabled:opacity-60"
      >
        {isPending ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}

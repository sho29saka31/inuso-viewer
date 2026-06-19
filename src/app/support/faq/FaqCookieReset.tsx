"use client";

import { deleteCookie } from "@/lib/cookies";

export default function FaqCookieReset() {
  function handleReset() {
    if (!confirm("ユーザー情報をリセットしますか？\n次回アクセス時にユーザー種別の選択からやり直せます。")) return;
    deleteCookie("user_role");
    alert("ユーザー情報をリセットしました。次回アクセス時に再選択できます。");
  }

  return (
    <div className="mt-10 border-t border-gray-100 pt-6">
      <p className="mb-3 text-xs text-[var(--color-text-sub)]">
        ユーザー種別をリセットしたい場合は以下のボタンを押してください。
        （同意・PWA案内の情報はリセットされません）
      </p>
      <button
        onClick={handleReset}
        className="w-full rounded-xl border border-[var(--color-danger)] py-3 text-sm font-bold text-[var(--color-danger)] active:bg-red-50"
      >
        ユーザー情報をリセットする
      </button>
    </div>
  );
}

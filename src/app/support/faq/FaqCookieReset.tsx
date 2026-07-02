"use client";

import { deleteCookie } from "@/lib/cookies";

export default function FaqCookieReset() {
  function handleReset() {
    if (!confirm("ユーザー種別・学年クラス情報をリセットしますか？")) return;
    deleteCookie("user_role");
    deleteCookie("user_grade");
    alert("ユーザー情報をリセットしました。ページを再読み込みします。");
    window.location.reload();
  }

  return (
    <button
      onClick={handleReset}
      className="w-full rounded-xl border border-[var(--color-danger)] py-3 text-sm font-bold text-[var(--color-danger)] active:bg-red-50 dark:active:bg-red-950"
    >
      ユーザー種別・学年をリセットする
    </button>
  );
}

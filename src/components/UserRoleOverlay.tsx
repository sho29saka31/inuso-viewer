"use client";

import { useState } from "react";
import { setCookie } from "@/lib/cookies";

type Props = {
  onComplete: () => void;
};

type Role = "student" | "teacher" | "parent" | "visitor" | "";

export default function UserRoleOverlay({ onComplete }: Props) {
  const [role, setRole] = useState<Role>("");
  const [grade, setGrade] = useState("");
  const [cls, setCls] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  function handleSkip() {
    setCookie("user_role", JSON.stringify({ role: "guest" }));
    onComplete();
  }

  function handleSubmit() {
    setError("");
    if (!role) {
      setError("ユーザー種別を選択してください。");
      return;
    }
    if (role === "student") {
      if (!grade || !cls) {
        setError("学年とクラスを選択してください。");
        return;
      }
      if (!/^\d{4}$/.test(studentId)) {
        setError("学籍番号は4桁の数字で入力してください。");
        return;
      }
      const expectedPrefix = `${grade}${cls}`;
      if (studentId.slice(0, 2) !== expectedPrefix) {
        setError("入力内容に誤りがあります。");
        return;
      }
      const suffix = parseInt(studentId.slice(2), 10);
      if (suffix < 1 || suffix > 40) {
        setError("入力内容に誤りがあります。");
        return;
      }
      setCookie("user_role", JSON.stringify({ role: "student", grade, class: cls, studentId }));
    } else if (role === "teacher") {
      setCookie("user_role", JSON.stringify({ role: "teacher", grade: grade || "none" }));
    } else {
      setCookie("user_role", JSON.stringify({ role: "guest" }));
    }
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-2xl">
        <h2 className="mb-2 text-center text-lg font-bold text-[var(--color-text-main)]">
          あなたについて教えてください
        </h2>
        <p className="mb-6 text-center text-sm text-[var(--color-text-sub)]">
          入力した情報はこの端末にのみ保存されます。
        </p>

        <div className="mb-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[var(--color-text-sub)]">
              あなたは
            </label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value as Role); setGrade(""); setCls(""); setStudentId(""); }}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
              style={{ fontSize: "16px" }}
            >
              <option value="">▼ 選択してください</option>
              <option value="student">生徒</option>
              <option value="teacher">教員</option>
              <option value="parent">保護者</option>
              <option value="visitor">来賓</option>
            </select>
          </div>

          {(role === "student" || role === "teacher") && (
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-sub)]">
                {role === "teacher" ? "担当学年（任意）" : "学年"}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
              style={{ fontSize: "16px" }}
              >
                <option value="">▼ 選択してください</option>
                <option value="1">1年</option>
                <option value="2">2年</option>
                <option value="3">3年</option>
                {role === "teacher" && <option value="none">なし</option>}
              </select>
            </div>
          )}

          {role === "student" && (
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-sub)]">
                クラス
              </label>
              <select
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
              style={{ fontSize: "16px" }}
              >
                <option value="">▼ 選択してください</option>
                <option value="1">1組</option>
                <option value="2">2組</option>
                <option value="3">3組</option>
                <option value="4">4組</option>
              </select>
            </div>
          )}

          {role === "student" && (
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--color-text-sub)]">
                学籍番号（4桁）
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
                placeholder="例: 1234"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
              style={{ fontSize: "16px" }}
              />
            </div>
          )}
        </div>

        {error && (
          <p className="mb-3 text-center text-xs text-[var(--color-danger)]">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!role}
          className={`mb-3 w-full rounded-xl py-3 text-sm font-bold transition-colors ${
            role
              ? "bg-[var(--color-primary)] text-white active:opacity-80"
              : "cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
          }`}
        >
          進める
        </button>
        <button
          onClick={handleSkip}
          className="w-full rounded-xl py-3 text-sm text-[var(--color-text-sub)] underline"
        >
          情報入力をスキップする
        </button>

        <div className="mt-4 space-y-1 text-center text-xs text-[var(--color-text-sub)]">
          <p>※ 入力した情報は外部に送信されません。</p>
          <p>※ 入力情報を間違えないでください。</p>
          <p>※ 入力情報の変更を後からすることはできません。</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { setCookie } from "@/lib/cookies";

type Props = {
  onComplete: () => void;
};

export default function ConsentOverlay({ onComplete }: Props) {
  const [terms, setTerms] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [cookie, setCookieConsent] = useState(true);

  const allChecked = terms && privacy && cookie;

  function handleSubmit() {
    const value = JSON.stringify({ terms, privacy, cookie, consentAt: Date.now() });
    setCookie("consent", value);
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-2 text-center text-2xl font-bold text-[var(--color-primary)]">ISF</div>
        <h1 className="mb-1 text-center text-lg font-bold text-[var(--color-text-main)]">
          犬山総合高等学校 文化祭アプリ
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--color-text-sub)]">
          当アプリ利用時に以下の項目に同意してください。
        </p>

        <div className="mb-6 flex flex-col gap-1">
          <label className="flex cursor-pointer items-center gap-3 text-sm py-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[var(--color-primary)]"
            />
            <span>
              <Link href="/legal/terms" className="underline text-[var(--color-primary)]">
                利用規約
              </Link>
              に同意します。
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm py-2">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[var(--color-primary)]"
            />
            <span>
              <Link href="/legal/privacy" className="underline text-[var(--color-primary)]">
                プライバシーポリシー
              </Link>
              に同意します。
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm py-2">
            <input
              type="checkbox"
              checked={cookie}
              onChange={(e) => setCookieConsent(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[var(--color-primary)]"
            />
            <span>
              <Link href="/legal/cookie-policy" className="underline text-[var(--color-primary)]">
                Cookieポリシー
              </Link>
              に同意します。
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allChecked}
          className={`w-full rounded-xl py-3.5 text-sm font-bold transition-colors ${
            allChecked
              ? "bg-[var(--color-primary)] text-white active:opacity-80"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          全て同意して進める
        </button>
      </div>
    </div>
  );
}

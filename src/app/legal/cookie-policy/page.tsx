import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookieポリシー" };

const cookies = [
  { name: "cookie_consent", purpose: "Cookie同意状態の記録", expiry: "1年" },
  { name: "user_role", purpose: "ユーザー種別・学年・クラス情報", expiry: "セッション終了まで" },
  { name: "notice_read_at", purpose: "お知らせの既読日時", expiry: "セッション終了まで" },
];

export default function CookiePolicyPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">Cookieポリシー</h1>
      <p className="text-xs text-[var(--color-text-sub)] mb-6">最終更新: 2026年9月1日</p>

      <div className="flex flex-col gap-5">
        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">Cookieとは</h2>
          <p className="text-sm text-[var(--color-text-sub)]">Cookieとは、ウェブサイトがブラウザに保存する小さなテキストデータです。本アプリでは以下のCookieを使用します。</p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-2">使用しているCookie一覧</h2>
          <div className="flex flex-col gap-2">
            {cookies.map((c) => (
              <div key={c.name} className="rounded-xl bg-white border border-gray-100 shadow-sm p-3">
                <p className="font-mono text-xs text-[var(--color-primary)] mb-1">{c.name}</p>
                <p className="text-sm text-[var(--color-text-main)]">{c.purpose}</p>
                <p className="text-xs text-[var(--color-text-sub)] mt-0.5">有効期間: {c.expiry}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">Cookieの無効化</h2>
          <p className="text-sm text-[var(--color-text-sub)]">ブラウザの設定からCookieを無効にすることができますが、その場合、本アプリの一部機能（ユーザー種別の保持・既読管理等）が動作しなくなります。</p>
        </section>
      </div>
    </div>
  );
}

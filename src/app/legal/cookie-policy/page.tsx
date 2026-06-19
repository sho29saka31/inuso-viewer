import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookieポリシー" };

const cookies = [
  { name: "cookie_consent", purpose: "Cookie同意状態の記録", expiry: "最大2026年9月30日", essential: true },
  { name: "user_role", purpose: "ユーザー種別（生徒・教員・保護者・来賓等）", expiry: "最大2026年9月30日", essential: true },
  { name: "user_grade", purpose: "学年・クラス情報（生徒の場合）", expiry: "最大2026年9月30日", essential: true },
  { name: "notice_read_at", purpose: "お知らせの既読日時", expiry: "最大2026年9月30日", essential: false },
  { name: "fcm_token", purpose: "プッシュ通知用デバイストークン（Firebase Cloud Messaging）", expiry: "通知許可を取り消すまで（最大2026年9月30日）", essential: false },
];

export default function CookiePolicyPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">Cookieポリシー</h1>
      <p className="text-xs text-[var(--color-text-sub)] mb-6">最終更新: 2026年9月1日</p>

      <div className="flex flex-col gap-5">
        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">Cookieとは</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">
            Cookieとは、ウェブサイトがブラウザに保存する小さなテキストデータです。本アプリではCookieおよびLocalStorageを使用して、ユーザー設定や既読情報などを端末に保存します。これらの情報はISFプロジェクトのサーバーには送信されません（プッシュ通知用トークンを除く）。
          </p>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed mt-2">
            本アプリのCookieはすべて<strong>2026年9月30日</strong>をもって有効期限が終了します（サービス一時閉鎖に伴う措置）。
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-2">使用しているCookie一覧</h2>
          <div className="flex flex-col gap-2">
            {cookies.map((c) => (
              <div key={c.name} className="rounded-xl bg-white border border-gray-100 shadow-sm p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-xs text-[var(--color-primary)]">{c.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${c.essential ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-600"}`}>
                    {c.essential ? "必須" : "機能"}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-main)]">{c.purpose}</p>
                <p className="text-xs text-[var(--color-text-sub)] mt-0.5">有効期間: {c.expiry}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">Cookieの無効化</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed mb-2">
            ブラウザの設定からCookieを無効にすることができます。ただしその場合、以下の機能が動作しなくなります。
          </p>
          <ul className="flex flex-col gap-1 text-sm text-[var(--color-text-sub)]">
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />ユーザー種別の保持（毎回選択が必要になります）</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />お知らせの既読管理</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />プッシュ通知の受信</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">第三者のCookie</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed mb-2">
            本アプリはVercel（ホスティング）およびFirebase（データベース・プッシュ通知）を利用しています。これらのサービスが独自のCookieやトラッキング技術を使用する場合があります。詳細は各サービスのプライバシーポリシーをご参照ください。
          </p>
          <div className="flex flex-col gap-1">
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-white border border-gray-100 shadow-sm px-3 py-2 text-sm text-[var(--color-primary)]"
            >
              Vercel プライバシーポリシー
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-white border border-gray-100 shadow-sm px-3 py-2 text-sm text-[var(--color-primary)]"
            >
              Google / Firebase プライバシーポリシー
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">同意の撤回</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">
            Cookie同意はいつでも撤回できます。「よくある質問」ページ最下部の「すべてのCookieを削除」ボタンを押すことで、すべてのCookie・設定情報を削除できます。削除後は再度同意バナーが表示されます。
          </p>
        </section>
      </div>
    </div>
  );
}

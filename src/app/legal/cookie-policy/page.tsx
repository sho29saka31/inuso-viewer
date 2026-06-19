import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookieポリシー" };

const cookies = [
  { name: "cookie_consent", purpose: "Cookie同意状態の記録", expiry: "1年", essential: true },
  { name: "user_role", purpose: "ユーザー種別（生徒・教員・保護者・来賓等）", expiry: "1年", essential: true },
  { name: "user_grade", purpose: "学年・クラス情報（生徒の場合）", expiry: "1年", essential: true },
  { name: "notice_read_at", purpose: "お知らせの既読日時", expiry: "30日", essential: false },
  { name: "fcm_token", purpose: "プッシュ通知用デバイストークン（Firebase Cloud Messaging）", expiry: "通知許可を取り消すまで", essential: false },
];

export default function CookiePolicyPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">Cookieポリシー</h1>
      <p className="text-xs text-[var(--color-text-sub)] mb-6">最終更新: 2026年9月1日</p>

      <div className="flex flex-col gap-5">
        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">Cookieとは</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">Cookieとは、ウェブサイトがブラウザに保存する小さなテキストデータです。本アプリではCookieおよびLocalStorageを使用して、ユーザー設定や既読情報などを端末に保存します。これらの情報は当委員会のサーバーには送信されません（プッシュ通知用トークンを除く）。</p>
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
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">ブラウザの設定からCookieを無効にすることができます。ただしその場合、以下の機能が動作しなくなります。\n・ユーザー種別の保持（毎回選択が必要になります）\n・お知らせの既読管理\n・プッシュ通知の受信</p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">第三者のCookie</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">本アプリはVercel（ホスティング）およびFirebase（データベース・プッシュ通知）を利用しています。これらのサービスが独自のCookieやトラッキング技術を使用する場合があります。詳細は各サービスのプライバシーポリシーをご参照ください。\n・Vercel: vercel.com/legal/privacy-policy\n・Google / Firebase: policies.google.com/privacy</p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">同意の撤回</h2>
          <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">Cookie同意はいつでも撤回できます。「よくある質問」ページ下部の「Cookieをリセット」ボタンを押すことで、すべての設定をリセットできます。再度同意バナーが表示されます。</p>
        </section>
      </div>
    </div>
  );
}

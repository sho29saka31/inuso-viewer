import type { Metadata } from "next";
import FaqCookieReset from "./FaqCookieReset";

export const metadata: Metadata = { title: "よくある質問" };

const faqs = [
  {
    category: "基本",
    items: [
      {
        q: "アプリを使うのに登録は必要ですか？",
        a: "登録は不要です。初回アクセス時にユーザー種別（生徒・教員・保護者・来賓など）を選択するだけでご利用いただけます。",
      },
      {
        q: "スマートフォン以外でも使えますか？",
        a: "はい。タブレット・PCのブラウザでもご利用いただけます。ただしプッシュ通知はモバイルブラウザ・PWAでのみ対応しています。",
      },
      {
        q: "アプリのデータはどのくらい更新されますか？",
        a: "お知らせは作成・更新・削除された際にリアルタイムで反映されます。イベント・ブース情報は最大30秒、混雑状況は最大60秒でキャッシュが更新されます。",
      },
    ],
  },
  {
    category: "通知",
    items: [
      {
        q: "プッシュ通知はどうすれば受け取れますか？",
        a: "iOSの場合はSafariでサイトを開き「ホーム画面に追加」してからPWAとして起動し、通知を許可してください。AndroidはChromeなどのブラウザで通知許可をオンにすることで受け取れます。",
      },
      {
        q: "通知が届きません。",
        a: "①ブラウザの通知設定がオンになっているか確認してください。②iOSの場合はホーム画面から起動しているかご確認ください。③端末の「設定 → 通知」でブラウザ/アプリの通知が許可されているかご確認ください。",
      },
      {
        q: "通知が多すぎます。止める方法はありますか？",
        a: "ブラウザまたは端末の通知設定からISFの通知をオフにしてください。iOSはホーム画面のアイコンを長押し→「通知をオフ」、Androidは設定→アプリ→通知でオフにできます。",
      },
    ],
  },
  {
    category: "アカウント・設定",
    items: [
      {
        q: "ユーザー種別を変更したいです。",
        a: "生徒・教員として登録した場合は変更できません。保護者・来賓・スキップで登録した方はヘッダーのアカウントアイコンから再選択できます。",
      },
      {
        q: "既読状態をリセットしたいです。",
        a: "下部の「Cookieをリセット」ボタンを押すことでリセットできます。ユーザー種別の設定も初期化されますのでご注意ください。",
      },
      {
        q: "オフラインでも使えますか？",
        a: "キャッシュされたページは一部閲覧できますが、最新情報の取得にはネット接続が必要です。",
      },
    ],
  },
  {
    category: "ブース・イベント",
    items: [
      {
        q: "ブースの混雑状況はリアルタイムですか？",
        a: "実行委員会スタッフが随時更新しており、最大60秒のキャッシュ遅延があります。目安としてご参照ください。",
      },
      {
        q: "ブースの場所が分かりません。",
        a: "「混雑」タブのフロアマップをご確認ください。また各ブース詳細ページに場所の情報が記載されています。",
      },
      {
        q: "飲食ブースのメニューはどこで見られますか？",
        a: "フッターの「飲食」タブから各ブースのメニュー・価格一覧を確認できます。",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="mb-6 text-xl font-bold">よくある質問</h1>

      <div className="flex flex-col gap-8">
        {faqs.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">{category}</h2>
            <div className="flex flex-col gap-3">
              {items.map(({ q, a }) => (
                <div key={q} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <p className="font-bold text-sm text-[var(--color-text-main)]">Q. {q}</p>
                  <p className="mt-2 text-sm text-[var(--color-text-sub)] leading-relaxed">A. {a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <FaqCookieReset />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "プライバシーポリシー" };

const sections = [
  {
    title: "1. 基本方針",
    body: "ISFプロジェクト（以下「ISFプロジェクト」）は、ISF文化祭アプリ（以下「本アプリ」）の利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本アプリにおける情報の収集・利用・管理の方針を定めます。",
  },
  {
    title: "2. 収集する情報",
    body: "本アプリは以下の情報をデバイス内（Cookie / LocalStorage）にのみ保存します。\n・ユーザー種別（生徒・教員・保護者・来賓・スキップ）\n・学年・クラス（生徒の場合）\n・お知らせの既読日時\n・Cookie同意状態\n・プッシュ通知の購読情報（FCMトークン）\n\n上記のうちFCMトークンはプッシュ通知配信のためFirebase Cloud Messagingに送信されますが、個人を特定する情報とは紐付けられません。その他の情報はサーバーへは送信されません。",
  },
  {
    title: "3. 情報の利用目的",
    body: "収集した情報は以下の目的にのみ使用します。\n・ユーザー種別に応じた適切なコンテンツの表示\n・お知らせの既読・未読管理\n・プッシュ通知の配信（同意した利用者のみ）\n・Cookie同意状態の管理\n\n上記以外の目的には使用せず、第三者への提供・販売は行いません。",
  },
  {
    title: "4. Cookieの使用",
    body: "本アプリはCookieおよびLocalStorageを使用して上記の情報を保存します。ブラウザの設定によりCookieを無効にすることができますが、その場合、ユーザー種別の保持・お知らせの既読管理・プッシュ通知等の機能が正常に動作しなくなります。詳細は「Cookieポリシー」をご参照ください。",
  },
  {
    title: "5. アクセス解析・外部サービス",
    body: "本アプリはVercel（米Vercel Inc.）のホスティングを利用しており、アクセスログ（IPアドレス・ブラウザ情報等）がVercelのサーバーに記録される場合があります。またFirebase（Google LLC）を利用しており、データ通信がGoogleのサーバーを経由します。さらにエラー監視のためSentry（米Functional Software, Inc.）を利用しており、アプリ上で発生した技術的なエラー情報（IPアドレス・ブラウザ情報・スタックトレース等）がSentryのサーバーに送信される場合があります。これらの情報の取り扱いについては各社のプライバシーポリシーに従います。",
  },
  {
    title: "6. 未成年者の利用",
    body: "本アプリは犬山総合高等学校の生徒が主に利用します（未成年者を含む）。収集する情報は上記「2. 収集する情報」に限定しており、個人を特定する情報（氏名・住所・電話番号等）は一切収集しません。",
  },
  {
    title: "7. 情報の保存期間",
    body: "デバイス内に保存された情報は、利用者がCookieをリセットするか、ブラウザのデータを消去するまで保持されます。ISFプロジェクトのサーバーには個人情報を保存していないため、ISFプロジェクト側での削除要求は対象外となります。",
  },
  {
    title: "8. ポリシーの変更",
    body: "本ポリシーは必要に応じて変更することがあります。変更後のポリシーは本アプリ上に掲載した時点で効力を生じます。重要な変更がある場合はお知らせにて告知します。",
  },
  {
    title: "9. お問い合わせ",
    body: "お問い合わせは受け付けていません。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">プライバシーポリシー</h1>
      <p className="text-xs text-[var(--color-text-sub)] mb-6">最終更新: 2026年9月1日</p>

      <div className="flex flex-col gap-5">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-sm font-bold text-[var(--color-text-main)] mb-1">{s.title}</h2>
            <p className="text-sm text-[var(--color-text-sub)] whitespace-pre-line leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

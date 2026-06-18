import type { Metadata } from "next";

export const metadata: Metadata = { title: "プライバシーポリシー" };

const sections = [
  {
    title: "1. 収集する情報",
    body: "本アプリは以下の情報をデバイス内（Cookie/LocalStorage）に保存します。\n・ユーザー種別（生徒・教員・保護者・来賓等）\n・お知らせの既読状態\n・Cookie同意状態\n\nこれらの情報はサーバーには送信されません。",
  },
  {
    title: "2. 情報の利用目的",
    body: "収集した情報は、本アプリの機能提供（ユーザー種別に応じた表示・お知らせ管理）のみに使用します。第三者への提供は行いません。",
  },
  {
    title: "3. Cookieの使用",
    body: "本アプリはCookieを使用して上記の情報を保存します。ブラウザの設定によりCookieを無効にすることができますが、一部機能が正常に動作しない場合があります。",
  },
  {
    title: "4. アクセス解析",
    body: "本アプリはVercelのホスティングを利用しており、Vercelのアクセスログ（IPアドレス等）が記録される場合があります。詳細はVercelのプライバシーポリシーをご参照ください。",
  },
  {
    title: "5. お問い合わせ",
    body: "本ポリシーに関するお問い合わせは、犬山総合高等学校文化祭実行委員会までご連絡ください。",
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
            <p className="text-sm text-[var(--color-text-sub)] whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

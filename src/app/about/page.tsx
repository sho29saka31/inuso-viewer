import type { Metadata } from "next";

export const metadata: Metadata = { title: "制作情報" };

const techStack = [
  {
    name: "Next.js 16（App Router）",
    desc: "フロントエンドフレームワーク。サーバーコンポーネント・ISRキャッシュを活用し、高速なページ配信を実現。",
  },
  {
    name: "Firebase Firestore",
    desc: "Google提供のNoSQLデータベース。ブース・通知・イベント・混雑状況データをリアルタイムに管理。",
  },
  {
    name: "Firebase Cloud Messaging（FCM）",
    desc: "プッシュ通知配信インフラ。お知らせ作成時に対象ユーザーへ即時通知を送信。",
  },
  {
    name: "Tailwind CSS",
    desc: "ユーティリティファーストのCSSフレームワーク。カスタムカラー変数（--color-primary等）でテーマを統一管理。",
  },
  {
    name: "Vercel",
    desc: "ホスティング・デプロイ基盤。ISRによるエッジキャッシュとon-demandキャッシュ無効化で最新データを高速提供。",
  },
  {
    name: "PWA（Progressive Web App）",
    desc: "ホーム画面インストール・Service Workerによるオフライン対応・プッシュ通知受信を実現。",
  },
  {
    name: "Google Analytics（GA4）",
    desc: "Googleが提供するアクセス解析サービス。Cookie同意をいただいたユーザーのアクセス情報を収集し、アプリ改善に活用。",
  },
  {
    name: "Sentry",
    desc: "エラー監視サービス。アプリで発生した技術的なエラーをリアルタイムで検知・収集し、品質向上に活用。IPアドレス等の技術情報が収集される場合があります。",
  },
  {
    name: "M PLUS Rounded 1c（Googleフォント）",
    desc: "本アプリ全体で使用しているフォント。Google Fonts経由でホスティングされ、フォントデータ読み込み時にGoogleのサーバーにリクエストが発生します。",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">制作情報</h1>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">アプリ概要</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: "アプリ名", value: "ISF — いぬそう文化祭アプリ" },
              { label: "主催", value: "ISFプロジェクト" },
              { label: "開催日", value: "2026年9月7日（月）・8日（火）" },
              { label: "バージョン", value: "1.0.0" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-[var(--color-surface)] border border-gray-100 dark:border-gray-700 shadow-sm px-4 py-3">
                <p className="text-xs text-[var(--color-text-sub)] mb-0.5">{label}</p>
                <p className="font-bold text-sm text-[var(--color-text-main)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">技術スタック</h2>
          <div className="flex flex-col gap-2">
            {techStack.map(({ name, desc }) => (
              <div key={name} className="rounded-xl bg-[var(--color-surface)] border border-gray-100 dark:border-gray-700 shadow-sm px-4 py-3">
                <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">{name}</p>
                <p className="text-xs text-[var(--color-text-sub)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">法的事項</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: "利用規約", href: "/legal/terms" },
              { label: "プライバシーポリシー", href: "/legal/privacy" },
              { label: "Cookieポリシー", href: "/legal/cookie-policy" },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="flex items-center justify-between rounded-xl bg-[var(--color-surface)] border border-gray-100 dark:border-gray-700 shadow-sm px-4 py-3 text-sm text-[var(--color-text-main)]">
                {label}
                <span className="text-[var(--color-text-sub)]">→</span>
              </a>
            ))}
          </div>
        </section>

        <p className="text-xs text-center text-[var(--color-text-sub)] mt-2">
          © 2026 ISFプロジェクト
        </p>
      </div>
    </div>
  );
}

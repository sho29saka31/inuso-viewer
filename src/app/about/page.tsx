import type { Metadata } from "next";

export const metadata: Metadata = { title: "制作情報" };

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
              { label: "主催", value: "犬山総合高等学校 文化祭実行委員会" },
              { label: "開催日", value: "2026年9月7日（月）・8日（火）" },
              { label: "バージョン", value: "1.0.0" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3">
                <p className="text-xs text-[var(--color-text-sub)] mb-0.5">{label}</p>
                <p className="font-bold text-sm text-[var(--color-text-main)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">制作チーム</h2>
          <div className="flex flex-col gap-2">
            {[
              { role: "企画・ディレクション", member: "文化祭実行委員会 情報部門" },
              { role: "アプリ設計・開発", member: "文化祭実行委員会 技術担当" },
              { role: "UI/UXデザイン", member: "文化祭実行委員会 技術担当" },
              { role: "インフラ・デプロイ", member: "Vercel（ホスティング）" },
              { role: "データベース", member: "Firebase Firestore（Google Cloud）" },
            ].map(({ role, member }) => (
              <div key={role} className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3">
                <p className="text-xs text-[var(--color-text-sub)] mb-0.5">{role}</p>
                <p className="text-sm text-[var(--color-text-main)]">{member}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">技術スタック</h2>
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
            <ul className="flex flex-col gap-2">
              {[
                { name: "Next.js 16（App Router）", desc: "フロントエンド・サーバーサイドレンダリング" },
                { name: "Firebase Firestore", desc: "リアルタイムデータベース" },
                { name: "Firebase Cloud Messaging", desc: "プッシュ通知配信" },
                { name: "Tailwind CSS", desc: "UIスタイリング" },
                { name: "Vercel", desc: "ホスティング・ISRキャッシュ管理" },
                { name: "PWA（Progressive Web App）", desc: "ホーム画面インストール・オフライン対応" },
              ].map(({ name, desc }) => (
                <li key={name} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-main)]">{name}</span>
                    <span className="text-xs text-[var(--color-text-sub)] ml-2">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
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
              <a key={href} href={href} className="flex items-center justify-between rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3 text-sm text-[var(--color-text-main)]">
                {label}
                <span className="text-[var(--color-text-sub)]">→</span>
              </a>
            ))}
          </div>
        </section>

        <p className="text-xs text-center text-[var(--color-text-sub)] mt-2">
          © 2026 犬山総合高等学校 文化祭実行委員会
        </p>
      </div>
    </div>
  );
}

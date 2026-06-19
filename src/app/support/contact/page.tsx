import type { Metadata } from "next";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function ContactPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-6 leading-relaxed">
        アプリに関するご意見・不具合報告・その他お問い合わせはこちらをご確認ください。
      </p>

      <div className="flex flex-col gap-4">
        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">当日のお問い合わせ</h2>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">本部テント（会場内）</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">アプリの不具合・展示内容に関するご質問は、会場内の本部テントスタッフにお声がけください。</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">文化祭実行委員会</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">各エリアを巡回している実行委員会スタッフにもお声がけいただけます。腕章を目印にしてください。</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 border-l-4 border-l-red-400">
              <p className="text-sm font-bold text-red-600 mb-1">緊急時</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">体調不良・事故・トラブル等の緊急時は、最寄りの教員または本部テントに直接お知らせください。</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">アプリ・技術的なお問い合わせ</h2>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">よくある質問を先にご確認ください</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">通知が届かない・ユーザー種別を変更したいなどのご質問は、<a href="/faq" className="text-[var(--color-primary)] underline">よくある質問</a>に解決策を掲載しています。</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">技術担当への連絡</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">アプリのバグ・表示崩れ・データ誤りを発見した場合は、文化祭実行委員会を通じて技術担当にお伝えください。スクリーンショットがあると対応がスムーズです。</p>
            </div>
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
      </div>
    </div>
  );
}

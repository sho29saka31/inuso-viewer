import type { Metadata } from "next";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function ContactPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-6">
        アプリに関するご意見・不具合報告はこちらからお送りください。
      </p>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">文化祭実行委員会</p>
          <p className="text-sm text-[var(--color-text-sub)]">アプリの不具合・お問い合わせは、文化祭実行委員会の担当者または先生にお声がけください。</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">緊急時</p>
          <p className="text-sm text-[var(--color-text-sub)]">緊急時は最寄りの教員または本部テントにお知らせください。</p>
        </div>
      </div>
    </div>
  );
}

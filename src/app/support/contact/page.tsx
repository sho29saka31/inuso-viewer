import type { Metadata } from "next";
export const metadata: Metadata = { title: "お問い合わせ" };
export default function ContactPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">お問い合わせ</h1>
      <p className="text-sm text-[var(--color-text-sub)]">（準備中）</p>
    </div>
  );
}

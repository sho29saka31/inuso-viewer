import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "お問い合わせ" };

async function submitContact(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  "use server";
  try {
    const category = (formData.get("category") as string).trim();
    const body = (formData.get("body") as string).trim();
    const userType = (formData.get("userType") as string).trim();
    const device = (formData.get("device") as string).trim();

    if (!category || !body) {
      return { success: false, message: "種別と内容は必須です。" };
    }

    const db = getDb();
    await db.collection("contacts").add({
      category,
      body,
      userType: userType || null,
      device: device || null,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "お問い合わせを受け付けました。内容は実行委員会が確認します。",
    };
  } catch {
    return {
      success: false,
      message: "送信に失敗しました。しばらく経ってから再度お試しください。",
    };
  }
}

export default function ContactPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-[var(--color-text-sub)] mb-6 leading-relaxed">
        アプリの不具合・ご意見・ご質問をお送りください。実行委員会が確認します。
      </p>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">フォームから送信</h2>
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
            <ContactForm action={submitContact} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">当日・緊急のお問い合わせ</h2>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[var(--color-text-main)] mb-1">本部テント（会場内）</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">アプリの不具合・展示内容のご質問は、会場内の本部テントスタッフにお声がけください。</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 border-l-4 border-l-red-400">
              <p className="text-sm font-bold text-red-600 mb-1">緊急時</p>
              <p className="text-sm text-[var(--color-text-sub)] leading-relaxed">体調不良・事故・トラブルの緊急時は、最寄りの教員または本部テントへ直接お声がけください。</p>
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

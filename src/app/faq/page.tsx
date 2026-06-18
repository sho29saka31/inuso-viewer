import type { Metadata } from "next";
import FaqCookieReset from "./FaqCookieReset";

export const metadata: Metadata = { title: "よくある質問" };

export default function FaqPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-xl font-bold">よくある質問</h1>

      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="font-bold text-sm text-[var(--color-text-main)]">Q. アプリを使うのに登録は必要ですか？</p>
          <p className="mt-2 text-sm text-[var(--color-text-sub)]">A. 登録は不要です。初回アクセス時にユーザー種別を選択するだけでご利用いただけます。</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="font-bold text-sm text-[var(--color-text-main)]">Q. プッシュ通知はどうすれば受け取れますか？</p>
          <p className="mt-2 text-sm text-[var(--color-text-sub)]">A. iOSの場合はホーム画面への追加が必要です。Androidはブラウザの通知許可をオンにしてください。</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="font-bold text-sm text-[var(--color-text-main)]">Q. ユーザー種別を変更したいです。</p>
          <p className="mt-2 text-sm text-[var(--color-text-sub)]">A. 生徒・教員は変更できません。保護者・来賓・スキップの方はヘッダーのアカウントアイコンから再選択できます。</p>
        </div>
      </div>

      <FaqCookieReset />
    </div>
  );
}

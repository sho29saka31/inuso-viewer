import type { Metadata } from "next";

export const metadata: Metadata = { title: "利用規約" };

const sections = [
  {
    title: "第1条（適用）",
    body: "本規約は、犬山総合高等学校文化祭実行委員会（以下「当委員会」）が提供するISF文化祭アプリ（以下「本アプリ」）の利用に関して適用されます。",
  },
  {
    title: "第2条（利用目的）",
    body: "本アプリは、犬山総合高等学校文化祭の来場者・生徒・教員向けに、イベント情報・混雑状況・お知らせ等を提供することを目的としています。",
  },
  {
    title: "第3条（禁止事項）",
    body: "利用者は以下の行為を行ってはなりません。\n・本アプリの不正利用\n・第三者への迷惑行為\n・本アプリの改ざんまたはリバースエンジニアリング\n・その他、当委員会が不適切と判断する行為",
  },
  {
    title: "第4条（免責事項）",
    body: "当委員会は、本アプリで提供する情報の正確性・完全性を保証しません。本アプリの利用により生じた損害について、当委員会は一切の責任を負いません。",
  },
  {
    title: "第5条（変更）",
    body: "当委員会は、必要に応じて本規約を変更することができます。変更後の規約は本アプリ上に掲載した時点で効力を生じるものとします。",
  },
];

export default function TermsPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-2">利用規約</h1>
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

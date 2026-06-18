import type { Metadata } from "next";

export const metadata: Metadata = { title: "制作情報" };

export default function AboutPage() {
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">制作情報</h1>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-[var(--color-text-sub)] mb-1">アプリ名</p>
          <p className="font-bold text-sm text-[var(--color-text-main)]">ISF — いぬそう文化祭アプリ</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-[var(--color-text-sub)] mb-1">主催</p>
          <p className="font-bold text-sm text-[var(--color-text-main)]">犬山総合高等学校 文化祭実行委員会</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-[var(--color-text-sub)] mb-1">開催日</p>
          <p className="font-bold text-sm text-[var(--color-text-main)]">2026年9月7日（月）・8日（火）</p>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-[var(--color-text-sub)] mb-2">技術スタック</p>
          <ul className="flex flex-col gap-1">
            {["Next.js 16 (App Router)", "Firebase Firestore", "Tailwind CSS", "Vercel"].map((tech) => (
              <li key={tech} className="text-sm text-[var(--color-text-main)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-[var(--color-text-sub)] mb-1">バージョン</p>
          <p className="text-sm text-[var(--color-text-main)]">1.0.0</p>
        </div>
      </div>
    </div>
  );
}

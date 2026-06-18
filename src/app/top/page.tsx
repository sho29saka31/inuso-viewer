import type { Metadata } from "next";

export const metadata: Metadata = { title: "ホーム" };

export default function TopPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-[var(--color-text-main)]">ISF 文化祭アプリ</h1>
      <p className="mt-2 text-sm text-[var(--color-text-sub)]">犬山総合高等学校 2026年文化祭</p>
    </div>
  );
}

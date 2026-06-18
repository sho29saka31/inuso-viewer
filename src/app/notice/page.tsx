import type { Metadata } from "next";
export const metadata: Metadata = { title: "お知らせ" };
export default function NoticePage() {
  return <div className="px-4 py-6"><h1 className="text-xl font-bold">お知らせ</h1></div>;
}

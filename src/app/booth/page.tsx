import type { Metadata } from "next";
export const metadata: Metadata = { title: "ブース一覧" };
export default function BoothPage() {
  return <div className="px-4 py-6"><h1 className="text-xl font-bold">ブース一覧</h1></div>;
}

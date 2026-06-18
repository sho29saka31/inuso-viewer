import type { Metadata } from "next";
export const metadata: Metadata = { title: "校内マップ" };
export default function MapPage() {
  return <div className="px-4 py-6"><h1 className="text-xl font-bold">校内マップ</h1></div>;
}

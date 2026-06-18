import type { Metadata } from "next";
export const metadata: Metadata = { title: "混雑状況" };
export default function BusyPage() {
  return <div className="px-4 py-6"><h1 className="text-xl font-bold">混雑状況</h1></div>;
}

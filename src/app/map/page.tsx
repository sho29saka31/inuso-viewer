import type { Metadata } from "next";
import Image from "next/image";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "校内マップ" };

async function getMapImageUrl(): Promise<string | null> {
  try {
    const db = getDb();
    const snap = await db.collection("config").doc("map").get();
    if (!snap.exists) return null;
    return (snap.data()?.imageUrl as string) || null;
  } catch {
    return null;
  }
}

export default async function MapPage() {
  const imageUrl = await getMapImageUrl();

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">校内マップ</h1>

      {!imageUrl ? (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm text-[var(--color-text-sub)]">マップは現在準備中です。</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <Image
            src={imageUrl}
            alt="校内マップ"
            width={1200}
            height={900}
            className="w-full h-auto"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}

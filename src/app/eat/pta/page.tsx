import type { Metadata } from "next";
import Image from "next/image";
import { getDb } from "@/lib/firebase-admin";

export const metadata: Metadata = { title: "PTAバザー" };

const STATUS_LABELS = ["停止中", "非常に閑散", "閑散", "通常", "混雑", "非常に混雑"];
const STATUS_COLORS = [
  "bg-gray-200 text-gray-600",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
];

interface EatItem {
  boothId: string;
  shopName: string;
  instagramUrl?: string;
  products?: { name: string; price: number }[];
  imageUrl?: string;
  status: number;
}

async function getPtaItems(): Promise<EatItem[] | null> {
  try {
    const db = getDb();
    const snap = await db.collection("booths")
      .where("category", "==", "eat")
      .where("type", "==", "pta")
      .get();
    return snap.docs.map((d) => d.data() as EatItem);
  } catch {
    return null;
  }
}

export default async function EatPtaPage() {
  const items = await getPtaItems();

  if (items === null) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">PTAバザー</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">PTAバザー</h1>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">現在登録されているPTAバザーはありません。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.boothId} className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              {item.imageUrl && (
                <div className="relative w-full h-40">
                  <Image src={item.imageUrl} alt={item.shopName} fill className="object-cover" />
                </div>
              )}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold text-base text-[var(--color-text-main)]">{item.shopName}</h2>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.instagramUrl && (
                      <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-pink-500">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                      </a>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status] ?? STATUS_COLORS[1]}`}>
                      {STATUS_LABELS[item.status] ?? "不明"}
                    </span>
                  </div>
                </div>
                {item.products && item.products.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {item.products.map((p, i) => (
                      <li key={i} className="flex justify-between text-sm text-[var(--color-text-main)]">
                        <span>{p.name}</span>
                        <span className="font-medium">¥{p.price.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

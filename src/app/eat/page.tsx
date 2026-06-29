import type { Metadata } from "next";
import Image from "next/image";
import { getDb } from "@/lib/firebase-admin";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";

export const revalidate = 300;
export const metadata: Metadata = { title: "飲食エリア" };

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
  type: string;
  instagramUrl?: string;
  products?: { name: string; price: number; isSoldOut?: boolean }[];
  imageUrl?: string;
  status: number;
}

async function getEatItems(): Promise<{ items: EatItem[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db.collection("booths").where("category", "==", "eat").get();
    return { items: snap.docs.map((d) => { const data = d.data() as EatItem; if (!data.boothId) data.boothId = d.id; return data; }) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

function EatCard({ item }: { item: EatItem }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {item.imageUrl && (
        <div className="relative w-full aspect-[4/3]">
          <Image src={item.imageUrl} alt={item.shopName} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-base text-[var(--color-text-main)]">{item.shopName}</h2>
          <div className="flex items-center gap-2 shrink-0">
            {item.instagramUrl && (
              <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center h-11 w-11 -my-1">
                <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="24" height="24" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
                  <rect x="6.5" y="6.5" width="11" height="11" rx="3" ry="3" fill="none" stroke="white" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1.6" />
                  <circle cx="17" cy="7" r="1" fill="white" />
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
              <li key={i} className={`flex justify-between text-sm ${p.isSoldOut ? "opacity-40 line-through" : "text-[var(--color-text-main)]"}`}>
                <span className="flex items-center gap-1.5">
                  {p.name}
                  {p.isSoldOut && (
                    <span className="no-underline not-italic text-xs px-1 py-0.5 rounded bg-red-100 text-red-600 font-medium" style={{ textDecoration: "none" }}>
                      売り切れ
                    </span>
                  )}
                </span>
                <span className="font-medium">¥{p.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default async function EatPage() {
  if (!(await getViewerFeatures()).eat) return <FeatureDisabled />;
  const result = await getEatItems();

  if ("error" in result) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">飲食エリア</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。時間をおいて再度お試しください。</p>
      </div>
    );
  }

  const { items } = result;
  const carItems = items.filter((i) => i.type === "car");
  const ptaItems = items.filter((i) => i.type === "pta");

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-6">飲食エリア</h1>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--color-text-main)]">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <h2 className="text-base font-bold text-[var(--color-text-main)]">キッチンカー</h2>
        </div>
        {carItems.length === 0 ? (
          <p className="text-sm text-[var(--color-text-sub)]">現在登録されているキッチンカーはありません。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {carItems.map((item) => <EatCard key={item.boothId} item={item} />)}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--color-text-main)]">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <h2 className="text-base font-bold text-[var(--color-text-main)]">PTAバザー</h2>
        </div>
        {ptaItems.length === 0 ? (
          <p className="text-sm text-[var(--color-text-sub)]">現在登録されているPTAバザーはありません。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ptaItems.map((item) => <EatCard key={item.boothId} item={item} />)}
          </div>
        )}
      </section>
    </div>
  );
}

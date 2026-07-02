import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

// 同時アクセス数に比例してFirestore読み取りが増えるのを防ぐため、
// Vercelの共有(CDN)キャッシュを効かせる。キャッシュ窓の間は何人が
// 同時にポーリングしてもFirestoreへは1回しかアクセスしない。
// クライアント側のポーリング間隔(useHeatData.ts POLL_MS)と揃えること。
export const revalidate = 60;

// /busy の流動的ヒートマップがクライアントから定期ポーリングする読み取り専用エンドポイント。
// booths自体が既にpage.tsxでSSR公開されている非機密データのため認証は不要。
export async function GET() {
  try {
    const db = getDb();
    const snap = await db.collection("booths").get();
    const data = snap.docs.map((d) => {
      const b = d.data();
      const boothId = typeof b.boothId === "string" ? b.boothId : d.id;
      const status = typeof b.status === "number" ? b.status : 0;
      // heatScore未設定のブース(旧データ・手動運用など)はstatusから概算する
      const heatScore = typeof b.heatScore === "number" ? b.heatScore : status * 20;
      return { boothId, heatScore };
    });
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  } catch {
    return NextResponse.json({ error: "failed to fetch" }, { status: 503 });
  }
}

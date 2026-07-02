import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

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
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "failed to fetch" }, { status: 503 });
  }
}

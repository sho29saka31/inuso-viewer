import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";
import BoothList from "./BoothList";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";
import type { Booth } from "./BoothList";
import * as Sentry from "@sentry/nextjs";

export const revalidate = 300;
export const metadata: Metadata = { title: "ブース一覧" };

async function getBooths(): Promise<{ booths: Booth[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db
      .collection("booths")
      .where("category", "!=", "eat")
      .orderBy("category")
      .get();
    return { booths: snap.docs.map((d) => d.data() as Booth) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function BoothPage() {
  if (!(await getViewerFeatures()).booth) return <FeatureDisabled />;
  const result = await getBooths();
  if ("error" in result) {
    Sentry.captureException(new Error(result.error));
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">ブース一覧</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。時間をおいて再度お試しください。</p>
      </div>
    );
  }
  const { booths } = result;
  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">ブース一覧</h1>
      {booths.length === 0 ? (
        <p className="text-sm text-[var(--color-text-sub)]">現在登録されているブースはありません。</p>
      ) : (
        <BoothList booths={booths} />
      )}
    </div>
  );
}

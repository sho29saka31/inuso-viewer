import type { Metadata } from "next";
import NotificationBanner from "./NotificationBanner";
import PwaInstallBanner from "./PwaInstallBanner";
import NoticeList from "./NoticeList";
import { getViewerFeatures } from "@/lib/feature-flags";
import FeatureDisabled from "@/components/FeatureDisabled";
import { getDb } from "@/lib/firebase-admin";
import * as Sentry from "@sentry/nextjs";

export const revalidate = 30;
export const metadata: Metadata = { title: "お知らせ" };

interface Notice {
  noticeId: string;
  title: string;
  authorId: string;
  target?: string;
  type?: string;
  isUrgent?: boolean;
  createdAt: { seconds?: number; _seconds?: number } | null;
}

async function getNotices(): Promise<{ notices: Notice[] } | { error: string }> {
  try {
    const db = getDb();
    const snap = await db.collection("notices").orderBy("createdAt", "desc").get();
    return { notices: snap.docs.map((d) => d.data() as Notice) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function NoticePage() {
  if (!(await getViewerFeatures()).notice) return <FeatureDisabled />;
  const result = await getNotices();

  if ("error" in result) {
    Sentry.captureException(new Error(result.error));
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">お知らせ</h1>
        <p className="text-sm text-[var(--color-text-sub)]">データを取得できませんでした。時間をおいて再度お試しください。</p>
      </div>
    );
  }

  const { notices } = result;

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">お知らせ</h1>
      <NotificationBanner />
      <PwaInstallBanner />
      <NoticeList notices={notices} />
    </div>
  );
}

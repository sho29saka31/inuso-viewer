import type { Metadata } from "next";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "デジタルパンフレット" };

async function getPdfUrl(): Promise<string | null> {
  try {
    const db = getDb();
    const snap = await db.collection("config").doc("digital").get();
    if (!snap.exists) return null;
    return (snap.data()?.pdfUrl as string) || null;
  } catch {
    return null;
  }
}

export default async function DigitalPage() {
  const pdfUrl = await getPdfUrl();

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-xl font-bold mb-4">デジタルパンフレット</h1>

      {!pdfUrl ? (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm text-[var(--color-text-sub)]">現在パンフレットは公開されていません。</p>
        </div>
      ) : (
        <>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 w-full rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold text-center py-3"
          >
            PDFを別タブで開く
          </a>
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: "75vh" }}>
            <iframe src={pdfUrl} className="w-full h-full" title="デジタルパンフレット" />
          </div>
        </>
      )}
    </div>
  );
}

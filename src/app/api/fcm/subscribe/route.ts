import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TOPICS = new Set(["all", "edu", "guest", "1nen", "2nen", "3nen"]);

export async function POST(req: NextRequest) {
  const { token, topics } = await req.json();
  if (!token || !Array.isArray(topics)) {
    return NextResponse.json({ error: "token and topics required" }, { status: 400 });
  }
  const safeTopics = (topics as string[]).filter((t) => ALLOWED_TOPICS.has(t));

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ ok: true, skipped: "no service account" });
  }

  try {
    const { getMessaging } = await import("firebase-admin/messaging");
    const { getDb } = await import("@/lib/firebase-admin");

    const messaging = getMessaging();
    await Promise.all(
      safeTopics.map((topic) => messaging.subscribeToTopic(token, topic))
    );

    const db = getDb();
    const docId = token.slice(-20) + "-" + Date.now();
    await db.collection("fcmTokens").doc(docId).set({
      token,
      topics: safeTopics,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("FCM subscribe error:", err);
    return NextResponse.json({ error: "subscribe failed" }, { status: 500 });
  }
}

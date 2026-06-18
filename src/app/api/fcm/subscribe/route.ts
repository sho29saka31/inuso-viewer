import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, topics } = await req.json();
  if (!token || !Array.isArray(topics)) {
    return NextResponse.json({ error: "token and topics required" }, { status: 400 });
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ ok: true, skipped: "no service account" });
  }

  try {
    const { getMessaging } = await import("firebase-admin/messaging");
    const { getDb } = await import("@/lib/firebase-admin");

    const messaging = getMessaging();
    await Promise.all(
      topics.map((topic: string) => messaging.subscribeToTopic(token, topic))
    );

    const db = getDb();
    await db.collection("fcmTokens").doc(token.slice(-20)).set({
      token,
      topics,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("FCM subscribe error:", err);
    return NextResponse.json({ error: "subscribe failed" }, { status: 500 });
  }
}

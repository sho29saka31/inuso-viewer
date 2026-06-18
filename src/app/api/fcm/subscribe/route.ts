import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { getDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { token, topics } = await req.json();
  if (!token || !Array.isArray(topics)) {
    return NextResponse.json({ error: "token and topics required" }, { status: 400 });
  }

  try {
    const messaging = getMessaging();
    await Promise.all(
      topics.map((topic: string) =>
        messaging.subscribeToTopic(token, topic)
      )
    );

    // Store token in Firestore for future reference
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

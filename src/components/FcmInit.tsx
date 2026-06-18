"use client";

import { useEffect } from "react";
import { getCookie } from "@/lib/cookies";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

function getTopicsForRole(raw: string): string[] {
  try {
    const data = JSON.parse(raw);
    const { role, grade, class: cls } = data;
    if (role === "guest") return ["all", "guest"];
    if (role === "teacher") {
      const topics = ["all", "prof"];
      if (grade && grade !== "none") topics.push(`${grade}nen`);
      return topics;
    }
    if (role === "student") {
      const topics = ["all", "edu"];
      if (grade && grade !== "none") {
        topics.push(`${grade}nen`);
        if (cls) topics.push(`class${grade}${cls}`);
      }
      return topics;
    }
    return ["all"];
  } catch {
    return ["all"];
  }
}

export default function FcmInit() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return;
    if (!VAPID_KEY || !FIREBASE_CONFIG.apiKey) return;

    async function init() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        await navigator.serviceWorker.ready;

        // Send config to SW
        if (registration.active) {
          registration.active.postMessage({ type: "FIREBASE_CONFIG", config: FIREBASE_CONFIG });
        }

        // Import firebase client SDK dynamically
        const { initializeApp, getApps } = await import("firebase/app");
        const { getMessaging, getToken, onMessage } = await import("firebase/messaging");

        if (!getApps().length) {
          initializeApp(FIREBASE_CONFIG);
        }

        const messaging = getMessaging();

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) return;

        // Subscribe to topics via API
        const userRoleRaw = getCookie("user_role");
        const topics = userRoleRaw ? getTopicsForRole(userRoleRaw) : ["all", "guest"];

        await fetch("/api/fcm/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, topics }),
        }).catch(() => {});

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          const title = payload.notification?.title ?? "ISF通知";
          const body = payload.notification?.body ?? "";
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body, icon: "/icon-192.png" });
          }
        });
      } catch (err) {
        console.warn("FCM init error:", err);
      }
    }

    init();
  }, []);

  return null;
}

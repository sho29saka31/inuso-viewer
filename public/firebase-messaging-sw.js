importScripts("/api/firebase-sw-config");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp(self.__FIREBASE_CONFIG__);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title ?? payload.notification?.title ?? "ISF通知";
  const body = payload.data?.body ?? payload.notification?.body ?? "";
  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data,
  });
});

// PWA インストール要件（fetch ハンドラを持つ Service Worker）を満たすための
// パススルー fetch ハンドラ。レスポンスには介入せずネットワークに委ねる。
self.addEventListener("fetch", () => {});

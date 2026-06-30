/** 端末・表示モード判定ヘルパー（クライアント専用） */

/** iOS（iPhone / iPad / iPod）か */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Android か */
export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

/** モバイル端末（iOS または Android）か */
export function isMobileOS(): boolean {
  return isIOS() || isAndroid();
}

/** ホーム画面に追加された PWA（standalone 表示）として起動しているか */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mql || iosStandalone;
}

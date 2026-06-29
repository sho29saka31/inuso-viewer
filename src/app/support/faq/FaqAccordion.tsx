"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteCookie } from "@/lib/cookies";
import FaqCookieReset from "./FaqCookieReset";
import { ConfirmDialog, AlertDialog } from "@/components/ui/Dialog";
import { useDialog } from "@/hooks/useDialog";

export interface FaqItem {
  q: string;
  a: string;
  resetButton?: boolean;
  notifyButton?: boolean;
  unsubscribeButton?: boolean;
  readResetButton?: boolean;
  mapLinkButton?: boolean;
  reloadButton?: boolean;
  allCookieButton?: boolean;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

function NotifyButton() {
  const [perm, setPerm] = useState<NotificationPermission>("default");
  const { alert, alertState, handleAlertClose } = useDialog();

  useEffect(() => {
    if ("Notification" in window) setPerm(Notification.permission);
  }, []);

  if (perm === "granted") return null;

  async function handleClick() {
    if (!("Notification" in window)) {
      await alert("このブラウザはプッシュ通知に対応していません。");
      return;
    }
    const result = await Notification.requestPermission();
    setPerm(result);
    if (result === "granted") {
      await alert("通知が許可されました。ページを再読み込みして設定を完了します。");
      window.location.reload();
    } else {
      await alert("通知が拒否されました。端末の設定から許可してください。");
    }
  }

  return (
    <>
      {alertState && <AlertDialog message={alertState.message} onClose={handleAlertClose} />}
      <button onClick={handleClick} className="mt-3 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white active:opacity-80">
        通知を許可する
      </button>
    </>
  );
}

function UnsubscribeButton() {
  const [perm, setPerm] = useState<NotificationPermission>("default");
  const { confirm, alert, confirmState, alertState, handleConfirm, handleAlertClose } = useDialog();

  useEffect(() => {
    if ("Notification" in window) setPerm(Notification.permission);
  }, []);

  if (perm !== "granted") return null;

  async function handleClick() {
    const ok = await confirm("プッシュ通知の購読を解除しますか？");
    if (!ok) return;
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
    } catch {}
    deleteCookie("fcm_token");
    await alert("通知購読を解除しました。ページを再読み込みします。");
    window.location.reload();
  }

  return (
    <>
      {confirmState && <ConfirmDialog message={confirmState.message} onConfirm={() => handleConfirm(true)} onCancel={() => handleConfirm(false)} />}
      {alertState && <AlertDialog message={alertState.message} onClose={handleAlertClose} />}
      <button onClick={handleClick} className="mt-3 w-full rounded-xl border border-[var(--color-danger)] py-3.5 text-sm font-bold text-[var(--color-danger)] active:bg-red-50">
        通知の購読を解除する
      </button>
    </>
  );
}

function ReadResetButton() {
  const { confirm, alert, confirmState, alertState, handleConfirm, handleAlertClose } = useDialog();

  async function handleClick() {
    const ok = await confirm("お知らせの既読状態をリセットしますか？");
    if (!ok) return;
    deleteCookie("notice_read_at");
    await alert("既読状態をリセットしました。");
  }

  return (
    <>
      {confirmState && <ConfirmDialog message={confirmState.message} onConfirm={() => handleConfirm(true)} onCancel={() => handleConfirm(false)} />}
      {alertState && <AlertDialog message={alertState.message} onClose={handleAlertClose} />}
      <button onClick={handleClick} className="mt-3 w-full rounded-xl border border-gray-300 py-3.5 text-sm font-bold text-[var(--color-text-main)] active:bg-gray-50">
        既読状態をリセットする
      </button>
    </>
  );
}

function ReloadButton() {
  return (
    <button onClick={() => window.location.reload()} className="mt-3 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white active:opacity-80">
      ページを強制リロードする
    </button>
  );
}

export function AllCookieDeleteButton({ compact }: { compact?: boolean }) {
  const { confirm, alert, confirmState, alertState, handleConfirm, handleAlertClose } = useDialog();

  async function handleClick() {
    const ok = await confirm("すべてのCookie・設定情報を削除しますか？\n同意バナー・ユーザー設定・既読状態がすべてリセットされます。");
    if (!ok) return;
    const ALL_COOKIES = ["cookie_consent", "user_role", "user_grade", "notice_read_at", "fcm_token", "pwa_guided", "consent"];
    ALL_COOKIES.forEach((c) => deleteCookie(c));
    await alert("すべてのCookieを削除しました。ページを再読み込みします。");
    window.location.reload();
  }

  return (
    <>
      {confirmState && <ConfirmDialog message={confirmState.message} onConfirm={() => handleConfirm(true)} onCancel={() => handleConfirm(false)} />}
      {alertState && <AlertDialog message={alertState.message} onClose={handleAlertClose} />}
      <button
        onClick={handleClick}
        className={`w-full rounded-xl border border-[var(--color-danger)] py-3 text-sm font-bold text-[var(--color-danger)] active:bg-red-50 ${compact ? "" : "mt-2"}`}
      >
        すべてのCookieを削除する
      </button>
    </>
  );
}

export default function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {faqs.map(({ category, items }) => (
        <section key={category}>
          <h2 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">{category}</h2>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const { q, a, resetButton, notifyButton, unsubscribeButton, readResetButton, mapLinkButton, reloadButton, allCookieButton } = item;
              const key = `${category}-${i}`;
              const open = openKey === key;
              return (
                <div key={key} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-4 flex items-center justify-between gap-2"
                    onClick={() => setOpenKey(open ? null : key)}
                    aria-expanded={open}
                  >
                    <span className="text-sm font-bold text-[var(--color-text-main)]">Q. {q}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className={`shrink-0 text-[var(--color-text-sub)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-sm text-[var(--color-text-sub)] leading-relaxed mt-3 whitespace-pre-line">A. {a}</p>
                      {notifyButton && <NotifyButton />}
                      {unsubscribeButton && <UnsubscribeButton />}
                      {readResetButton && <ReadResetButton />}
                      {reloadButton && <ReloadButton />}
                      {mapLinkButton && (
                        <Link href="/map" className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white active:opacity-80">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                          </svg>
                          校内マップを開く
                        </Link>
                      )}
                      {allCookieButton && <AllCookieDeleteButton compact />}
                      {resetButton && (
                        <div className="mt-4">
                          <FaqCookieReset />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

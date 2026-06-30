"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { getCookie } from "@/lib/cookies";
import { isMobileOS, isStandalone } from "@/lib/device";
import ConsentOverlay from "./ConsentOverlay";
import PwaGuide from "./PwaGuide";
import UserRoleOverlay from "./UserRoleOverlay";

const LEGAL_PATHS = ["/legal/terms", "/legal/privacy", "/legal/cookie-policy"];

type Step = "consent" | "pwa" | "user_role" | "done";

/** PWA追加案内を初回表示する対象か（モバイル端末かつ未インストール） */
function shouldGuidePwa(): boolean {
  return isMobileOS() && !isStandalone();
}

export default function InitFlow() {
  const [step, setStep] = useState<Step | null>(null);
  const { showUserRoleOverlay, closeUserRoleOverlay, showPwaGuide, closePwaGuide } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (LEGAL_PATHS.includes(pathname)) return;

    const hasConsent = !!getCookie("consent");
    const hasPwaGuided = !!getCookie("pwa_guided");
    const hasUserRole = !!getCookie("user_role");

    if (!hasConsent) {
      setStep("consent");
    } else if (!hasPwaGuided && shouldGuidePwa()) {
      setStep("pwa");
    } else if (!hasUserRole) {
      setStep("user_role");
    } else {
      setStep("done");
    }
  }, [pathname]);

  function afterConsent() {
    if (!getCookie("pwa_guided") && shouldGuidePwa()) {
      setStep("pwa");
    } else if (!getCookie("user_role")) {
      setStep("user_role");
    } else {
      setStep("done");
    }
  }

  function afterPwa() {
    if (!getCookie("user_role")) {
      setStep("user_role");
    } else {
      setStep("done");
    }
  }

  function afterUserRole() {
    setStep("done");
  }

  if (LEGAL_PATHS.includes(pathname)) return null;

  // ヘッダー案内バー等から手動で開かれた PWA 追加案内
  if (showPwaGuide) {
    return <PwaGuide onComplete={closePwaGuide} />;
  }

  if (showUserRoleOverlay) {
    return <UserRoleOverlay onComplete={closeUserRoleOverlay} />;
  }

  if (step === null || step === "done") return null;

  if (step === "consent") return <ConsentOverlay onComplete={afterConsent} />;
  if (step === "pwa") return <PwaGuide onComplete={afterPwa} />;
  if (step === "user_role") return <UserRoleOverlay onComplete={afterUserRole} />;

  return null;
}

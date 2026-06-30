"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { ViewerFeatures } from "@/lib/feature-flags";

// Chrome 等が発火する beforeinstallprompt イベント（型は lib.dom 未定義のため自前定義）
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DEFAULT_FEATURES: ViewerFeatures = {
  service: true,
  event: true, booth: true, busy: true, eat: true,
  notice: true, digital: true, map: true,
};

type AppContextType = {
  isHamburgerOpen: boolean;
  openHamburger: () => void;
  closeHamburger: () => void;
  showUserRoleOverlay: boolean;
  openUserRoleOverlay: () => void;
  closeUserRoleOverlay: () => void;
  showPwaGuide: boolean;
  openPwaGuide: () => void;
  closePwaGuide: () => void;
  installPrompt: BeforeInstallPromptEvent | null;
  clearInstallPrompt: () => void;
  features: ViewerFeatures;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children, features }: { children: ReactNode; features?: ViewerFeatures }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [showUserRoleOverlay, setShowUserRoleOverlay] = useState(false);
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // ブラウザのインストール可能イベントを早期に捕捉して保持する
  // （案内モーダルを開いたタイミングより前に発火するため、グローバルで捕まえる）
  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstallPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isHamburgerOpen,
        openHamburger: () => setIsHamburgerOpen(true),
        closeHamburger: () => setIsHamburgerOpen(false),
        showUserRoleOverlay,
        openUserRoleOverlay: () => setShowUserRoleOverlay(true),
        closeUserRoleOverlay: () => setShowUserRoleOverlay(false),
        showPwaGuide,
        openPwaGuide: () => setShowPwaGuide(true),
        closePwaGuide: () => setShowPwaGuide(false),
        installPrompt,
        clearInstallPrompt: () => setInstallPrompt(null),
        features: features ?? DEFAULT_FEATURES,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

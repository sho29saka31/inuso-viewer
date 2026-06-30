"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { ViewerFeatures } from "@/lib/feature-flags";

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
  features: ViewerFeatures;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children, features }: { children: ReactNode; features?: ViewerFeatures }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [showUserRoleOverlay, setShowUserRoleOverlay] = useState(false);
  const [showPwaGuide, setShowPwaGuide] = useState(false);

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

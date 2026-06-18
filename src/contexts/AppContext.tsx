"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AppContextType = {
  isHamburgerOpen: boolean;
  openHamburger: () => void;
  closeHamburger: () => void;
  showUserRoleOverlay: boolean;
  openUserRoleOverlay: () => void;
  closeUserRoleOverlay: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [showUserRoleOverlay, setShowUserRoleOverlay] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isHamburgerOpen,
        openHamburger: () => setIsHamburgerOpen(true),
        closeHamburger: () => setIsHamburgerOpen(false),
        showUserRoleOverlay,
        openUserRoleOverlay: () => setShowUserRoleOverlay(true),
        closeUserRoleOverlay: () => setShowUserRoleOverlay(false),
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

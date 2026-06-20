"use client";

import { useState, useCallback } from "react";

type ConfirmState = { message: string; resolve: (v: boolean) => void } | null;
type AlertState = { message: string; resolve: () => void } | null;

export function useDialog() {
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [alertState, setAlertState] = useState<AlertState>(null);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => setConfirmState({ message, resolve }));
  }, []);

  const alert = useCallback((message: string): Promise<void> => {
    return new Promise<void>((resolve) => setAlertState({ message, resolve }));
  }, []);

  const handleConfirm = useCallback((result: boolean) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  }, [confirmState]);

  const handleAlertClose = useCallback(() => {
    alertState?.resolve();
    setAlertState(null);
  }, [alertState]);

  return { confirm, alert, confirmState, alertState, handleConfirm, handleAlertClose };
}

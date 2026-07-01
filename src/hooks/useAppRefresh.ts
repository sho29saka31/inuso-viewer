"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { revalidateAll } from "@/app/actions";

export function useAppRefresh() {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  const refresh = useCallback(() => {
    startRefresh(async () => {
      try { await revalidateAll(); } catch {}
      router.refresh();
    });
  }, [router]);

  return { refresh, isRefreshing };
}

"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RouteRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    router.refresh();
  }, [pathname, router]);

  return null;
}

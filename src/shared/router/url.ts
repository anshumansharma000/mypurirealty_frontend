"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlSearchUpdater() {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  function setMany(next: Record<string, string | number | undefined | null>) {
    const q = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "" || v === 0) q.delete(k);
      else q.set(k, String(v));
    });
    router.replace(`${pathname}?${q.toString()}`);
  }

  return { setMany };
}

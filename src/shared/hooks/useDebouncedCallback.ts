"use client";

import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 1000,
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cb = useMemo(
    () => {
      const handler = (...args: Parameters<T>) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => fnRef.current(...args), delay);
      };
      return handler;
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  return cb;
}

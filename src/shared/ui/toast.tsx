"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";

export type ShowToastOptions = {
  message: string;
  type?: ToastKind;
  durationMs?: number;
};

type ToastRecord = {
  id: string;
  message: string;
  type: ToastKind;
};

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const defaultDurations: Record<ToastKind, number> = {
  success: 3200,
  info: 4000,
  error: 4800,
};

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "info", durationMs }: ShowToastOptions) => {
      if (!message) return "";
      const id = createId();
      setToasts((prev) => [...prev, { id, message, type }]);
      const timeoutMs = durationMs ?? defaultDurations[type] ?? 4000;
      const timer = window.setTimeout(() => dismissToast(id), timeoutMs);
      timers.current.set(id, timer);
      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((timer) => window.clearTimeout(timer));
      timersMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 px-2 sm:px-0">
        {toasts.map((toast) => {
          const bgClass =
            toast.type === "success"
              ? "bg-emerald-600"
              : toast.type === "error"
                ? "bg-red-600"
                : "bg-neutral-900";
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto overflow-hidden rounded-lg px-4 py-3 text-sm text-white shadow-lg shadow-black/20 ${bgClass}`}
              role="status"
              aria-live="polite"
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

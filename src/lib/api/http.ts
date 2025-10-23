import { env } from "@/config/env";

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(status: number, body?: unknown) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  if (!env.apiBase) {
    throw new Error("Missing API base URL. Configure it in src/config/env.ts or via env vars.");
  }

  const res = await fetch(`${env.apiBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
    cache: "no-store", // React Query handles caching
  });

  // handle empty bodies cleanly
  const text = await res.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

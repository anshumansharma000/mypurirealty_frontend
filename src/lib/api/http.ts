const BASE = process.env.NEXT_PUBLIC_API_BASE!; // e.g. https://api.mpr.local

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
  const res = await fetch(`${BASE}${path}`, {
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

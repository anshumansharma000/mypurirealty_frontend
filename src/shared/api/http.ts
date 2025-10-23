import { env } from "@/config/env";
import { getAccessToken } from "@/shared/auth/token";

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
  const isMultipart = init?.body instanceof FormData;
  const headers = new Headers(init?.headers ?? undefined);

  if (!isMultipart && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!env.apiBase) {
    throw new Error("Missing API base URL. Check src/config/env.ts or environment variables.");
  }

  const res = await fetch(`${env.apiBase}${path}`, {
    ...init,
    headers,
    // credentials: "include",
    cache: "no-store",
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

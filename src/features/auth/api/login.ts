import { LoginResponseDTO } from "@/features/auth/validation/auth.dto";
import { api, ApiError } from "@/shared/api/http";
import type { AuthTokens } from "@/shared/auth/token";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  tokens: AuthTokens;
  message?: string;
};

const LOGIN_PATH = "/auth/login";

export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    const raw = await api<unknown>(LOGIN_PATH, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const parsed = LoginResponseDTO.safeParse(raw);
    if (!parsed.success) {
      console.error("[login] Invalid response", {
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
        sample: raw,
      });
      throw new Error("Invalid login response");
    }

    const { success, message, data } = parsed.data;
    if (!success || !data) {
      throw new Error(message || "Login failed");
    }

    return {
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? undefined,
      },
      message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const msg =
        typeof error.body === "object" && error.body && "message" in error.body
          ? String((error.body as { message?: unknown }).message ?? "Login failed")
          : error.body && typeof error.body === "string"
            ? error.body
            : "Login failed";
      throw new Error(msg);
    }
    throw error;
  }
}

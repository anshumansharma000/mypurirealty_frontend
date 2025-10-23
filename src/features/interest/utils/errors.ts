import { ApiError } from "@/shared/api/http";

export function resolveInterestSubmitError(error: unknown): string {
  if (error instanceof ApiError) {
    const specific = extractInterestErrorMessage(error.body);
    if (specific) return specific;

    if (error.status >= 500) {
      return "We ran into a server issue while submitting your interest. Please try again shortly.";
    }

    if (error.status === 400 || error.status === 422) {
      return "Please double-check the details and try again.";
    }
  }

  if (error instanceof Error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "We couldn't submit your interest right now. Please retry in a bit.";
}

export function resolveInterestFetchError(error: unknown): string {
  if (error instanceof ApiError) {
    const specific = extractInterestErrorMessage(error.body);
    if (specific) return specific;

    if (error.status >= 500) {
      return "The server is temporarily unavailable. Please refresh in a moment.";
    }
  }

  if (error instanceof Error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return "Failed to load inquiries. Please try again.";
}

export function extractInterestErrorMessage(value: unknown, depth = 0): string | null {
  if (!value || depth > 4) return null;

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const part of value) {
      const found = extractInterestErrorMessage(part, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    const directKeys = ["message", "detail", "error", "title"];
    for (const key of directKeys) {
      const candidate = obj[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }

    if ("errors" in obj) {
      const nested = extractInterestErrorMessage(obj.errors, depth + 1);
      if (nested) return nested;
    }

    if ("data" in obj) {
      const nested = extractInterestErrorMessage(obj.data, depth + 1);
      if (nested) return nested;
    }

    if ("details" in obj) {
      const nested = extractInterestErrorMessage(obj.details, depth + 1);
      if (nested) return nested;
    }

    for (const val of Object.values(obj)) {
      const nested = extractInterestErrorMessage(val, depth + 1);
      if (nested) return nested;
    }
  }

  return null;
}

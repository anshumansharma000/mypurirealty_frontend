// src/features/listings/api/getListings.ts
import { mapListingDTO } from "@/features/listings/mappers/dtoToListing";
import {
  // If you want to validate a single item during debugging:
  // ListingDTO,
  ListingsListEnvelopeDTO,
  ListingsListResponseDTO,
} from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { z } from "zod";

// ---------- Public query type ----------
export type ListingsQuery = {
  city?: string;
  q?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bhk?: number;
  furnishing?: string;
  constructionStatus?: string;
  category?: string;
  status?: string;
};

// ---------- Helpers (DTO -> Domain) ----------
// ---------- API ----------
export async function getListings(params: ListingsQuery) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
  ).toString();

  const json = await api(`/listings?${qs}`);

  const parsed = parseListingsPayload(json);

  return {
    items: parsed.items.map(mapListingDTO),
    total: Number(parsed.total),
  };
}

function parseListingsPayload(json: unknown) {
  const envelopeAttempt = ListingsListEnvelopeDTO.safeParse(json);
  if (envelopeAttempt.success) {
    return envelopeAttempt.data.data;
  }

  const maybeData =
    typeof json === "object" && json !== null && "data" in json
      ? (json as { data?: unknown }).data
      : undefined;

  const dataAttempt =
    maybeData !== undefined ? ListingsListResponseDTO.safeParse(maybeData) : null;
  if (dataAttempt && dataAttempt.success) {
    return dataAttempt.data;
  }

  const directAttempt = ListingsListResponseDTO.safeParse(json);
  if (directAttempt.success) {
    return directAttempt.data;
  }

  const error =
    (dataAttempt && !dataAttempt.success ? dataAttempt.error : undefined) ??
    envelopeAttempt.error ??
    directAttempt.error;

  if (error) {
    console.error("[getListings] ZodError", {
      message: error.message,
      issues: error.issues.slice(0, 8).map((issue) => ({
        path: issue.path.join("."),
        code: issue.code,
        message: issue.message,
      })),
    });
  }

  const payloadForItems =
    typeof maybeData === "object" && maybeData !== null ? maybeData : json;
  const payload = payloadForItems as { items?: unknown[] };
  const items = Array.isArray(payload?.items) ? payload.items ?? [] : [];
  const listSchema = ListingsListResponseDTO.shape.items as z.ZodArray<z.ZodTypeAny>;
  const element = listSchema.element as z.ZodTypeAny;

  for (let i = 0; i < items.length; i++) {
    const check = element.safeParse(items[i]);
    if (!check.success) {
      console.error("[getListings] Bad item index", i, {
        issues: check.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
        sample: items[i],
      });
      break;
    }
  }

  throw new Error("Invalid /listings response (see console for ZodError)");
}

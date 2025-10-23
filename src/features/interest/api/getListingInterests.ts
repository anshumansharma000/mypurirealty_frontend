import { api } from "@/shared/api/http";

export type ListingInterest = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  createdAt?: string | null;
};

export type ListingInterestPagination = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

export type ListingInterestsResult = {
  items: ListingInterest[];
  pagination: ListingInterestPagination;
};

type ListingInterestsParams = {
  page?: number;
  pageSize?: number;
};

export async function getListingInterests(
  listingId: string,
  params: ListingInterestsParams = {},
): Promise<ListingInterestsResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const qs = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const raw = await api(`/listings/${encodeURIComponent(listingId)}/interests?${qs.toString()}`);

  return normalizeListingInterests(raw, page, pageSize);
}

function normalizeListingInterests(
  payload: unknown,
  fallbackPage: number,
  fallbackPageSize: number,
): ListingInterestsResult {
  const { items: rawItems, pagination: rawPagination } = unwrapInterestsPayload(payload);

  const items = (Array.isArray(rawItems) ? rawItems : []).map((item, index) =>
    mapInterest(item, index),
  );

  const pagination = normalizePagination(
    rawPagination,
    fallbackPage,
    fallbackPageSize,
    items.length,
  );

  return { items, pagination };
}

function unwrapInterestsPayload(payload: unknown): { items: unknown; pagination: unknown } {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: undefined };
  }

  const obj = payload as Record<string, unknown>;

  if (Array.isArray(obj.data)) {
    return { items: obj.data, pagination: obj.pagination ?? obj.meta };
  }

  const nestedData =
    (obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : null) ??
    (obj.result && typeof obj.result === "object" ? (obj.result as Record<string, unknown>) : null);

  if (nestedData) {
    const nestedItems =
      nestedData.items ??
      nestedData.data ??
      nestedData.results ??
      nestedData.interests ??
      nestedData.records ??
      nestedData.list ??
      [];

    if (Array.isArray(nestedItems)) {
      return { items: nestedItems, pagination: nestedData.pagination ?? nestedData.meta };
    }
  }

  const directItems =
    obj.items ?? obj.results ?? obj.interests ?? obj.records ?? obj.list ?? obj.entries;

  return { items: directItems ?? [], pagination: obj.pagination ?? obj.meta };
}

function mapInterest(raw: unknown, index: number): ListingInterest {
  const item = (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}) ?? {};

  const id =
    readString(item, ["id", "_id", "interestId", "interest_id", "uuid"]) ??
    buildFallbackId(item, index);
  const name = readString(item, ["name", "fullName", "full_name", "contact_name"]) ?? "Unknown";
  const phone =
    readString(item, ["phone", "phoneNumber", "phone_number", "mobile", "mobileNumber"]) ?? "";
  const email =
    readString(item, ["email", "emailAddress", "email_address", "contact_email"]) ?? null;
  const message =
    readString(item, ["message", "notes", "note", "content", "body", "comment"]) ?? null;
  const createdAt =
    readString(item, [
      "createdAt",
      "created_at",
      "created",
      "submittedAt",
      "submitted_at",
      "timestamp",
    ]) ?? null;

  return { id, name, phone, email, message, createdAt };
}

function readString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    if (!(key in source)) continue;
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function buildFallbackId(source: Record<string, unknown>, index: number) {
  const fallback =
    readString(source, ["phone"]) ??
    readString(source, ["email"]) ??
    readString(source, ["name"]) ??
    `${index}`;
  return `interest-${fallback}-${index}`;
}

function normalizePagination(
  value: unknown,
  fallbackPage: number,
  fallbackPageSize: number,
  itemCount: number,
): ListingInterestPagination {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const page =
      readNumber(obj, ["page", "currentPage", "current_page", "pageNumber"]) ?? fallbackPage;
    const pageSize =
      readNumber(obj, ["pageSize", "page_size", "perPage", "per_page", "limit"]) ??
      fallbackPageSize;
    const totalItems =
      readNumber(obj, ["totalItems", "total_items", "count", "total"]) ?? itemCount;
    const totalPages =
      readNumber(obj, ["totalPages", "total_pages"]) ??
      (pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1);

    return {
      page,
      pageSize,
      totalItems,
      totalPages,
    };
  }

  const totalPages =
    fallbackPageSize > 0 ? Math.max(1, Math.ceil(itemCount / fallbackPageSize)) : 1;

  return {
    page: fallbackPage,
    pageSize: fallbackPageSize,
    totalItems: itemCount,
    totalPages,
  };
}

function readNumber(source: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    if (!(key in source)) continue;
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return undefined;
}

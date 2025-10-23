import { mapListingDTO } from "@/features/listings/mappers/dtoToListing";
import { ListingDTO } from "@/features/listings/validation/listing.dto";
import { ApiError, api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";
import type { CreateListingInput } from "@/features/listings/api/createListing";
import { createListingFormData } from "@/features/listings/api/createListing";

export type UpdateListingInput = CreateListingInput;

export type UpdateListingOptions = {
  /**
   * Override the relative path used for the PATCH request.
   * Defaults to `/listings/{id}`.
   */
  path?: string;
  /**
   * Override the HTTP method (defaults to PATCH).
   */
  method?: "PATCH" | "PUT";
};

export type UpdateListingResult = {
  listing: Listing | null;
  raw: unknown;
};

const defaultMethod: UpdateListingOptions["method"] = "PATCH";

const normalizePath = (path: string): string => {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
};

const resolveApiErrorMessage = (error: ApiError): string => {
  if (error.body && typeof error.body === "object" && "message" in error.body) {
    const message = (error.body as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  if (typeof error.body === "string" && error.body.trim().length > 0) {
    return error.body;
  }

  return `Failed to update listing (${error.status})`;
};

export const updateListing = async (
  id: string,
  input: UpdateListingInput,
  options?: UpdateListingOptions,
): Promise<UpdateListingResult> => {
  const path = normalizePath(
    options?.path ?? `/listings/${encodeURIComponent(id)}`,
  );
  const method = options?.method ?? defaultMethod;
  const formData = createListingFormData(input);

  try {
    const body = await api<unknown>(path, {
      method,
      body: formData,
    });

    if (!body) {
      return { listing: null, raw: body };
    }

    const parsed = ListingDTO.safeParse(body);
    if (!parsed.success) {
      console.warn("[updateListing] Invalid response", {
        issues: parsed.error.issues.slice(0, 8).map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
        sample: body,
      });
      return { listing: null, raw: body };
    }

    return {
      listing: mapListingDTO(parsed.data),
      raw: body,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(resolveApiErrorMessage(error));
    }
    throw error;
  }
};

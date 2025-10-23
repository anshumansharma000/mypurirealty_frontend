import { mapListingDTO } from "@/features/listings/mappers/dtoToListing";
import { ListingDTO } from "@/features/listings/validation/listing.dto";
import { ApiError, api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";

export type NewImageUpload = {
  file: File;
  alt?: string | null;
  isPrimary?: boolean | null;
  replacesId?: string;
};

export type ListingMediaPayload = {
  newImages: NewImageUpload[];
  newVideos: File[];
  externalVideoUrls: string[];
  removeImageIds: string[];
  removeVideoUrls: string[];
  primaryNewImageIndex?: number;
};

export type CreateListingInput = {
  listing: Record<string, unknown>;
  media: ListingMediaPayload;
};

export type CreateListingOptions = {
  /**
   * Override the relative path used for the POST request.
   * Defaults to `/listings`.
   */
  path?: string;
};

export type CreateListingResult = {
  listing: Listing | null;
  raw: unknown;
};

const defaultPath = "/listings";

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

  return `Failed to create listing (${error.status})`;
};

const buildFormData = ({ listing, media }: CreateListingInput): FormData => {
  const formData = new FormData();

  const listingPayload = listing && Object.keys(listing).length > 0 ? listing : {};
  formData.append("listing", JSON.stringify(listingPayload));

  const {
    newImages = [],
    newVideos = [],
    externalVideoUrls = [],
    removeImageIds = [],
    removeVideoUrls = [],
    primaryNewImageIndex,
  } = media ?? {
    newImages: [],
    newVideos: [],
    externalVideoUrls: [],
    removeImageIds: [],
    removeVideoUrls: [],
    primaryNewImageIndex: undefined,
  };

  newImages.forEach(({ file, alt, replacesId }) => {
    formData.append("images[]", file);
    // legacy compatibility: some backends still look for `images`
    formData.append("images", file);
    const altText = typeof alt === "string" && alt.trim().length > 0 ? alt.trim() : "";
    formData.append("imageAlts[]", altText);
    if (replacesId) {
      formData.append("replaceImageIds[]", replacesId);
    }
  });

  if (typeof primaryNewImageIndex === "number" && Number.isInteger(primaryNewImageIndex)) {
    formData.append("primaryImageIndex", String(primaryNewImageIndex));
  }

  newVideos.forEach((video) => {
    formData.append("videos[]", video);
    // legacy compatibility: previous API consumed `videos`
    formData.append("videos", video);
  });

  externalVideoUrls.forEach((url) => {
    const trimmed = typeof url === "string" ? url.trim() : "";
    if (trimmed) {
      formData.append("externalVideoUrls[]", trimmed);
    }
  });

  removeImageIds.forEach((id) => {
    const trimmed = typeof id === "string" ? id.trim() : "";
    if (trimmed) {
      formData.append("removeImageIds[]", trimmed);
    }
  });

  removeVideoUrls.forEach((url) => {
    const trimmed = typeof url === "string" ? url.trim() : "";
    if (trimmed) {
      formData.append("removeVideoUrls[]", trimmed);
    }
  });

  return formData;
};

export const createListing = async (
  input: CreateListingInput,
  options?: CreateListingOptions,
): Promise<CreateListingResult> => {
  const path = normalizePath(options?.path ?? defaultPath);
  const formData = buildFormData(input);

  try {
    const body = await api<unknown>(path, {
      method: "POST",
      body: formData,
    });

    if (!body) {
      return { listing: null, raw: body };
    }

    const parsed = ListingDTO.safeParse(body);
    if (!parsed.success) {
      console.warn("[createListing] Invalid response", {
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

export const createListingFormData = buildFormData;

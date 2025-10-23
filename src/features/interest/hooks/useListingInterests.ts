"use client";

import {
  type ListingInterestsResult,
  getListingInterests,
} from "@/features/interest/api/getListingInterests";
import { qk } from "@/shared/query/keys";
import { ApiError } from "@/shared/api/http";
import { useQuery } from "@tanstack/react-query";

export function useListingInterests(
  listingId: string | undefined,
  page: number,
  pageSize: number,
  enabled = true,
) {
  return useQuery<ListingInterestsResult, ApiError | Error, ListingInterestsResult>({
    queryKey: listingId ? qk.listingInterests(listingId, page, pageSize) : ["listing-interests"],
    queryFn: () => {
      if (!listingId) {
        throw new Error("Missing listing id");
      }
      return getListingInterests(listingId, { page, pageSize });
    },
    enabled: Boolean(listingId) && enabled,
    placeholderData: (previous) => previous ?? undefined,
    staleTime: 60_000,
  });
}

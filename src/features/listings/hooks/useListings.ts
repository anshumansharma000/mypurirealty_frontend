// src/features/listings/hooks/useListings.ts
"use client";

import { type ListingsQuery, getListings } from "@/features/listings/api/getListings";
import { qk } from "@/shared/query/keys";
import type { Listing } from "@/shared/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// src/features/listings/hooks/useListings.ts

// src/features/listings/hooks/useListings.ts

// src/features/listings/hooks/useListings.ts

type ListingsResponse = { items: Listing[]; total: number };

export function useListings(params: ListingsQuery) {
  return useQuery<ListingsResponse, Error>({
    queryKey: qk.listings(params),
    queryFn: () => getListings(params),
    // v5 way to “keep previous page’s data while fetching”
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

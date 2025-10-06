// src/features/listings/hooks/useSimilar.ts
"use client";

import { getSimilar } from "@/features/listings/api/getSimilar";
import { qk } from "@/shared/query/keys";
import type { Listing } from "@/shared/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// src/features/listings/hooks/useSimilar.ts

export function useSimilar(id?: string) {
  const enabled = Boolean(id);
  return useQuery<Listing[], Error>({
    enabled,
    queryKey: enabled ? qk.similar(id!) : ["similar", "none"],
    queryFn: () => getSimilar(id!),
    // keep old list visible while refetching (v5 way)
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

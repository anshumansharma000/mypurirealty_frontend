"use client";

import { getListing } from "@/features/listings/api/getListing";
import { qk } from "@/shared/query/keys";
import { useQuery } from "@tanstack/react-query";

export function useListing(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: id ? qk.listing(id) : ["listing", "none"],
    queryFn: () => getListing(id!),
    staleTime: 60_000,
  });
}

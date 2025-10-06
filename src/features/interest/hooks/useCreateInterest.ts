// src/features/listings/hooks/useCreateInterest.ts
"use client";

import { type CreateInterestPayload, createInterest } from "@/features/interest/api/createInterest";
import { qk } from "@/shared/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// src/features/listings/hooks/useCreateInterest.ts

// src/features/listings/hooks/useCreateInterest.ts

// src/features/listings/hooks/useCreateInterest.ts

export function useCreateInterest(listingId?: string) {
  const qc = useQueryClient();

  return useMutation<{ ok: true }, Error, Omit<CreateInterestPayload, "listingId">>({
    mutationFn: (payload) => createInterest({ listingId: listingId!, ...payload }),
    onSuccess: async () => {
      if (listingId) {
        // v5: still valid; returns a Promise
        await qc.invalidateQueries({ queryKey: qk.listing(listingId) });
      }
    },
  });
}

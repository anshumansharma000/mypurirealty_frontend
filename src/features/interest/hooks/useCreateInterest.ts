// src/features/listings/hooks/useCreateInterest.ts
"use client";

import {
  type CreateInterestPayload,
  type CreateInterestResponse,
  createInterest,
} from "@/features/interest/api/createInterest";
import { qk } from "@/shared/query/keys";
import { ApiError } from "@/shared/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// src/features/listings/hooks/useCreateInterest.ts

// src/features/listings/hooks/useCreateInterest.ts

// src/features/listings/hooks/useCreateInterest.ts

export function useCreateInterest(listingId?: string) {
  const qc = useQueryClient();

  return useMutation<CreateInterestResponse, ApiError | Error, CreateInterestPayload>({
    mutationFn: async (payload) => {
      if (!listingId) {
        throw new Error("Missing listing id");
      }
      return createInterest(listingId, payload);
    },
    onSuccess: async () => {
      if (listingId) {
        // v5: still valid; returns a Promise
        await qc.invalidateQueries({ queryKey: qk.listing(listingId) });
      }
    },
  });
}

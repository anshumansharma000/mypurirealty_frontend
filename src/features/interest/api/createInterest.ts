import { api } from "@/shared/api/http";

export type CreateInterestPayload = {
  listingId: string;
  name: string;
  phone: string;
  message?: string;
};

export async function createInterest(payload: CreateInterestPayload) {
  return api<{ ok: true }>(`/interest`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

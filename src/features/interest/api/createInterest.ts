import { api } from "@/shared/api/http";

export type CreateInterestPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
};

export type CreateInterestResponse =
  | {
      id?: string;
      createdAt?: string;
    }
  | undefined;

export async function createInterest(listingId: string, payload: CreateInterestPayload) {
  return api<CreateInterestResponse>(`/listings/${encodeURIComponent(listingId)}/interests`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

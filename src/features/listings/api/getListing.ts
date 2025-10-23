import { mapListingDTO } from "@/features/listings/mappers/dtoToListing";
import { ListingDTO, ListingEnvelopeDTO } from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";
// ——— API ———
export async function getListing(id: string): Promise<Readonly<Listing>> {
  const raw = await api(`/listings/${encodeURIComponent(id)}`);

  const envelopeAttempt = ListingEnvelopeDTO.safeParse(raw);
  const payload = envelopeAttempt.success ? envelopeAttempt.data.data : raw;

  const parsed = ListingDTO.safeParse(payload);

  if (!parsed.success) {
    console.error("[getListing] ZodError", {
      message: parsed.error.message,
      issues: parsed.error.issues.slice(0, 10).map((i) => ({
        path: i.path.join("."),
        code: i.code,
        message: i.message,
      })),
      sample: payload,
      response: envelopeAttempt.success ? envelopeAttempt.data : raw,
    });
    throw new Error("Invalid /listings/:id response (see console for ZodError)");
  }

  return Object.freeze(mapListingDTO(parsed.data));
}

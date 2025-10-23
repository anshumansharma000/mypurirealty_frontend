import { mapListingDTO } from "@/features/listings/mappers/dtoToListing";
import { ListingDTO, type ListingDTOType } from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";

export async function getSimilar(id: string): Promise<Listing[]> {
  const raw = await api(`/listings/${encodeURIComponent(id)}/similar`);
  // the endpoint returns an array of listings
  const arr = Array.isArray(raw) ? raw : [];
  const parsed: ListingDTOType[] = arr.flatMap((item) => {
    const result = ListingDTO.safeParse(item);
    return result.success ? [result.data] : [];
  });

  return parsed.map(mapListingDTO);
}

import { ListingDTO, ListingDTOType } from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";

const toArea = (a: ListingDTOType["carpetArea"]): Listing["carpetArea"] => {
  if (a === undefined || a === null) return undefined;
  if (typeof a === "number") return { value: a, unit: "sqft" };
  return { value: a.value, unit: a.unit as any };
};

const toImages = (arr: NonNullable<ListingDTOType["images"]>): Listing["images"] => {
  const objs = arr.map((x) =>
    typeof x === "string" ? { url: x } : { url: x.url, alt: x.alt, isPrimary: x.isPrimary },
  );
  if (objs.length === 0) return [];
  if (!objs.some((i) => i.isPrimary)) objs[0].isPrimary = true;
  return objs;
};

const map = (d: ListingDTOType): Listing => ({
  id: d.id,
  slug: d.slug,
  category: d.category as any,
  transactionType: d.transactionType as any,
  status: d.status as any,
  constructionStatus: d.constructionStatus as any,
  title: d.title,
  description: d.description,
  ownership: d.ownership as any,
  yearBuilt: d.yearBuilt ?? undefined,
  possessionDate: d.possessionDate,
  carpetArea: toArea(d.carpetArea),
  builtUpArea: toArea(d.builtUpArea),
  superBuiltUpArea: toArea(d.superBuiltUpArea),
  landArea: toArea(d.landArea),
  plotLengthFt: d.plotLengthFt ?? undefined,
  plotWidthFt: d.plotWidthFt ?? undefined,
  frontageFt: d.frontageFt ?? undefined,
  roadWidthFt: d.roadWidthFt ?? undefined,
  plotFacing: d.plotFacing as any,
  cornerPlot: d.cornerPlot ?? undefined,
  bedrooms: d.bedrooms ?? undefined,
  bathrooms: d.bathrooms ?? undefined,
  balconies: d.balconies ?? undefined,
  furnishing: d.furnishing as any,
  floorNumber: d.floorNumber ?? undefined,
  totalFloors: d.totalFloors ?? undefined,
  hasLift: d.hasLift ?? undefined,
  coveredParkingCount: d.coveredParkingCount ?? undefined,
  openParkingCount: d.openParkingCount ?? undefined,
  vaastuCompliant: d.vaastuCompliant ?? undefined,
  unitFacing: d.unitFacing as any,
  price: Number(d.price),
  priceBreakup: d.priceBreakup ? { ...d.priceBreakup } : undefined,
  address: d.address ?? "",
  addressParts: d.addressParts
    ? {
        ...d.addressParts,
        city: d.addressParts.city ?? "Puri",
        state: d.addressParts.state ?? "Odisha",
      }
    : ({ city: "Puri", state: "Odisha" } as Listing["addressParts"]),
  geo: d.geo ? { lat: Number(d.geo.lat), lng: Number(d.geo.lng) } : undefined,
  societyName: d.societyName,
  reraId: d.reraId,
  reraRegistered: d.reraRegistered ?? undefined,
  amenities: d.amenities as Listing["amenities"],
  images: toImages(d.images),
  videoUrls: d.videoUrls,
  virtualTourUrl: d.virtualTourUrl,
  documents: d.documents as Listing["documents"],
  listedByType: d.listedByType as Listing["listedByType"],
  listedByName: d.listedByName,
  contactNumber: d.contactNumber,
  verified: d.verified ?? undefined,
  isFeatured: d.isFeatured ?? undefined,
  tags: d.tags,
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
  postedAt: d.postedAt,
});

export async function getListing(id: string) {
  const raw = await api(`/listings/${id}`);
  const dto = ListingDTO.parse(raw);
  return map(dto);
}

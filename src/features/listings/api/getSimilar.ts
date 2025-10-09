import { ListingDTO, type ListingDTOType } from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";

// reuse the small mappers
const toArea = (a: ListingDTOType["carpetArea"]): Listing["carpetArea"] => {
  if (a == null) return undefined;
  if (typeof a === "number") return { value: a, unit: "sqft" };
  return { value: Number(a.value), unit: a.unit as any };
};

const toImages = (arr: NonNullable<ListingDTOType["images"]>): Listing["images"] => {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const objs = arr.map((x) =>
    typeof x === "string"
      ? { url: x }
      : { url: x.url, alt: x.alt ?? undefined, isPrimary: x.isPrimary ?? undefined },
  );
  if (!objs.some((i) => i.isPrimary)) objs[0].isPrimary = true;
  return objs;
};

const map = (d: ListingDTOType): Listing => ({
  id: d.id,
  slug: d.slug ?? undefined,

  category: d.category as Listing["category"],
  transactionType: d.transactionType as Listing["transactionType"],
  status: d.status as Listing["status"],
  constructionStatus: d.constructionStatus as Listing["constructionStatus"],

  title: d.title,
  description: d.description ?? undefined,
  ownership: d.ownership as Listing["ownership"],
  yearBuilt: d.yearBuilt ?? undefined,
  possessionDate: d.possessionDate ?? undefined,

  carpetArea: toArea(d.carpetArea),
  builtUpArea: toArea(d.builtUpArea),
  superBuiltUpArea: toArea(d.superBuiltUpArea),
  landArea: toArea(d.landArea),

  plotLengthFt: d.plotLengthFt ?? undefined,
  plotWidthFt: d.plotWidthFt ?? undefined,
  frontageFt: d.frontageFt ?? undefined,
  roadWidthFt: d.roadWidthFt ?? undefined,
  plotFacing: d.plotFacing as Listing["plotFacing"],
  cornerPlot: d.cornerPlot ?? undefined,

  bedrooms: d.bedrooms ?? undefined,
  bathrooms: d.bathrooms ?? undefined,
  balconies: d.balconies ?? undefined,
  furnishing: d.furnishing as Listing["furnishing"],
  floorNumber: d.floorNumber ?? undefined,
  totalFloors: d.totalFloors ?? undefined,
  hasLift: d.hasLift ?? undefined,
  coveredParkingCount: d.coveredParkingCount ?? undefined,
  openParkingCount: d.openParkingCount ?? undefined,
  vaastuCompliant: d.vaastuCompliant ?? undefined,
  unitFacing: d.unitFacing as Listing["unitFacing"],

  price: Number(d.price),
  priceBreakup: d.priceBreakup
    ? {
        basePrice: d.priceBreakup.basePrice ?? undefined,
        maintenanceMonthly: d.priceBreakup.maintenanceMonthly ?? undefined,
        parkingCharges: d.priceBreakup.parkingCharges ?? undefined,
        clubMembershipCharges: d.priceBreakup.clubMembershipCharges ?? undefined,
        registrationCharges: d.priceBreakup.registrationCharges ?? undefined,
        gstPercent: d.priceBreakup.gstPercent ?? undefined,
        negotiable: d.priceBreakup.negotiable ?? undefined,
        allInclusive: d.priceBreakup.allInclusive ?? undefined,
        bookingAmount: d.priceBreakup.bookingAmount ?? undefined,
      }
    : undefined,

  address: d.address ?? "",
  addressParts: d.addressParts
    ? {
        city: d.addressParts.city ?? "Puri",
        state: d.addressParts.state ?? "Odisha",
        line1: d.addressParts.line1 ?? undefined,
        line2: d.addressParts.line2 ?? undefined,
        locality: d.addressParts.locality ?? undefined,
        landmark: d.addressParts.landmark ?? undefined,
        pincode: d.addressParts.pincode ?? undefined,
      }
    : ({ city: "Puri", state: "Odisha" } as Listing["addressParts"]),
  geo: d.geo ? { lat: Number(d.geo.lat), lng: Number(d.geo.lng) } : undefined,

  societyName: d.societyName ?? undefined,
  reraId: d.reraId ?? undefined,
  reraRegistered: d.reraRegistered ?? undefined,
  amenities: (d.amenities ?? undefined) as Listing["amenities"],

  images: toImages(d.images ?? []),
  videoUrls: d.videoUrls ?? undefined,
  virtualTourUrl: d.virtualTourUrl ?? undefined,
  documents: (d.documents ?? undefined) as Listing["documents"],

  listedByType: d.listedByType as Listing["listedByType"],
  listedByName: d.listedByName ?? undefined,
  contactNumber: d.contactNumber ?? undefined,
  verified: d.verified ?? undefined,

  isFeatured: d.isFeatured ?? undefined,
  tags: d.tags ?? undefined,
  createdAt: d.createdAt ?? undefined,
  updatedAt: d.updatedAt ?? undefined,
  postedAt: d.postedAt ?? undefined,
});

export async function getSimilar(id: string): Promise<Listing[]> {
  const raw = await api(`/listings/${encodeURIComponent(id)}/similar`);
  // the endpoint returns an array of listings
  const arr = Array.isArray(raw) ? raw : [];
  const parsed = arr
    .map((r) => ListingDTO.safeParse(r))
    .filter((r) => r.success)
    .map((r) => (r as any).data as ListingDTOType);

  return parsed.map(map);
}

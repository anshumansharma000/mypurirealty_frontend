// src/features/listings/api/getListings.ts
import {
  ListingDTOType,
  // If you want to validate a single item during debugging:
  // ListingDTO,
  ListingsListResponseDTO,
} from "@/features/listings/validation/listing.dto";
import { api } from "@/shared/api/http";
import type { Listing } from "@/shared/types";

// ---------- Public query type ----------
export type ListingsQuery = {
  city?: string;
  q?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bhk?: number;
  furnishing?: string;
  constructionStatus?: string;
  category?: string;
  status?: string;
};

// ---------- Helpers (DTO -> Domain) ----------
const toArea = (a: ListingDTOType["carpetArea"]): Listing["carpetArea"] => {
  if (a == null) return undefined;
  if (typeof a === "number") return { value: a, unit: "sqft" };
  // object case
  return { value: Number(a.value), unit: a.unit as any };
};

const toImages = (arr: NonNullable<ListingDTOType["images"]>): Listing["images"] => {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const objs = arr.map((x) =>
    typeof x === "string"
      ? { url: x }
      : { url: x.url, alt: x.alt ?? undefined, isPrimary: x.isPrimary ?? undefined },
  );
  // ensure a single primary (mark first if none)
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

// ---------- API ----------
export async function getListings(params: ListingsQuery) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
  ).toString();

  const json = await api(`/listings?${qs}`);

  // Use safeParse for clear diagnostics while iterating
  const result = ListingsListResponseDTO.safeParse(json);
  if (!result.success) {
    console.error("[getListings] ZodError", {
      message: result.error.message,
      issues: result.error.issues.slice(0, 8).map((i) => ({
        path: i.path.join("."),
        code: i.code,
        message: i.message,
      })),
    });

    // Optional: try to pinpoint the first offending item
    const items = Array.isArray((json as any)?.items) ? (json as any).items : [];
    for (let i = 0; i < items.length; i++) {
      const r = (ListingsListResponseDTO.shape.items._def.type as any).element.safeParse
        ? (ListingsListResponseDTO.shape.items as any).element.safeParse(items[i])
        : undefined;
      if (r && !r.success) {
        console.error("[getListings] Bad item index", i, {
          issues: r.error.issues.map((ii: any) => ({
            path: ii.path.join("."),
            code: ii.code,
            message: ii.message,
          })),
          sample: items[i],
        });
        break;
      }
    }

    throw new Error("Invalid /listings response (see console for ZodError)");
  }

  const parsed = result.data;
  return {
    items: parsed.items.map(map),
    total: Number(parsed.total),
  };
}

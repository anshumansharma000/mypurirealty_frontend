// src/features/listings/validation/listing.dto.ts
import { z } from "zod";

/**
 * Helpers (modern Zod)
 * - Use z.coerce.* where possible
 * - Handle "" → undefined via union with an empty-string literal
 * - datetime() with explicit options
 */
const Empty = z.literal("").transform(() => undefined);

const N = z
  .union([z.coerce.number(), Empty])
  .optional()
  .transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : undefined));

const B = z
  .union([z.coerce.boolean(), Empty])
  .optional()
  .transform((v) => (typeof v === "boolean" ? v : undefined));

const Iso = z
  .union([z.string().datetime({ offset: true }), Empty])
  .optional()
  .transform((v) => (typeof v === "string" ? v : undefined));

const AreaUnit = z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]);

// Area can be { value, unit } or a plain number (we default unit in mapping)
const AreaDTO = z
  .union([z.object({ value: z.coerce.number(), unit: AreaUnit }), z.coerce.number(), Empty])
  .optional()
  .transform((v) => (v === undefined ? undefined : v));

const ImageObj = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: B,
});

const ImagesDTO = z
  .union([
    z.array(ImageObj),
    z.array(z.string().url()),
    Empty, // allow empty string as “no images”
  ])
  .optional()
  .transform((v) => (Array.isArray(v) ? v : []));

const PriceBreakupDTO = z
  .object({
    basePrice: N,
    maintenanceMonthly: N,
    parkingCharges: N,
    clubMembershipCharges: N,
    registrationCharges: N,
    gstPercent: N,
    negotiable: B,
    allInclusive: B,
    bookingAmount: N,
  })
  .partial()
  .optional();

const AddressPartsDTO = z
  .object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    locality: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  })
  .partial()
  .optional();

const GeoDTO = z
  .object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  })
  .optional();

const ContactType = z.enum(["Owner", "Broker", "Builder", "Agency"]).optional();

export const ListingDTO = z
  .object({
    id: z.string(),
    slug: z.string().optional(),

    // keep enums flexible as strings; domain narrows usage
    category: z.string().optional(),
    transactionType: z.string().optional(),
    status: z.string().optional(),
    constructionStatus: z.string().optional(),

    title: z.string(),
    description: z.string().optional(),
    ownership: z.string().optional(),
    yearBuilt: N,
    possessionDate: Iso,

    carpetArea: AreaDTO,
    builtUpArea: AreaDTO,
    superBuiltUpArea: AreaDTO,
    landArea: AreaDTO,

    plotLengthFt: N,
    plotWidthFt: N,
    frontageFt: N,
    roadWidthFt: N,
    plotFacing: z.string().optional(),
    cornerPlot: B,

    bedrooms: N,
    bathrooms: N,
    balconies: N,
    furnishing: z.string().optional(),
    floorNumber: N,
    totalFloors: N,
    hasLift: B,
    coveredParkingCount: N,
    openParkingCount: N,
    vaastuCompliant: B,
    unitFacing: z.string().optional(),

    // backend sends camelCase price now
    price: z.coerce.number(),
    priceBreakup: PriceBreakupDTO,

    address: z.string().optional(),
    addressParts: AddressPartsDTO,
    geo: GeoDTO,

    societyName: z.string().optional(),
    reraId: z.string().optional(),
    reraRegistered: B,
    amenities: z.array(z.string()).optional(),

    images: ImagesDTO,
    videoUrls: z.array(z.string().url()).optional(),
    virtualTourUrl: z.string().url().optional(),
    documents: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),

    listedByType: ContactType,
    listedByName: z.string().optional(),
    contactNumber: z.string().optional(),
    verified: B,

    isFeatured: B,
    tags: z.array(z.string()).optional(),
    createdAt: Iso,
    updatedAt: Iso,
    postedAt: Iso,

    broker: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
        type: ContactType,
      })
      .partial()
      .optional(),
  })
  .loose();

export const ListingsListResponseDTO = z.object({
  items: z.array(ListingDTO),
  total: z.coerce.number(),
});

export const SimilarListingsResponseDTO = z.array(ListingDTO);

// TS helper
export type ListingDTOType = z.infer<typeof ListingDTO>;

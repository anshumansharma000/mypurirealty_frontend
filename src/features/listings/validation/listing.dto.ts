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

// helpers
const S = z.string().nullish(); // string | null | undefined
const Iso = z.string().datetime({ offset: true }).nullish();

// const Iso = z
//   .union([z.string().datetime({ offset: true }), Empty])
//   .optional()
//   .transform((v) => (typeof v === "string" ? v : undefined));

const AreaUnit = z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]);

// Area can be { value, unit } or a plain number (we default unit in mapping)
const AreaDTO = z
  .union([z.object({ value: z.coerce.number(), unit: AreaUnit }), z.coerce.number(), Empty])
  .optional()
  .transform((v) => (v === undefined ? undefined : v));

const ImageObj = z.object({
  url: z.string().url(),
  alt: S,
  isPrimary: z.coerce.boolean().nullish(),
});
// const ImageObj = z.object({
//   url: z.string().url(),
//   alt: z.string().optional(),
//   isPrimary: B,
// });

// const ImagesDTO = z
//   .union([
//     z.array(ImageObj),
//     z.array(z.string().url()),
//     Empty, // allow empty string as “no images”
//   ])
//   .optional()
//   .transform((v) => (Array.isArray(v) ? v : []));

const ImagesDTO = z.array(z.union([ImageObj, z.string().url()])).nullish();

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

    carpetArea: z
      .union([
        z.object({
          value: z.coerce.number(),
          unit: z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]),
        }),
        z.coerce.number(),
      ])
      .nullish(),
    builtUpArea: z
      .union([
        z.object({
          value: z.coerce.number(),
          unit: z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]),
        }),
        z.coerce.number(),
      ])
      .nullish(),
    superBuiltUpArea: z
      .union([
        z.object({
          value: z.coerce.number(),
          unit: z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]),
        }),
        z.coerce.number(),
      ])
      .nullish(),
    landArea: z
      .union([
        z.object({
          value: z.coerce.number(),
          unit: z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]),
        }),
        z.coerce.number(),
      ])
      .nullish(),

    plotLengthFt: z.coerce.number().nullish(),
    plotWidthFt: z.coerce.number().nullish(),
    frontageFt: z.coerce.number().nullish(),
    roadWidthFt: z.coerce.number().nullish(),
    plotFacing: S,
    cornerPlot: z.coerce.boolean().nullish(),

    bedrooms: z.coerce.number().nullish(),
    bathrooms: z.coerce.number().nullish(),
    balconies: z.coerce.number().nullish(),
    furnishing: S, // ← nullish now
    floorNumber: z.coerce.number().nullish(),
    totalFloors: z.coerce.number().nullish(),
    hasLift: z.coerce.boolean().nullish(),
    coveredParkingCount: z.coerce.number().nullish(),
    openParkingCount: z.coerce.number().nullish(),
    vaastuCompliant: z.coerce.boolean().nullish(),
    unitFacing: S,

    // backend sends camelCase price now
    price: z.coerce.number(),
    priceBreakup: z
      .object({
        basePrice: z.coerce.number().nullish(),
        maintenanceMonthly: z.coerce.number().nullish(),
        parkingCharges: z.coerce.number().nullish(),
        clubMembershipCharges: z.coerce.number().nullish(),
        registrationCharges: z.coerce.number().nullish(),
        gstPercent: z.coerce.number().nullish(),
        negotiable: z.coerce.boolean().nullish(),
        allInclusive: z.coerce.boolean().nullish(),
        bookingAmount: z.coerce.number().nullish(),
      })
      .partial()
      .nullish(),

    address: S,
    addressParts: z
      .object({
        line1: S,
        line2: S,
        locality: S,
        landmark: S,
        city: S,
        state: S,
        pincode: S,
      })
      .partial()
      .nullish(),
    geo: z.object({ lat: z.coerce.number(), lng: z.coerce.number() }).nullish(),

    societyName: S, // ← nullish now
    reraId: S, // ← nullish now
    reraRegistered: z.coerce.boolean().nullish(),
    amenities: z.array(z.string()).nullish(),

    images: ImagesDTO, // ← mixed array allowed
    videoUrls: z.array(z.string().url()).nullish(),
    virtualTourUrl: z.string().url().nullish(), // ← nullish now
    documents: z.array(z.object({ label: z.string(), url: z.string().url() })).nullish(),

    listedByType: z.enum(["Owner", "Broker", "Builder", "Agency"]).nullish(),
    listedByName: S,
    contactNumber: S,
    verified: z.coerce.boolean().nullish(),

    isFeatured: z.coerce.boolean().nullish(),
    tags: z.array(z.string()).nullish(),
    createdAt: Iso,
    updatedAt: Iso,
    postedAt: Iso,

    broker: z
      .object({
        id: S,
        name: S,
        phone: S,
        type: z.enum(["Owner", "Broker", "Builder", "Agency"]).nullish(),
      })
      .partial()
      .nullish(),
  })
  .loose();

export const ListingsListResponseDTO = z.object({
  items: z.array(ListingDTO),
  total: z.coerce.number(),
});

export const SimilarListingsResponseDTO = z.array(ListingDTO);

// TS helper
export type ListingDTOType = z.infer<typeof ListingDTO>;

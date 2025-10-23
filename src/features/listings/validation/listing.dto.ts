// src/features/listings/validation/listing.dto.ts
import { z } from "zod";

const Empty = z.literal("").transform(() => undefined);

const OptionalNumber = z
  .union([z.coerce.number(), Empty])
  .optional()
  .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : undefined));

const OptionalBoolean = z
  .union([z.coerce.boolean(), Empty])
  .optional()
  .transform((value) => (typeof value === "boolean" ? value : undefined));

const OptionalString = z.string().optional().nullable();
const Iso = z.string().datetime({ offset: true }).optional().nullable();

const AreaUnit = z.enum(["sqft", "sqyd", "sqm", "acre", "hectare", "decimal", "biswa", "guntha"]);
const TransactionType = z.enum(["sale", "rent"]);
const ListingStatus = z.enum([
  "draft",
  "available",
  "reserved",
  "under_offer",
  "booked",
  "sold",
  "rented",
  "inactive",
]);
const ConstructionStatus = z.enum(["under_construction", "ready_to_move", "new_launch"]);
const Furnishing = z.enum(["fully", "semi", "unfurnished"]);
const DirectionFacing = z.enum([
  "North",
  "North-East",
  "East",
  "South-East",
  "South",
  "South-West",
  "West",
  "North-West",
]);
const ContactType = z.enum(["Owner", "Broker", "Builder", "Agency"]);
const MediaKind = z.enum(["image", "video", "floor_plan", "document"]);

const AreaDTO = z
  .object({
    value: z.coerce.number(),
    unit: AreaUnit,
  })
  .optional()
  .nullable();

const PriceBreakupDTO = z
  .object({
    basePrice: OptionalNumber,
    maintenanceMonthly: OptionalNumber,
    parkingCharges: OptionalNumber,
    clubMembershipCharges: OptionalNumber,
    registrationCharges: OptionalNumber,
    gstPercent: OptionalNumber,
    negotiable: OptionalBoolean,
    allInclusive: OptionalBoolean,
    bookingAmount: OptionalNumber,
  })
  .optional()
  .nullable();

const AddressPartsDTO = z
  .object({
    line1: OptionalString,
    line2: OptionalString,
    locality: OptionalString,
    landmark: OptionalString,
    city: OptionalString,
    state: OptionalString,
    pincode: OptionalString,
  })
  .optional()
  .nullable();

const GeoDTO = z
  .object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    accuracyMeters: OptionalNumber,
  })
  .optional()
  .nullable();

const MediaDTO = z
  .object({
    id: OptionalString,
    url: z.string().url(),
    kind: MediaKind.optional().nullable(),
    order: OptionalNumber,
    alt: OptionalString,
    isPrimary: OptionalBoolean,
    createdAt: Iso,
    updatedAt: Iso,
  })
  .optional();

const DocumentDTO = z
  .object({
    id: OptionalString,
    label: z.string(),
    url: z.string().url(),
    kind: OptionalString,
    createdAt: Iso,
    updatedAt: Iso,
  })
  .optional();

const BrokerDTO = z
  .object({
    id: z.string().uuid().optional(),
    name: OptionalString,
    phone: OptionalString,
    email: OptionalString,
    type: ContactType.optional().nullable(),
  })
  .optional()
  .nullable();

const SeoDTO = z
  .object({
    title: OptionalString,
    description: OptionalString,
    keywords: z.array(z.string()).optional().nullable(),
  })
  .optional()
  .nullable();

const AnalyticsDTO = z
  .object({
    views: OptionalNumber,
    saves: OptionalNumber,
    inquiries: OptionalNumber,
  })
  .optional()
  .nullable();

export const ListingDTO = z.object({
  id: z.string(),
  slug: OptionalString,
  externalId: OptionalString,

  category: z.string(),
  transactionType: TransactionType,
  status: ListingStatus,
  constructionStatus: ConstructionStatus.optional().nullable(),

  title: z.string(),
  subtitle: OptionalString,
  description: OptionalString,
  highlights: z.array(z.string()).optional().nullable(),
  ownership: OptionalString,
  yearBuilt: OptionalNumber,
  possessionDate: Iso,

  carpetArea: AreaDTO,
  builtUpArea: AreaDTO,
  superBuiltUpArea: AreaDTO,
  landArea: AreaDTO,

  plotLengthFt: OptionalNumber,
  plotWidthFt: OptionalNumber,
  frontageFt: OptionalNumber,
  roadWidthFt: OptionalNumber,
  plotFacing: DirectionFacing.optional().nullable(),
  cornerPlot: OptionalBoolean,

  bedrooms: OptionalNumber,
  bathrooms: OptionalNumber,
  balconies: OptionalNumber,
  furnishing: Furnishing.optional().nullable(),
  floorNumber: OptionalNumber,
  totalFloors: OptionalNumber,
  hasLift: OptionalBoolean,
  coveredParkingCount: OptionalNumber,
  openParkingCount: OptionalNumber,
  vaastuCompliant: OptionalBoolean,
  unitFacing: DirectionFacing.optional().nullable(),

  price: z.coerce.number(),
  pricePerSqft: OptionalNumber,
  priceBreakup: PriceBreakupDTO,
  maintenanceTerms: OptionalString,

  address: OptionalString,
  addressParts: AddressPartsDTO,
  geo: GeoDTO,

  societyName: OptionalString,
  projectName: OptionalString,
  reraId: OptionalString,
  reraRegistered: OptionalBoolean,
  amenities: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),

  images: z.array(MediaDTO.or(z.string().url())).optional().nullable(),
  videoUrls: z.array(z.string().url()).optional().nullable(),
  virtualTourUrl: OptionalString,
  documents: z.array(DocumentDTO).optional().nullable(),

  listedByType: ContactType.optional().nullable(),
  listedByName: OptionalString,
  contactNumber: OptionalString,
  contactEmail: OptionalString,
  whatsAppNumber: OptionalString,
  verified: OptionalBoolean,
  broker: BrokerDTO,

  isFeatured: OptionalBoolean,
  featuredAt: Iso,
  publishedAt: Iso,
  postedAt: Iso,
  archivedAt: Iso,
  createdAt: Iso,
  updatedAt: Iso,

  seo: SeoDTO,
  analytics: AnalyticsDTO,
});

export type ListingDTOType = z.infer<typeof ListingDTO>;

export const ListingsListResponseDTO = z.object({
  items: z.array(ListingDTO),
  total: z.coerce.number(),
});

export const ListingsListEnvelopeDTO = z
  .object({
    data: ListingsListResponseDTO,
    success: z.boolean().optional(),
    message: z.string().optional(),
  })
  .passthrough();

export const ListingEnvelopeDTO = z
  .object({
    data: ListingDTO,
    success: z.boolean().optional(),
    message: z.string().optional(),
  })
  .passthrough();

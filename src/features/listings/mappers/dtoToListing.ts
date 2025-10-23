import type { Listing, AreaUnit } from "@/shared/types";
import type { ListingDTOType } from "@/features/listings/validation/listing.dto";

const fallbackCity = "Puri";
const fallbackState = "Odisha";

const toArea = (area: ListingDTOType["carpetArea"]): Listing["carpetArea"] => {
  if (!area) return undefined;
  if (typeof area === "object" && "value" in area) {
    return { value: Number(area.value), unit: area.unit as AreaUnit };
  }
  if (typeof area === "number" && !Number.isNaN(area)) {
    return { value: area, unit: "sqft" };
  }
  return undefined;
};

const toImages = (images: NonNullable<ListingDTOType["images"]>): Listing["images"] => {
  if (!Array.isArray(images)) return [];

  const normalized: Listing["images"][number][] = images.flatMap((entry) => {
    if (typeof entry === "string") {
      return entry ? [{ url: entry }] : [];
    }

    if (!entry?.url) return [];

    return [
      {
        id: entry.id ?? undefined,
        url: entry.url,
        kind: entry.kind ?? undefined,
        order: entry.order ?? undefined,
        alt: entry.alt ?? undefined,
        isPrimary: entry.isPrimary ?? undefined,
        createdAt: entry.createdAt ?? undefined,
        updatedAt: entry.updatedAt ?? undefined,
      },
    ];
  });

  if (normalized.length > 0 && !normalized.some((image) => image.isPrimary)) {
    normalized[0].isPrimary = true;
  }

  return normalized;
};

const toDocuments = (documents: ListingDTOType["documents"]): Listing["documents"] => {
  if (!Array.isArray(documents)) return undefined;
  const normalized: NonNullable<Listing["documents"]> = documents.flatMap((doc) => {
    if (!doc) return [];

    return [
      {
        id: doc.id ?? undefined,
        label: doc.label,
        url: doc.url,
        kind: doc.kind ?? undefined,
        createdAt: doc.createdAt ?? undefined,
        updatedAt: doc.updatedAt ?? undefined,
      },
    ];
  });
  return normalized;
};

const toAddressParts = (parts: ListingDTOType["addressParts"]): Listing["addressParts"] => {
  if (!parts) return undefined;
  return {
    line1: parts.line1 ?? undefined,
    line2: parts.line2 ?? undefined,
    locality: parts.locality ?? undefined,
    landmark: parts.landmark ?? undefined,
    city: parts.city ?? fallbackCity,
    state: parts.state ?? fallbackState,
    pincode: parts.pincode ?? undefined,
  };
};

export const mapListingDTO = (dto: ListingDTOType): Listing => ({
  id: dto.id,
  slug: dto.slug ?? undefined,
  externalId: dto.externalId ?? undefined,

  category: dto.category as Listing["category"],
  transactionType: dto.transactionType,
  status: dto.status,
  constructionStatus: dto.constructionStatus ?? undefined,

  title: dto.title,
  subtitle: dto.subtitle ?? undefined,
  description: dto.description ?? undefined,
  highlights: dto.highlights ?? undefined,
  ownership: dto.ownership ?? undefined,
  yearBuilt: dto.yearBuilt ?? undefined,
  possessionDate: dto.possessionDate ?? undefined,

  carpetArea: toArea(dto.carpetArea),
  builtUpArea: toArea(dto.builtUpArea),
  superBuiltUpArea: toArea(dto.superBuiltUpArea),
  landArea: toArea(dto.landArea),

  plotLengthFt: dto.plotLengthFt ?? undefined,
  plotWidthFt: dto.plotWidthFt ?? undefined,
  frontageFt: dto.frontageFt ?? undefined,
  roadWidthFt: dto.roadWidthFt ?? undefined,
  plotFacing: dto.plotFacing ?? undefined,
  cornerPlot: dto.cornerPlot ?? undefined,

  bedrooms: dto.bedrooms ?? undefined,
  bathrooms: dto.bathrooms ?? undefined,
  balconies: dto.balconies ?? undefined,
  furnishing: dto.furnishing ?? undefined,
  floorNumber: dto.floorNumber ?? undefined,
  totalFloors: dto.totalFloors ?? undefined,
  hasLift: dto.hasLift ?? undefined,
  coveredParkingCount: dto.coveredParkingCount ?? undefined,
  openParkingCount: dto.openParkingCount ?? undefined,
  vaastuCompliant: dto.vaastuCompliant ?? undefined,
  unitFacing: dto.unitFacing ?? undefined,

  price: Number(dto.price),
  pricePerSqft: dto.pricePerSqft ?? undefined,
  priceBreakup: dto.priceBreakup
    ? {
        basePrice: dto.priceBreakup.basePrice ?? undefined,
        maintenanceMonthly: dto.priceBreakup.maintenanceMonthly ?? undefined,
        parkingCharges: dto.priceBreakup.parkingCharges ?? undefined,
        clubMembershipCharges: dto.priceBreakup.clubMembershipCharges ?? undefined,
        registrationCharges: dto.priceBreakup.registrationCharges ?? undefined,
        gstPercent: dto.priceBreakup.gstPercent ?? undefined,
        negotiable: dto.priceBreakup.negotiable ?? undefined,
        allInclusive: dto.priceBreakup.allInclusive ?? undefined,
        bookingAmount: dto.priceBreakup.bookingAmount ?? undefined,
      }
    : undefined,
  maintenanceTerms: dto.maintenanceTerms ?? undefined,

  address: dto.address ?? undefined,
  addressParts: toAddressParts(dto.addressParts),
  geo: dto.geo
    ? {
        lat: Number(dto.geo.lat),
        lng: Number(dto.geo.lng),
        accuracyMeters: dto.geo.accuracyMeters ?? undefined,
      }
    : undefined,

  societyName: dto.societyName ?? undefined,
  projectName: dto.projectName ?? undefined,
  reraId: dto.reraId ?? undefined,
  reraRegistered: dto.reraRegistered ?? undefined,
  amenities: dto.amenities ?? undefined,
  tags: dto.tags ?? undefined,

  images: toImages(dto.images ?? []),
  videoUrls: dto.videoUrls ?? undefined,
  virtualTourUrl: dto.virtualTourUrl ?? undefined,
  documents: toDocuments(dto.documents),

  listedByType: dto.listedByType ?? undefined,
  listedByName: dto.listedByName ?? undefined,
  contactNumber: dto.contactNumber ?? undefined,
  contactEmail: dto.contactEmail ?? undefined,
  whatsAppNumber: dto.whatsAppNumber ?? undefined,
  verified: dto.verified ?? undefined,
  broker: dto.broker
    ? {
        id: dto.broker.id ?? undefined,
        name: dto.broker.name ?? undefined,
        phone: dto.broker.phone ?? undefined,
        email: dto.broker.email ?? undefined,
        type: dto.broker.type ?? undefined,
      }
    : undefined,

  isFeatured: dto.isFeatured ?? undefined,
  featuredAt: dto.featuredAt ?? undefined,
  publishedAt: dto.publishedAt ?? undefined,
  postedAt: dto.postedAt ?? undefined,
  archivedAt: dto.archivedAt ?? undefined,
  createdAt: dto.createdAt ?? undefined,
  updatedAt: dto.updatedAt ?? undefined,

  seo: dto.seo
    ? {
        title: dto.seo.title ?? undefined,
        description: dto.seo.description ?? undefined,
        keywords: dto.seo.keywords ?? undefined,
      }
    : undefined,
  analytics: dto.analytics
    ? {
        views: dto.analytics.views ?? undefined,
        saves: dto.analytics.saves ?? undefined,
        inquiries: dto.analytics.inquiries ?? undefined,
      }
    : undefined,
});

export const mapListingDTOArray = (items: ListingDTOType[]): Listing[] =>
  items.map(mapListingDTO);

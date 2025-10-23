import type { AreaUnit, Listing } from "@/shared/types";

export type ListingFormValues = {
  title: string;
  slug?: string;
  externalId?: string | null;
  category?: string;
  transactionType?: string;
  status?: string;
  constructionStatus?: string;

  price: number;
  pricePerSqft?: number | null;
  description?: string;
  subtitle?: string | null;
  highlights?: string[] | null;
  ownership?: string | null;
  yearBuilt?: number | null;
  possessionDate?: string | null;
  maintenanceTerms?: string | null;

  carpetArea?: { value: number; unit: AreaUnit } | number;
  builtUpArea?: { value: number; unit: AreaUnit } | number;
  superBuiltUpArea?: { value: number; unit: AreaUnit } | number;
  landArea?: { value: number; unit: AreaUnit } | number;

  plotLengthFt?: number;
  plotWidthFt?: number;
  frontageFt?: number;
  roadWidthFt?: number;
  plotFacing?: Listing["plotFacing"] | string | null;
  cornerPlot?: boolean | null;

  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  furnishing?: string | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  hasLift?: boolean | null;
  coveredParkingCount?: number | null;
  openParkingCount?: number | null;
  vaastuCompliant?: boolean | null;
  unitFacing?: Listing["unitFacing"] | string | null;

  priceBreakup?: {
    basePrice?: number | null;
    maintenanceMonthly?: number | null;
    parkingCharges?: number | null;
    clubMembershipCharges?: number | null;
    registrationCharges?: number | null;
    gstPercent?: number | null;
    negotiable?: boolean | null;
    allInclusive?: boolean | null;
    bookingAmount?: number | null;
  };

  address?: string | null;
  addressParts?: {
    line1?: string | null;
    line2?: string | null;
    locality?: string | null;
    landmark?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  };

  geo?: { lat: number; lng: number } | null;

  societyName?: string | null;
  projectName?: string | null;
  reraId?: string | null;
  reraRegistered?: boolean | null;
  amenities?: string[] | null;
  tags?: string[] | null;

  images?:
    | {
        id?: string;
        url?: string;
        alt?: string | null;
        isPrimary?: boolean | null;
        file?: File;
      }[]
    | null;
  videoUrls?: string[] | null;
  virtualTourUrl?: string | null;
  documents?: { label: string; url: string }[] | null;

  listedByType?: "Owner" | "Broker" | "Builder" | "Agency" | null;
  listedByName?: string | null;
  contactNumber?: string | null;
  contactEmail?: string | null;
  whatsAppNumber?: string | null;
  verified?: boolean | null;
  broker?: {
    id?: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    type?: "Owner" | "Broker" | "Builder" | "Agency" | null;
  } | null;

  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[] | null;
  } | null;

  isFeatured?: boolean | null;
};

export const LISTING_FORM_AREA_UNITS: AreaUnit[] = [
  "sqft",
  "sqyd",
  "sqm",
  "acre",
  "hectare",
  "decimal",
  "biswa",
  "guntha",
];

export const createListingFormState = (
  initial?: Partial<ListingFormValues>,
): ListingFormValues => {
  const state: ListingFormValues = {
    title: "",
    price: 0,
    pricePerSqft: null,
    category: "",
    transactionType: "",
    status: "",
    constructionStatus: "",
    description: "",
    subtitle: "",
    highlights: [],
    externalId: "",
    ownership: "",
    yearBuilt: null,
    possessionDate: undefined,
    maintenanceTerms: "",

    carpetArea: undefined,
    builtUpArea: undefined,
    superBuiltUpArea: undefined,
    landArea: undefined,

    plotLengthFt: undefined,
    plotWidthFt: undefined,
    frontageFt: undefined,
    roadWidthFt: undefined,
    plotFacing: "",
    cornerPlot: null,

    bedrooms: null,
    bathrooms: null,
    balconies: null,
    furnishing: "",
    floorNumber: null,
    totalFloors: null,
    hasLift: null,
    coveredParkingCount: null,
    openParkingCount: null,
    vaastuCompliant: null,
    unitFacing: "",

    priceBreakup: {},

    address: "",
    addressParts: {
      line1: "",
      line2: "",
      locality: "",
      landmark: "",
      city: "Puri",
      state: "",
      pincode: "",
    },

    geo: null,

    societyName: "",
    projectName: "",
    reraId: "",
    reraRegistered: null,
    amenities: [],
    tags: [],

    images: [],
    videoUrls: [],
    virtualTourUrl: "",
    documents: [],

    listedByType: null,
    listedByName: "",
    contactNumber: "",
    contactEmail: "",
    whatsAppNumber: "",
    verified: null,
    broker: {
      id: "",
      name: "",
      phone: "",
      email: "",
      type: null,
    },

    seo: {
      title: "",
      description: "",
      keywords: [],
    },

    isFeatured: null,

    ...initial,
  };

  state.addressParts = {
    line1: "",
    line2: "",
    locality: "",
    landmark: "",
    city: "Puri",
    state: "",
    pincode: "",
    ...(initial?.addressParts ?? {}),
  };

  state.priceBreakup = {
    ...(initial?.priceBreakup ?? {}),
  };

  state.seo =
    initial?.seo === null
      ? null
      : {
          title: initial?.seo?.title ?? "",
          description: initial?.seo?.description ?? "",
          keywords:
            initial?.seo?.keywords === null
              ? null
              : initial?.seo?.keywords
                ? [...initial.seo.keywords]
                : [],
        };

  state.broker =
    initial?.broker === null
      ? null
      : {
          id: initial?.broker?.id ?? "",
          name: initial?.broker?.name ?? "",
          phone: initial?.broker?.phone ?? "",
          email: initial?.broker?.email ?? "",
          type: initial?.broker?.type ?? null,
        };

  state.images =
    initial?.images === null ? null : initial?.images ? [...initial.images] : [];
  state.videoUrls =
    initial?.videoUrls === null ? null : initial?.videoUrls ? [...initial.videoUrls] : [];
  state.documents =
    initial?.documents === null ? null : initial?.documents ? [...initial.documents] : [];

  state.amenities = initial?.amenities === null ? null : initial?.amenities ? [...initial.amenities] : [];
  state.tags = initial?.tags === null ? null : initial?.tags ? [...initial.tags] : [];
  state.highlights = initial?.highlights === null ? null : initial?.highlights ? [...initial.highlights] : [];

  return state;
};

export type ListingCategory =
  | "Plot"
  | "Farm Land"
  | "Independent House"
  | "Flat (Housing Complex)"
  | "Flat (Society)"
  | "Villa"
  | "Row House"
  | "Commercial Space"
  | "Shop"
  | "Office"
  | "Other";

export type TransactionType = "sale" | "rent";
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  sale: "For Sale",
  rent: "For Rent",
};

export type ListingStatus =
  | "draft"
  | "available"
  | "reserved"
  | "under_offer"
  | "booked"
  | "sold"
  | "rented"
  | "inactive";
export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  draft: "Draft",
  available: "Available",
  reserved: "Reserved",
  under_offer: "Under Offer",
  booked: "Booked",
  sold: "Sold",
  rented: "Rented",
  inactive: "Inactive",
};

export type ConstructionStatus = "under_construction" | "ready_to_move" | "new_launch";
export const CONSTRUCTION_STATUS_LABELS: Record<ConstructionStatus, string> = {
  under_construction: "Under Construction",
  ready_to_move: "Ready to Move",
  new_launch: "New Launch",
};

export type Furnishing = "unfurnished" | "semi" | "fully";
export const FURNISHING_LABELS: Record<Furnishing, string> = {
  unfurnished: "Unfurnished",
  semi: "Semi Furnished",
  fully: "Fully Furnished",
};

export type DirectionFacing =
  | "North"
  | "North-East"
  | "East"
  | "South-East"
  | "South"
  | "South-West"
  | "West"
  | "North-West";

export type OwnershipType =
  | "Freehold"
  | "Leasehold"
  | "Power of Attorney"
  | "Co-operative Society"
  | "Government Lease"
  | "Other";

export type AreaUnit =
  | "sqft"
  | "sqyd"
  | "sqm"
  | "acre"
  | "hectare"
  | "decimal"
  | "biswa"
  | "guntha";

export type Area = {
  value: number;
  unit: AreaUnit;
};

export type Amenity =
  | "Power Backup"
  | "Lift"
  | "Security"
  | "CCTV"
  | "Gated Community"
  | "Water Supply"
  | "Park"
  | "Gym"
  | "Swimming Pool"
  | "Clubhouse"
  | "Play Area"
  | "Intercom"
  | "Gas Pipeline"
  | "Rainwater Harvesting"
  | "Visitor Parking"
  | "Fire Safety"
  | "Waste Disposal"
  | "Wi-Fi";

export type ListingBadge = "Verified" | "New" | "RERA" | "Hot" | (string & {});

export type Price = {
  amount: number;
  negotiable?: boolean;
};

export type Location = {
  locality: string;
  city?: string | null;
  address?: string | null;
};

export type PriceBreakup = {
  basePrice?: number;
  maintenanceMonthly?: number;
  parkingCharges?: number;
  clubMembershipCharges?: number;
  registrationCharges?: number;
  gstPercent?: number;
  negotiable?: boolean;
  allInclusive?: boolean;
  bookingAmount?: number;
};

export type MediaKind = "image" | "video" | "floor_plan" | "document";

export type Media = {
  id?: string;
  url: string;
  kind?: MediaKind | null;
  order?: number | null;
  alt?: string | null;
  isPrimary?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};

export type DocumentRef = {
  id?: string;
  label: string;
  url: string;
  kind?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactType = "Owner" | "Broker" | "Builder" | "Agency";

export type AddressParts = {
  line1?: string | null;
  line2?: string | null;
  locality?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
};

export type GeoLocation = {
  lat: number;
  lng: number;
  accuracyMeters?: number;
};

export type ListingBroker = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  type?: ContactType | null;
};

export type ListingSEO = {
  title?: string | null;
  description?: string | null;
  keywords?: string[];
};

export type ListingAnalytics = {
  views?: number;
  saves?: number;
  inquiries?: number;
};

export type Listing = {
  id: string;
  slug?: string;
  externalId?: string | null;

  // Meta
  category: ListingCategory;
  transactionType: TransactionType;
  status: ListingStatus;
  constructionStatus?: ConstructionStatus | null;

  // Basic details
  title: string;
  subtitle?: string | null;
  description?: string | null;
  highlights?: string[] | null;
  ownership?: OwnershipType | string | null;
  yearBuilt?: number;
  possessionDate?: string | null;

  // Areas
  carpetArea?: Area;
  builtUpArea?: Area;
  superBuiltUpArea?: Area;
  landArea?: Area;

  // Plot geometry
  plotLengthFt?: number;
  plotWidthFt?: number;
  frontageFt?: number;
  roadWidthFt?: number;
  plotFacing?: DirectionFacing | null;
  cornerPlot?: boolean | null;

  // Unit specs
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  furnishing?: Furnishing | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  hasLift?: boolean | null;
  coveredParkingCount?: number | null;
  openParkingCount?: number | null;
  vaastuCompliant?: boolean | null;
  unitFacing?: DirectionFacing | null;

  // Pricing
  price: number;
  pricePerSqft?: number | null;
  priceBreakup?: PriceBreakup;
  maintenanceTerms?: string | null;

  // Location & address
  address?: string | null;
  addressParts?: AddressParts;
  geo?: GeoLocation;

  // Project / society
  societyName?: string | null;
  projectName?: string | null;
  reraId?: string | null;
  reraRegistered?: boolean | null;
  amenities?: Amenity[] | string[] | null;
  tags?: string[] | null;

  // Media & docs
  images: Media[];
  videoUrls?: string[] | null;
  virtualTourUrl?: string | null;
  documents?: DocumentRef[] | null;

  // Contact & attribution
  listedByType?: ContactType | null;
  listedByName?: string | null;
  contactNumber?: string | null;
  contactEmail?: string | null;
  whatsAppNumber?: string | null;
  verified?: boolean | null;
  broker?: ListingBroker | null;

  // Flags & operations
  isFeatured?: boolean | null;
  featuredAt?: string | null;
  publishedAt?: string | null;
  postedAt?: string | undefined;
  archivedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  seo?: ListingSEO | null;
  analytics?: ListingAnalytics | null;
};

export const formatTransactionType = (value?: TransactionType | null) =>
  value ? (TRANSACTION_TYPE_LABELS[value] ?? titleize(value)) : undefined;

export const formatListingStatus = (value?: ListingStatus | null) =>
  value ? (LISTING_STATUS_LABELS[value] ?? titleize(value)) : undefined;

export const formatConstructionStatus = (value?: ConstructionStatus | null) =>
  value ? (CONSTRUCTION_STATUS_LABELS[value] ?? titleize(value)) : undefined;

export const formatFurnishing = (value?: Furnishing | null) =>
  value ? (FURNISHING_LABELS[value] ?? titleize(value)) : undefined;

export const formatDirectionFacing = (value?: DirectionFacing | null) => value ?? undefined;

export const formatCategory = (value?: ListingCategory | null) => value ?? undefined;

const titleize = (input: string) =>
  input
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

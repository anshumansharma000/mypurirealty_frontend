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

export type TransactionType = "For Sale" | "For Rent";

// Availability/status of the listing itself (not construction progress)
export type ListingStatus =
  | "Available"
  | "Reserved"
  | "Under Offer"
  | "Booked"
  | "Sold"
  | "Rented"
  | "Inactive";

// Construction/progress state of the property
export type ConstructionStatus =
  | "Ready to Move"
  | "Under Construction"
  | "Under Renovation"
  | "Possession Soon";

export type Furnishing = "Unfurnished" | "Semi-Furnished" | "Furnished";

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
  value: number; // raw numeric value
  unit: AreaUnit; // how to interpret the value
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

export type PriceBreakup = {
  basePrice?: number; // base/property price
  maintenanceMonthly?: number; // society/complex charges
  parkingCharges?: number;
  clubMembershipCharges?: number;
  registrationCharges?: number;
  gstPercent?: number; // if applicable
  negotiable?: boolean;
  allInclusive?: boolean; // when true, basePrice presumed inclusive of add-ons
  bookingAmount?: number;
};

export type Media = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
};

export type DocumentRef = {
  label: string; // e.g., "RERA Certificate", "Title Deed"
  url: string;
};

export type ContactType = "Owner" | "Broker" | "Builder" | "Agency";

export type AddressParts = {
  line1?: string;
  line2?: string;
  locality?: string; // e.g., Sea Beach Road
  landmark?: string;
  city?: string; // default Puri
  state?: string; // default Odisha
  pincode?: string;
};

export type GeoLocation = {
  lat: number;
  lng: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Listing entity (single shape that covers all categories)
// ─────────────────────────────────────────────────────────────────────────────
export type Listing = {
  id: string;
  slug?: string; // for SEO-friendly routes

  // Meta
  category: ListingCategory;
  transactionType: TransactionType; // For Sale / For Rent (we'll use For Sale initially)
  status: ListingStatus; // availability of this listing
  constructionStatus?: ConstructionStatus; // property readiness

  // Basic details
  title: string; // e.g., "3BHK Sea-Facing Apartment"
  description?: string;
  ownership?: OwnershipType;
  yearBuilt?: number;
  possessionDate?: string; // ISO date if future possession

  // Areas (choose applicable for category)
  carpetArea?: Area; // usually for livable units
  builtUpArea?: Area; // optional
  superBuiltUpArea?: Area; // optional
  landArea?: Area; // plots/farm land/independent house sites

  // Additional plot/land geometry
  plotLengthFt?: number;
  plotWidthFt?: number;
  frontageFt?: number;
  roadWidthFt?: number;
  plotFacing?: DirectionFacing;
  cornerPlot?: boolean;

  // Unit specs (for flats/houses/villas)
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnishing?: Furnishing;
  floorNumber?: number; // for flats
  totalFloors?: number; // for buildings
  hasLift?: boolean;
  coveredParkingCount?: number;
  openParkingCount?: number;
  vaastuCompliant?: boolean;
  unitFacing?: DirectionFacing;

  // Price & commercial
  price: number; // in INR (base price if allInclusive=false)
  priceBreakup?: PriceBreakup;

  // Location & address
  address: string; // full address fallback
  addressParts?: AddressParts;
  geo?: GeoLocation; // map pin

  // Community/Project
  societyName?: string; // for society/complex
  reraId?: string;
  reraRegistered?: boolean;
  amenities?: Amenity[];

  // Media & docs
  images: Media[]; // first primary used as cover
  videoUrls?: string[];
  virtualTourUrl?: string;
  documents?: DocumentRef[];

  // Contact & attribution
  listedByType?: ContactType; // Owner/Broker/Builder/Agency
  listedByName?: string;
  contactNumber?: string;
  verified?: boolean; // internal verification status

  // Operational
  isFeatured?: boolean;
  tags?: string[]; // e.g., ["Sea-facing", "New Launch"]
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
  postedAt?: string; // ISO (displayed as time-ago)
};
export type ListingBadge = "New" | "Hot" | "RERA" | "Verified";

export type Price = {
  amount: number;
  currency?: "INR";
  maintenance?: number;
  negotiable?: boolean;
};

export type Location = {
  address?: string;
  locality: string;
  city: string; // "Puri"
};

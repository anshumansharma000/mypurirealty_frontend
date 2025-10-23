export type ListingSelectOption = {
  value: string;
  label: string;
};

export const LISTING_CATEGORY_OPTIONS: readonly ListingSelectOption[] = [
  { value: "Plot", label: "Plot" },
  { value: "Farm Land", label: "Farm Land" },
  { value: "Independent House", label: "Independent House" },
  { value: "Flat (Housing Complex)", label: "Flat (Housing Complex)" },
  { value: "Flat (Society)", label: "Flat (Society)" },
  { value: "Villa", label: "Villa" },
  { value: "Row House", label: "Row House" },
  { value: "Commercial Space", label: "Commercial Space" },
  { value: "Shop", label: "Shop" },
  { value: "Office", label: "Office" },
  { value: "Other", label: "Other" },
];

export const LISTING_TRANSACTION_TYPE_OPTIONS: readonly ListingSelectOption[] = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
];

export const LISTING_STATUS_OPTIONS: readonly ListingSelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "under_offer", label: "Under Offer" },
  { value: "booked", label: "Booked" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "inactive", label: "Inactive" },
];

export const LISTING_CONSTRUCTION_STATUS_OPTIONS: readonly ListingSelectOption[] = [
  { value: "under_construction", label: "Under Construction" },
  { value: "ready_to_move", label: "Ready to Move" },
  { value: "new_launch", label: "New Launch" },
];

export const LISTING_FURNISHING_OPTIONS: readonly ListingSelectOption[] = [
  { value: "fully", label: "Fully Furnished" },
  { value: "semi", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

export const LISTING_DIRECTION_OPTIONS: readonly ListingSelectOption[] = [
  { value: "North", label: "North" },
  { value: "North-East", label: "North-East" },
  { value: "East", label: "East" },
  { value: "South-East", label: "South-East" },
  { value: "South", label: "South" },
  { value: "South-West", label: "South-West" },
  { value: "West", label: "West" },
  { value: "North-West", label: "North-West" },
];

export const LISTING_CONTACT_TYPE_OPTIONS: readonly ListingSelectOption[] = [
  { value: "Owner", label: "Owner" },
  { value: "Broker", label: "Broker" },
  { value: "Builder", label: "Builder" },
  { value: "Agency", label: "Agency" },
];

export const LAND_ONLY_CATEGORY_VALUES = ["Plot", "Farm Land"] as const;
export const HYBRID_PLOT_CATEGORY_VALUES = ["Independent House", "Villa", "Row House"] as const;
export const RESIDENTIAL_UNIT_CATEGORY_VALUES = [
  "Independent House",
  "Flat (Housing Complex)",
  "Flat (Society)",
  "Villa",
  "Row House",
] as const;
export const COMMERCIAL_CATEGORY_VALUES = ["Commercial Space", "Shop", "Office", "Other"] as const;

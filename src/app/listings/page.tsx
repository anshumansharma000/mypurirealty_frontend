// app/listings/page.tsx
import Filters from "@/components/listings/Filters";
import ListingsGrid from "@/components/listings/ListingGrid";
import ListingsToolbar from "@/components/listings/Toolbar";
import Pagination from "@/components/ui/Pagination";
import type { Listing } from "@/lib/types";
import QueryProvider from "@/shared/query/client";
import React from "react";

// NOTE: Replace this with real fetching later (DB/API).
async function fetchListings(): Promise<Listing[]> {
  // Minimal mock data so the page renders. Keep it tiny.
  return [
    {
      id: "puri-flat-001",
      slug: "sea-facing-3bhk-puri",
      category: "Flat (Society)",
      transactionType: "For Sale",
      status: "Available",
      title: "Sea-Facing 3BHK near Beach Road",
      description: "Bright 3BHK with balcony and partial sea view.",
      ownership: "Freehold",
      carpetArea: { value: 1200, unit: "sqft" },
      builtUpArea: { value: 1400, unit: "sqft" },
      bedrooms: 3,
      bathrooms: 2,
      furnishing: "Semi-Furnished",
      floorNumber: 5,
      totalFloors: 10,
      hasLift: true,
      unitFacing: "East",
      price: 9500000,
      priceBreakup: { allInclusive: false, parkingCharges: 250000 },
      address: "Sea Beach Road, Puri, Odisha",
      addressParts: {
        locality: "Sea Beach Road",
        city: "Puri",
        state: "Odisha",
        pincode: "752001",
      },
      societyName: "Blue Dunes Residency",
      amenities: ["Lift", "Security", "CCTV", "Gated Community", "Power Backup", "Visitor Parking"],
      images: [{ url: "/images/sample-flat-1.jpg", alt: "Living room", isPrimary: true }],
      isFeatured: true,
      postedAt: new Date().toISOString(),
    },
    {
      id: "puri-plot-101",
      category: "Plot",
      transactionType: "For Sale",
      status: "Available",
      title: "Corner Residential Plot near Baliapanda",
      landArea: { value: 2400, unit: "sqft" },
      plotLengthFt: 60,
      plotWidthFt: 40,
      plotFacing: "North-East",
      cornerPlot: true,
      price: 4200000,
      address: "Baliapanda, Puri, Odisha",
      addressParts: { locality: "Baliapanda", city: "Puri", state: "Odisha", pincode: "752001" },
      images: [{ url: "/images/sample-plot-1.jpg", alt: "Open plot", isPrimary: true }],
      postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "puri-house-207",
      category: "Independent House",
      transactionType: "For Sale",
      status: "Under Offer",
      title: "2-Storey Independent House near Chakratirtha Road",
      builtUpArea: { value: 2100, unit: "sqft" },
      landArea: { value: 1500, unit: "sqft" },
      bedrooms: 4,
      bathrooms: 3,
      furnishing: "Unfurnished",
      price: 12500000,
      address: "CT Road, Puri, Odisha",
      addressParts: { locality: "Chakratirtha Road", city: "Puri", state: "Odisha" },
      images: [{ url: "/images/sample-house-1.jpg", alt: "Façade", isPrimary: true }],
      postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ];
}

export default async function ListingsPage() {
  const listings = await fetchListings();

  const defaultFilters = { categories: [] as any[] };

  return (
    <QueryProvider>
      <main className="container mx-auto  px-4 py-6 mt-16">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Properties in Puri</h1>
          <ListingsToolbar total={listings.length} disabled />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr]">
          {/* Sidebar filters */}
          <Filters value={defaultFilters} />

          {/* Results */}
          <div className="flex flex-col gap-4">
            <ListingsGrid data={listings} />
            <div className="mt-2 flex items-center justify-center">
              <Pagination currentPage={1} totalPages={3} />
            </div>
          </div>
        </div>
      </main>
    </QueryProvider>
  );
}

"use client";

import Modal from "@/components/common/Modal";
import InterestForm from "@/components/listings/detail/InterestForm";
import ListingDescription from "@/components/listings/detail/ListingDescription";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import ListingOverviewSection from "@/components/listings/detail/ListingOverviewSection";
import ListingPriceAndCharges from "@/components/listings/detail/ListingPriceAndCharges";
import ListingSidebar from "@/components/listings/detail/ListingSidebar";
import MediaViewer, { Media } from "@/components/listings/detail/MediaViewer";
import SimilarListings from "@/components/listings/detail/SimilarListings";
import { useListing } from "@/features/listings/hooks/useListing";
import { formatArea, formatINRCompact } from "@/lib/format";
import type { Listing } from "@/shared/types";
import { Armchair, Bath, BedDouble, Car } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ListingDetailPage() {
  // support both /listings/[id] and /listings/[slug] while you migrate
  const params = useParams<{ slug: string }>(); // slug is for display only
  const sp = useSearchParams();
  const id = sp.get("id") ?? undefined; // <-- fetch by id

  const { data: listing, isLoading, isError } = useListing(id);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  const media: Media[] = useMemo(() => {
    if (!listing) return [];
    const imgs = (listing.images ?? []).map((img, i) => ({
      id: `i${i}`,
      type: "image" as const,
      src: img.url,
      thumb: img.url,
    }));
    const vids = (listing.videoUrls ?? []).map((u, i) => ({
      id: `v${i}`,
      type: "video" as const,
      src: u,
      thumb: listing.images?.[0]?.url ?? undefined,
    }));
    return [...vids, ...imgs];
  }, [listing]);

  const handleContact = () => setInterestOpen(true);
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setInterestOpen(false);
    alert("Your interest has been submitted!");
  };

  if (isLoading) {
    return (
      <main className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-6 mt-16">
        <div className="animate-pulse h-8 w-56 rounded bg-neutral-200 mb-4" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)]">
          <div className="space-y-6">
            <div className="h-[420px] rounded-2xl bg-neutral-100" />
            <div className="h-40 rounded-2xl bg-neutral-100" />
            <div className="h-40 rounded-2xl bg-neutral-100" />
          </div>
          <div className="h-[420px] rounded-2xl bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (isError || !listing) {
    return (
      <main className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-6 mt-16">
        <div className="rounded-2xl border p-6 text-red-600">Listing not found.</div>
      </main>
    );
  }

  // ---- UI mappers (keep visuals identical) ----
  const priceAmount = listing.price ?? 0;
  const negotiable = listing.priceBreakup?.negotiable ?? false;

  const location = {
    locality: listing.addressParts?.locality ?? listing.societyName ?? "Puri",
    city: listing.addressParts?.city ?? "Puri",
  };

  const badges: string[] = [
    listing.verified ? "Verified" : "",
    listing.isFeatured ? "New" : "",
    listing.reraRegistered ? "RERA" : "",
  ].filter(Boolean);

  const headlineFacts = [
    listing.bedrooms ? { icon: BedDouble, label: `${listing.bedrooms} Beds` } : undefined,
    listing.bathrooms ? { icon: Bath, label: `${listing.bathrooms} Baths` } : undefined,
    (listing.coveredParkingCount ?? listing.openParkingCount)
      ? {
          icon: Car,
          label: `${(listing.coveredParkingCount ?? 0) + (listing.openParkingCount ?? 0)} Parking`,
        }
      : undefined,
    listing.furnishing ? { icon: Armchair, label: listing.furnishing } : undefined,
  ].filter(Boolean) as { icon: any; label: string }[];

  const areaLabel = (() => {
    const { carpetArea, builtUpArea, superBuiltUpArea, landArea } = listing;
    if (carpetArea) return `Carpet: ${formatArea(carpetArea)}`;
    if (builtUpArea) return `Built-up: ${formatArea(builtUpArea)}`;
    if (superBuiltUpArea) return `Super: ${formatArea(superBuiltUpArea)}`;
    if (landArea) return `Land: ${formatArea(landArea)}`;
    return undefined;
  })();

  const pricePerSqft = listing.carpetArea?.value
    ? Math.round(priceAmount / listing.carpetArea.value)
    : listing.builtUpArea?.value
      ? Math.round(priceAmount / listing.builtUpArea.value)
      : undefined;

  const primaryFacts = [
    areaLabel ? { label: "Area", value: areaLabel, highlight: true } : undefined,
    pricePerSqft
      ? { label: "Price / sqft", value: `₹${pricePerSqft.toLocaleString("en-IN")}` }
      : undefined,
    listing.listedByName ? { label: "Seller", value: listing.listedByName } : undefined,
    listing.societyName ? { label: "Project", value: listing.societyName } : undefined,
  ].filter(Boolean) as { label: string; value: string; highlight?: boolean }[];

  const secondaryFacts = [
    listing.transactionType
      ? { label: "Transaction Type", value: listing.transactionType }
      : undefined,
    listing.status ? { label: "Status", value: listing.status } : undefined,
    typeof listing.hasLift === "boolean"
      ? { label: "Lifts", value: listing.hasLift ? "Yes" : "—" }
      : undefined,
    listing.furnishing ? { label: "Furnished Status", value: listing.furnishing } : undefined,
  ].filter(Boolean) as { label: string; value: string }[];

  const otherCharges = [
    listing.priceBreakup?.maintenanceMonthly != null
      ? {
          label: "Maintenance",
          value: `₹${listing.priceBreakup.maintenanceMonthly.toLocaleString("en-IN")}/mo`,
        }
      : undefined,
    listing.priceBreakup?.parkingCharges != null
      ? {
          label: "Parking",
          value: `₹${listing.priceBreakup.parkingCharges.toLocaleString("en-IN")}`,
        }
      : undefined,
    listing.priceBreakup?.clubMembershipCharges != null
      ? {
          label: "Club Membership",
          value: `₹${listing.priceBreakup.clubMembershipCharges.toLocaleString("en-IN")}`,
        }
      : undefined,
    listing.priceBreakup?.registrationCharges != null
      ? { label: "Registration", value: "As per govt norms" }
      : undefined,
  ].filter(Boolean) as { label: string; value: string }[];

  const descriptionText =
    listing.description ??
    "Description not provided. Contact the seller for more details about this property.";

  const seller = {
    name: listing.listedByName ?? "Seller",
    experience: undefined,
    firm: listing.listedByType ?? undefined,
    verified: !!listing.verified,
    contactNumber: listing.contactNumber ?? "",
  };

  const mapEmbedUrl = (() => {
    const lat = listing.geo?.lat;
    const lng = listing.geo?.lng;
    if (!lat || !lng) return undefined;
    const q = encodeURIComponent(`${lat},${lng}`);
    return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  })();

  return (
    <main className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-6 mt-16">
      <ListingHeader
        listingId={listing.id}
        title={listing.title}
        price={{ amount: priceAmount, negotiable }}
        location={location}
        badges={badges as any}
        className="mb-4"
      />

      {/* two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)]">
        {/* LEFT MAIN CONTENT */}
        <div className="space-y-6">
          <ListingOverviewSection
            media={media}
            headlineFacts={headlineFacts}
            primaryFacts={primaryFacts}
            secondaryFacts={secondaryFacts}
            onOpenMedia={() => setMediaOpen(true)}
          />

          <ListingDescription text={descriptionText} highlights={listing.tags ?? []} />

          <ListingPriceAndCharges
            totalPrice={formatINRCompact(priceAmount)}
            negotiable={negotiable}
            pricePerSqft={pricePerSqft ? `₹${pricePerSqft.toLocaleString("en-IN")}` : undefined}
            basePrice={
              listing.priceBreakup?.basePrice != null
                ? `₹${listing.priceBreakup.basePrice.toLocaleString("en-IN")}`
                : undefined
            }
            otherCharges={otherCharges}
            note="All charges are indicative and subject to change. Please verify before finalizing."
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <ListingSidebar mapEmbedUrl={mapEmbedUrl} seller={seller} onContact={handleContact} />
      </div>

      <Modal open={interestOpen} onClose={() => setInterestOpen(false)} title="Express Interest">
        <InterestForm onSubmit={handleFormSubmit} />
      </Modal>

      {/* Keep your static similar list for now; we’ll wire API next */}
      {/* <SimilarListings
        listings={[
          {
            id: "1",
            title: "3 BHK Apartment near Chakratirth Road",
            location: "Puri",
            price: "₹1.45 Cr",
            image: "https://picsum.photos/id/1051/400/300",
            slug: "3bhk-chakratirth-puri",
            badge: "Verified",
          },
          {
            id: "2",
            title: "2 BHK Flat near VIP Road",
            location: "Puri",
            price: "₹95 Lakh",
            image: "https://picsum.photos/id/1053/400/300",
            slug: "2bhk-viproad-puri",
            badge: "New",
          },
          {
            id: "3",
            title: "Residential Plot near Baliapanda Beach",
            location: "Puri",
            price: "₹78 Lakh",
            image: "https://picsum.photos/id/1056/400/300",
            slug: "plot-baliapanda-puri",
          },
          {
            id: "4",
            title: "2 BHK Apartment at Lighthouse Road",
            location: "Puri",
            price: "₹1.02 Cr",
            image: "https://picsum.photos/id/1054/400/300",
            slug: "2bhk-lighthouse-puri",
          },
        ]}
        className="mt-6"
      /> */}
      <SimilarListings listingId={listing.id} title="Similar Listings" limit={4} className="mt-6" />

      <MediaViewer media={media} isOpen={mediaOpen} onClose={() => setMediaOpen(false)} />
    </main>
  );
}

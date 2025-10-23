"use client";

import Modal from "@/components/common/Modal";
import InterestForm, { type InterestFormValues } from "@/components/listings/detail/InterestForm";
import ListingDescription from "@/components/listings/detail/ListingDescription";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import ListingOverviewSection from "@/components/listings/detail/ListingOverviewSection";
import ListingPriceAndCharges from "@/components/listings/detail/ListingPriceAndCharges";
import ListingSidebar from "@/components/listings/detail/ListingSidebar";
import MediaViewer, { Media } from "@/components/listings/detail/MediaViewer";
import SimilarListings from "@/components/listings/detail/SimilarListings";
import { useCreateInterest } from "@/features/interest/hooks/useCreateInterest";
import { resolveInterestSubmitError } from "@/features/interest/utils/errors";
import { useListing } from "@/features/listings/hooks/useListing";
import { formatArea, formatINRCompact } from "@/lib/format";
import type { ListingBadge } from "@/shared/types";
import {
  formatFurnishing,
  formatListingStatus,
  formatTransactionType,
} from "@/shared/types";
import { useToast } from "@/shared/ui/toast";
import { Armchair, Bath, BedDouble, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type HeadlineFact = { icon: LucideIcon; label: string };

export default function ListingDetailPage() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? undefined; // <-- fetch by id

  const { data: listing, isLoading, isError } = useListing(id);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [interestError, setInterestError] = useState<string | null>(null);
  const { showToast } = useToast();

  const effectiveListingId = listing?.id ?? id ?? undefined;
  const { mutateAsync: submitInterest, isPending: submittingInterest } = useCreateInterest(
    effectiveListingId,
  );

  useEffect(() => {
    if (!interestOpen) {
      setInterestError(null);
    }
  }, [interestOpen]);

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

  const handleContact = () => {
    setInterestError(null);
    setInterestOpen(true);
  };

  const handleFormSubmit = async (form: InterestFormValues) => {
    if (!effectiveListingId) {
      setInterestError("Missing listing reference; please refresh and try again.");
      return;
    }

    setInterestError(null);

    const payload = {
      name: form.name,
      phone: form.phone,
      ...(form.email ? { email: form.email } : {}),
      ...(form.message ? { message: form.message } : {}),
    };

    try {
      await submitInterest(payload);
      showToast({
        message: "Thanks! We’ve recorded your interest and will reach out shortly.",
        type: "success",
      });
      setInterestOpen(false);
    } catch (err) {
      const message = resolveInterestSubmitError(err);
      setInterestError(message);
    }
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

  const badges: ListingBadge[] = [
    listing.verified ? "Verified" : undefined,
    listing.isFeatured ? "New" : undefined,
    listing.reraRegistered ? "RERA" : undefined,
  ].filter((badge): badge is ListingBadge => Boolean(badge));

  const furnishingLabel = formatFurnishing(listing.furnishing) ?? listing.furnishing ?? undefined;
  const headlineFacts: HeadlineFact[] = [
    listing.bedrooms ? { icon: BedDouble, label: `${listing.bedrooms} Beds` } : undefined,
    listing.bathrooms ? { icon: Bath, label: `${listing.bathrooms} Baths` } : undefined,
    (listing.coveredParkingCount ?? listing.openParkingCount)
      ? {
          icon: Car,
          label: `${(listing.coveredParkingCount ?? 0) + (listing.openParkingCount ?? 0)} Parking`,
        }
      : undefined,
    furnishingLabel ? { icon: Armchair, label: furnishingLabel } : undefined,
  ].filter((fact): fact is HeadlineFact => Boolean(fact));

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
      ? {
          label: "Transaction Type",
          value: formatTransactionType(listing.transactionType) ?? listing.transactionType,
        }
      : undefined,
    listing.status
      ? { label: "Status", value: formatListingStatus(listing.status) ?? listing.status }
      : undefined,
    typeof listing.hasLift === "boolean"
      ? { label: "Lifts", value: listing.hasLift ? "Yes" : "—" }
      : undefined,
    furnishingLabel ? { label: "Furnished Status", value: furnishingLabel } : undefined,
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
        badges={badges}
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
        <InterestForm
          onSubmit={handleFormSubmit}
          submitting={submittingInterest}
          error={interestError}
        />
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

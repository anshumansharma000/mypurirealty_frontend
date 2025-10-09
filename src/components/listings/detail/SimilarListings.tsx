// components/listings/SimilarListings.tsx
"use client";

import ListingCard, { ListingCardProps } from "../ListingCard";
import { useSimilar } from "@/features/listings/hooks/useSimilar";
import type { Listing } from "@/shared/types";
import { useMemo } from "react";

// components/listings/SimilarListings.tsx

type Props = {
  /** The current listing id to find similars for */
  listingId: string;
  /** Optional: how many cards to show */
  limit?: number;
  /** Optional: forwarded UI props (unchanged UI) */
  title?: string;
  className?: string;
};

export default function SimilarListings({
  listingId,
  limit = 8,
  title = "Similar Listings",
  className,
}: Props) {
  // 🔹 Fetch via our React Query hook (calls GET /listings/:id/similar under the hood)
  const { data, isLoading, isError } = useSimilar(listingId);

  // 🔹 Map domain Listing -> your ListingCardProps (adjust fields if your card needs more)
  const cards: ListingCardProps[] = useMemo(() => {
    const items = (data ?? []).slice(0, limit);
    return items.map((l: Listing) => {
      const img = l.images?.find((i) => i.isPrimary) ?? l.images?.[0];
      return {
        id: l.id,
        title: l.title,
        // tweak these to match your ListingCardProps exactly:
        image: img?.url ?? "/placeholder.png",
        price: `₹${l.price.toLocaleString("en-IN")}`,
        location: l.addressParts?.locality || l.addressParts?.city || "Puri",
        href: `/listings/${encodeURIComponent(l.id)}`, // link by id (your detail contract)
        slug: l.slug ?? l.id,
        badge: l.verified ? "Verified" : l.isFeatured ? "Featured" : undefined,
      } as ListingCardProps;
    });
  }, [data, limit]);

  // ─────────── UI (unchanged layout/markup) ───────────
  if (isLoading) {
    return (
      <section
        className={[
          "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
          className || "",
        ].join(" ")}
      >
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">{title}</h2>
        <div
          className="
            grid gap-4 
            grid-cols-1
            sm:grid-cols-2 
            md:grid-cols-3 
            xl:grid-cols-4
            overflow-x-auto 
            pb-2
            scrollbar-none
          "
        >
          {Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-lg border border-neutral-200 bg-neutral-50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || cards.length === 0) return null;

  return (
    <section
      className={[
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
        className || "",
      ].join(" ")}
    >
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">{title}</h2>

      <div
        className="
          grid gap-4 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-3 
          xl:grid-cols-4
          overflow-x-auto 
          pb-2
          scrollbar-none
        "
      >
        {cards.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}

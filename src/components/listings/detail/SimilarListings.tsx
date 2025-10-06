"use client";

import ListingCard, { ListingCardProps } from "../ListingCard";

type Props = {
  listings: ListingCardProps[];
  title?: string;
  className?: string;
};

export default function SimilarListings({
  listings,
  title = "Similar Listings",
  className,
}: Props) {
  if (!listings || listings.length === 0) return null;

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
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}

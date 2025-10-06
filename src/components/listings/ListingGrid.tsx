// components/listings/ListingsGrid.tsx
import ListingCardWide from "./ListingCardWide";
import ListingCardWideSkeleton from "./ListingCardWideSkeleton";
import type { Listing } from "@/lib/types";
import React from "react";

type Props = {
  data: Listing[] | undefined;
  loading?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
  emptyHint?: string;
};

export default function ListingsGrid({
  data,
  loading,
  onFavoriteToggle,
  className = "",
  emptyHint = "Try adjusting filters or broadening your search in Puri. New properties are added regularly.",
}: Props) {
  if (loading) {
    return (
      <div className={["flex flex-col gap-4", className].join(" ")}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ListingCardWideSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <div className="mb-2 text-base font-semibold text-neutral-900">No listings found</div>
        <p className="max-w-md text-sm text-neutral-600">{emptyHint}</p>
      </div>
    );
  }

  // One card per row, roomy & readable
  return (
    <div className={["flex flex-col gap-4", className].join(" ")}>
      {data.map((l) => (
        <ListingCardWide key={l.id} listing={l} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
}

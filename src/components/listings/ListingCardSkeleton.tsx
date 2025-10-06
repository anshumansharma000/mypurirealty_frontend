// components/listings/ListingCardSkeleton.tsx
import React from "react";

export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Cover image placeholder */}
      <div className="h-40 w-full bg-neutral-100" />

      {/* Content placeholders */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <div className="h-4 w-3/5 rounded bg-neutral-100" />
        {/* Price */}
        <div className="h-3 w-2/5 rounded bg-neutral-100" />

        {/* Quick specs pills */}
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 rounded-full bg-neutral-100" />
          <div className="h-6 w-14 rounded-full bg-neutral-100" />
          <div className="h-6 w-20 rounded-full bg-neutral-100" />
        </div>

        {/* Location line */}
        <div className="h-3 w-24 rounded bg-neutral-100" />
      </div>
    </div>
  );
}

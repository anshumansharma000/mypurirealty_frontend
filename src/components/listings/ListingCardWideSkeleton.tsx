// components/listings/ListingCardWideSkeleton.tsx
import React from "react";

export default function ListingCardWideSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col">
        {/* Top strip */}
        <div className="border-b border-neutral-100 bg-neutral-50/60 px-4 py-2">
          <div className="h-4 w-40 rounded bg-neutral-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr_220px]">
          {/* Image */}
          <div className="h-56 w-full bg-neutral-100 md:h-full" />

          {/* Middle */}
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/3 rounded bg-neutral-100" />
            <div className="h-6 w-3/4 rounded bg-neutral-100" />
            <div className="h-4 w-5/6 rounded bg-neutral-100" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <div className="h-4 w-24 rounded bg-neutral-100" />
              <div className="h-4 w-20 rounded bg-neutral-100" />
              <div className="h-4 w-24 rounded bg-neutral-100" />
              <div className="h-4 w-28 rounded bg-neutral-100" />
            </div>
            <div className="h-4 w-2/5 rounded bg-neutral-100" />
          </div>

          {/* Right */}
          <div className="flex flex-col justify-between border-t border-neutral-100 p-4 md:border-l md:border-t-0">
            <div className="ml-auto h-7 w-24 rounded bg-neutral-100" />
            <div className="mt-4 ml-auto flex gap-2">
              <div className="h-9 w-16 rounded-lg bg-neutral-100" />
              <div className="h-9 w-28 rounded-lg bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

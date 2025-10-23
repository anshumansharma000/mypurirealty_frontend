// components/listings/ListingCardWide.tsx
"use client";

import {
  compactFacing,
  estimateAllInclusivePrice,
  formatArea,
  formatINRCompact,
  timeAgo,
} from "@/lib/format";
import type { Listing, Media } from "@/lib/types";
import {
  formatFurnishing,
  formatListingStatus,
  formatTransactionType,
} from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// components/listings/ListingCardWide.tsx

// components/listings/ListingCardWide.tsx

// components/listings/ListingCardWide.tsx

const ACCENT = "#B68C2C";

export type ListingCardWideProps = {
  listing: Listing;
  href?: string;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
};

function primary(images: Media[] = []) {
  return images.find((m) => m.isPrimary) ?? images[0];
}

function areaDisplay(l: Listing) {
  if (l.carpetArea) return `Carpet: ${formatArea(l.carpetArea)}`;
  if (l.builtUpArea) return `Built-up: ${formatArea(l.builtUpArea)}`;
  if (l.superBuiltUpArea) return `Super: ${formatArea(l.superBuiltUpArea)}`;
  if (l.landArea) return `Land: ${formatArea(l.landArea)}`;
  return "Area: —";
}

function locationLine(l: Listing) {
  const a = l.addressParts;
  if (!a) return l.address || "Puri";
  return [a.locality, a.landmark, a.city || "Puri"].filter(Boolean).join(", ");
}

export default function ListingCardWide({
  listing,
  href,
  isFavorited = false,
  onFavoriteToggle,
  className = "",
}: ListingCardWideProps) {
  const slugPart = listing.slug ?? encodeURIComponent(listing.id);
  const linkHref = href ?? `/listings/${slugPart}?id=${encodeURIComponent(listing.id)}`;
  const cover = primary(listing.images);
  const allIn = estimateAllInclusivePrice(listing.price, listing.priceBreakup);
  const transactionLabel =
    formatTransactionType(listing.transactionType) ?? listing.transactionType;
  const statusLabel = formatListingStatus(listing.status) ?? listing.status;
  const furnishingLabel = formatFurnishing(listing.furnishing) ?? listing.furnishing ?? undefined;

  return (
    <article
      className={[
        "relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md",
        className,
      ].join(" ")}
    >
      <Link
        href={linkHref}
        className="absolute inset-0 z-10"
        aria-label={`View ${listing.title}`}
      />

      {/* Top strip: badges */}
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/60 px-4 py-2 text-xs text-neutral-700">
        {listing.isFeatured && (
          <span className="rounded-full border border-[#B68C2C]/30 bg-[#B68C2C]/10 px-2 py-0.5 font-medium text-[#8C6A1E]">
            Featured
          </span>
        )}
        <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-black/5">
          {transactionLabel}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-black/5">{statusLabel}</span>
        {listing.societyName && (
          <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-black/5">
            {listing.societyName}
          </span>
        )}
        <span className="ml-auto text-neutral-500">{timeAgo(listing.postedAt)}</span>
      </div>

      {/* Main row */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[320px_1fr_140px]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-neutral-100 md:aspect-auto md:h-full">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt || listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 320px, 320px"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}

          {/* Favorite */}
          {onFavoriteToggle && (
            <button
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-neutral-700 shadow-sm backdrop-blur hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.(listing.id);
              }}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isFavorited ? ACCENT : "none"}
                stroke={isFavorited ? ACCENT : "currentColor"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {/* Middle: content */}
        <div className="flex min-w-0 flex-col gap-2 p-4">
          <div className="text-[13px] text-neutral-600">
            {listing.category}
            {typeof listing.bedrooms === "number" ? ` · ${listing.bedrooms} BHK` : ""}
            {listing.unitFacing ? ` · ${compactFacing(listing.unitFacing)}-facing` : ""}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900">{listing.title}</h3>
          <div className="line-clamp-2 text-sm text-neutral-700">{listing.description}</div>

          {/* Specs block */}
          <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-700 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <dt className="text-neutral-500">Area</dt>
              <dd className="font-medium">{areaDisplay(listing)}</dd>
            </div>
            {typeof listing.bathrooms === "number" && (
              <div>
                <dt className="text-neutral-500">Bathrooms</dt>
                <dd className="font-medium">{listing.bathrooms}</dd>
              </div>
            )}
            {furnishingLabel && (
              <div>
                <dt className="text-neutral-500">Furnishing</dt>
                <dd className="font-medium">{furnishingLabel}</dd>
              </div>
            )}
            {typeof listing.floorNumber === "number" && (
              <div>
                <dt className="text-neutral-500">Floor</dt>
                <dd className="font-medium">
                  {listing.floorNumber}
                  {typeof listing.totalFloors === "number" ? ` / ${listing.totalFloors}` : ""}
                </dd>
              </div>
            )}
            {listing.ownership && (
              <div>
                <dt className="text-neutral-500">Ownership</dt>
                <dd className="font-medium">{listing.ownership}</dd>
              </div>
            )}
            {listing.reraRegistered !== undefined && (
              <div>
                <dt className="text-neutral-500">RERA</dt>
                <dd className="font-medium">{listing.reraRegistered ? "Registered" : "—"}</dd>
              </div>
            )}
            {listing.plotFacing && (
              <div>
                <dt className="text-neutral-500">Plot Facing</dt>
                <dd className="font-medium">{compactFacing(listing.plotFacing)}</dd>
              </div>
            )}
          </dl>

          {/* Location */}
          <div className="mt-2 text-sm text-neutral-600">
            <span className="line-clamp-1">{locationLine(listing)}</span>
          </div>

          {/* Tags */}
          {listing.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {listing.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right: price & CTA */}
        <div className="flex flex-col justify-between border-t border-neutral-100 p-4 md:border-l md:border-t-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-neutral-900">{formatINRCompact(allIn)}</div>
            <div className="text-xs text-neutral-500">
              {listing.priceBreakup?.allInclusive ? "All inclusive" : "Approximate"}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Link
              href={linkHref}
              className="rounded-lg bg-[#B68C2C] px-3 py-2 text-sm font-semibold text-white hover:brightness-105"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

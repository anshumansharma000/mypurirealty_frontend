"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ListingCardProps = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  slug: string;
  badge?: "New" | "Verified" | "Featured";
  className?: string;
};

export default function ListingCard({
  id,
  title,
  location,
  price,
  image,
  slug,
  badge,
  className,
}: ListingCardProps) {
  return (
    <Link
      key={id}
      href={`/listings/${slug}`}
      className={[
        "group relative flex w-[280px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md",
        className || "",
      ].join(" ")}
    >
      {/* ─────────────── Image Section ─────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="280px"
        />

        {/* badge */}
        {badge && (
          <div className="absolute left-2 top-2 rounded-md bg-gold-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {badge === "Verified" ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            ) : (
              badge
            )}
          </div>
        )}
      </div>

      {/* ─────────────── Content Section ─────────────── */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 leading-snug">
            {title}
          </h3>

          <div className="mt-1 flex items-center text-xs text-neutral-600">
            <MapPin className="mr-1 h-3 w-3 text-neutral-500" />
            {location}
          </div>
        </div>

        <div className="mt-2 text-sm font-semibold text-neutral-900">{price}</div>
      </div>
    </Link>
  );
}

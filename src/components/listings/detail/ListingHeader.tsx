import ListingHeaderActions from "./ListingHeaderActions";
import { formatINR } from "@/lib/format";
import type { ListingBadge, Location, Price } from "@/lib/types";
import React from "react";

type Props = {
  listingId: string;
  title: string;
  price: Price;
  location: Location;
  badges?: ListingBadge[];
  className?: string;
};

export default function ListingHeader({
  listingId,
  title,
  price,
  location,
  badges = [],
  className,
}: Props) {
  return (
    <header className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* Left: title + location + badges */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{title}</h1>
          <div className="mt-1 text-sm text-neutral-600">
            {location.locality}
            {location.city ? `, ${location.city}` : ""}
            {location.address ? ` • ${location.address}` : ""}
          </div>

          {/* badges */}
          {badges.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs",
                    b === "RERA"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : b === "Verified"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : b === "Hot"
                          ? "border-rose-300 bg-rose-50 text-rose-700"
                          : "border-amber-300 bg-amber-50 text-amber-700", // New (bronze/gold vibe)
                  ].join(" ")}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: price + actions */}
        <div className="flex items-start gap-4 md:items-center">
          <div className="text-right">
            <div className="text-2xl font-semibold text-neutral-900 md:text-3xl">
              {formatINR(price.amount)}
            </div>
            {price.negotiable && <div className="text-xs text-neutral-600">Price negotiable</div>}
          </div>

          <ListingHeaderActions listingId={listingId} title={title} />
        </div>
      </div>

      {/* subtle divider */}
      {/* <div className="mt-4 h-px w-full bg-neutral-200" /> */}
    </header>
  );
}

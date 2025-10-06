"use client";

import { Building2, Phone, ShieldCheck } from "lucide-react";
import React from "react";

type Props = {
  name: string;
  experience?: string;
  firm?: string;
  verified?: boolean;
  contactNumber?: string; // full number but masked in UI
  onContact?: () => void;
  className?: string;
};

export default function ListingSellerCard({
  name,
  experience,
  firm,
  verified,
  contactNumber,
  onContact,
  className,
}: Props) {
  // mask last 4 digits
  const masked =
    contactNumber && contactNumber.length >= 4
      ? contactNumber.slice(0, -4).replace(/\d/g, "X") + contactNumber.slice(-4)
      : "XXXXXXXXXX";

  return (
    <section
      className={[
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
        className || "",
      ].join(" ")}
    >
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">Listed by</h2>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-neutral-900">
            <span className="font-medium">{name}</span>
            {verified && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
          </div>
          {firm && (
            <div className="mt-0.5 flex items-center gap-1 text-sm text-neutral-700">
              <Building2 className="h-3.5 w-3.5" /> {firm}
            </div>
          )}
          {experience && (
            <div className="mt-0.5 text-sm text-neutral-700">{experience} experience</div>
          )}
        </div>
      </div>

      {contactNumber && (
        <div className="mt-3 flex items-center gap-2 text-neutral-800">
          <Phone className="h-4 w-4 text-neutral-600" />
          <span className="font-mono text-sm">{masked}</span>
        </div>
      )}

      <button
        type="button"
        onClick={onContact}
        className="mt-4 w-full rounded-lg bg-gold-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Show Interest
      </button>
    </section>
  );
}

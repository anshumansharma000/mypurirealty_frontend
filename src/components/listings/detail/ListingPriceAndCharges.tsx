"use client";

import React from "react";

export type PriceBreakdown = {
  label: string;
  value: string | number;
  highlight?: boolean; // bold or accent color
};

export type ChargesBreakdown = {
  label: string;
  value: string | number;
};

type Props = {
  title?: string;
  totalPrice?: string; // e.g., "₹1.25 Cr"
  negotiable?: boolean;
  pricePerSqft?: string; // optional
  basePrice?: string; // optional
  priceBreakdown?: PriceBreakdown[]; // optional
  otherCharges?: ChargesBreakdown[]; // optional
  note?: string; // optional footnote
  className?: string;
};

export default function ListingPriceAndCharges({
  title = "Price & Charges",
  totalPrice,
  negotiable,
  pricePerSqft,
  basePrice,
  priceBreakdown = [],
  otherCharges = [],
  note,
  className,
}: Props) {
  return (
    <section
      className={[
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
        className || "",
      ].join(" ")}
    >
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">{title}</h2>

      {/* Top strip: Total price & Price per sqft */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          {totalPrice && (
            <div className="text-2xl font-semibold text-neutral-900">{totalPrice}</div>
          )}
          {negotiable && <div className="text-xs text-neutral-600 mt-0.5">Price negotiable</div>}
        </div>
        {pricePerSqft && (
          <div className="text-sm text-neutral-700">
            <span className="font-medium">Price per sqft: </span>
            {pricePerSqft}
          </div>
        )}
      </div>

      {/* Base / Breakdown */}
      {basePrice && (
        <div className="mt-3 text-sm text-neutral-700">
          <span className="font-medium">Base price: </span>
          {basePrice}
        </div>
      )}

      {priceBreakdown.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {priceBreakdown.map((p, i) => (
            <div key={i}>
              <dt className="text-neutral-500">{p.label}</dt>
              <dd
                className={`font-medium ${p.highlight ? "text-neutral-900" : "text-neutral-700"}`}
              >
                {p.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Other charges */}
      {otherCharges.length > 0 && (
        <>
          <div className="my-4 h-px w-full bg-neutral-200" />
          <h3 className="mb-2 text-sm font-medium text-neutral-900">Additional charges</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {otherCharges.map((c, i) => (
              <div key={i}>
                <dt className="text-neutral-500">{c.label}</dt>
                <dd className="font-medium text-neutral-700">{c.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {/* Note / disclaimer */}
      {note && <p className="mt-4 text-xs text-neutral-500 italic leading-relaxed">{note}</p>}
    </section>
  );
}

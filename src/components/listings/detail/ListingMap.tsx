"use client";

import React from "react";

type Props = {
  title?: string;
  mapEmbedUrl: string; // standard Google Maps embed link
  height?: number;
  className?: string;
};

export default function ListingMap({
  title = "Location",
  mapEmbedUrl,
  height = 240,
  className,
}: Props) {
  return (
    <section
      className={[
        "rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden",
        className || "",
      ].join(" ")}
    >
      <h2 className="px-4 pt-3 pb-2 text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

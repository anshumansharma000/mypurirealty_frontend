"use client";

import React from "react";

type Props = {
  title?: string; // default: "Overview"
  text?: string; // long description (plain text)
  highlights?: string[]; // optional bullet points
  className?: string;
};

export default function ListingDescription({
  title = "Overview",
  text,
  highlights = [],
  className,
}: Props) {
  if (!text && highlights.length === 0) return null;

  return (
    <section
      className={[
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
        className || "",
      ].join(" ")}
    >
      {title && <h2 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>}

      {text && (
        <div className="text-sm leading-relaxed text-neutral-800">
          {splitParagraphs(text).map((p, idx) => (
            <p key={idx} className={idx > 0 ? "mt-2" : undefined}>
              {p}
            </p>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <div className={text ? "mt-3" : ""}>
          <h3 className="mb-1 text-sm font-medium text-neutral-900">Key highlights</h3>
          <ul className="list-disc pl-5 text-sm text-neutral-800">
            {highlights.map((h, i) => (
              <li key={i} className="mt-1">
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* helpers */
function splitParagraphs(input: string) {
  return input
    .split(/\n\s*\n/) // blank-line paragraphs
    .flatMap((blk) => blk.split(/\n/))
    .map((p) => p.trim())
    .filter(Boolean);
}

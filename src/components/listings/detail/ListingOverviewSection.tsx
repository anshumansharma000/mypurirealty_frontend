"use client";

import { Media } from "./MediaViewer";
import Image from "next/image";

type FactItem = { label: string; value: string | number; highlight?: boolean };
type HeadlineFact = { icon: any; label: string };

type Props = {
  media: Media[];
  headlineFacts: HeadlineFact[];
  primaryFacts: FactItem[];
  secondaryFacts: FactItem[];
  onOpenMedia: () => void;
};

export default function ListingOverviewSection({
  media,
  headlineFacts,
  primaryFacts,
  secondaryFacts,
  onOpenMedia,
}: Props) {
  const imagesOnly = media.filter((m) => m.type === "image");
  const extraCount = Math.max(0, media.length - 5);
  const displayThumbs = imagesOnly.slice(1, 5);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[0.4fr_0.6fr]">
      {/* ── Media (click to open viewer) */}
      <div onClick={onOpenMedia} className="cursor-pointer">
        <div
          className="relative w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100
            h-[clamp(140px,26vw,240px)] md:h-[clamp(160px,22vw,260px)]"
        >
          {imagesOnly[0] ? (
            <Image
              src={imagesOnly[0].src}
              alt={imagesOnly[0].alt || "Listing photo"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-neutral-400">No photo</div>
          )}
        </div>

        {media.length > 1 && (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {displayThumbs.map((m, idx) => {
              const isLast = idx === displayThumbs.length - 1 && extraCount > 0;
              return (
                <div
                  key={m.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-md border border-neutral-200"
                >
                  <Image
                    src={m.thumb || m.src}
                    alt={m.alt || "Thumbnail"}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {isLast && (
                    <>
                      <div className="absolute inset-0 bg-black/45" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-neutral-900">
                          +{extraCount} Photos
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Facts card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          {headlineFacts.map((f, i) => (
            <div key={i} className="flex items-center gap-1 text-sm text-neutral-700">
              <f.icon className="h-4 w-4 text-neutral-600" aria-hidden />
              {f.label}
            </div>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {primaryFacts.map((f, i) => (
            <div key={i}>
              <dt className="text-neutral-500">{f.label}</dt>
              <dd
                className={`font-medium ${f.highlight ? "text-neutral-900" : "text-neutral-700"}`}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        {secondaryFacts.length > 0 && <div className="my-3 h-px w-full bg-neutral-200" />}

        {secondaryFacts.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {secondaryFacts.map((f, i) => (
              <div key={i}>
                <dt className="text-neutral-500">{f.label}</dt>
                <dd className="font-medium text-neutral-700">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

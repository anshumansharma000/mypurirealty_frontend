"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Media = {
  id: string;
  type: "image" | "video";
  src: string; // image URL or video URL
  alt?: string;
  thumb?: string; // optional thumbnail (esp. for videos)
};

type Props = {
  media: Media[];
  className?: string;
};

export default function MediaGallery({ media, className }: Props) {
  const items = useMemo(() => media?.filter(Boolean) ?? [], [media]);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keep refs array length in sync
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, items.length);
  }, [items.length]);

  const scrollToIndex = useCallback((idx: number) => {
    const el = slideRefs.current[idx];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const goPrev = useCallback(() => {
    setActive((prev) => {
      const next = Math.max(prev - 1, 0);
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex]);

  const goNext = useCallback(() => {
    setActive((prev) => {
      const next = Math.min(prev + 1, items.length - 1);
      scrollToIndex(next);
      return next;
    });
  }, [items.length, scrollToIndex]);

  // Track which slide is most visible to keep thumbnails in sync
  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.index || 0);
          setActive(idx);
        }
      },
      { root: container, threshold: [0.5, 0.75, 0.9] },
    );

    slideRefs.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  if (!items.length) {
    return (
      <div className={`w-full ${className ?? ""}`}>
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-neutral-100 border border-neutral-200 grid place-items-center">
          <span className="text-sm text-neutral-500">Photos coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className ?? ""}`}>
      {/* Viewport */}
      <div className="relative">
        <div
          ref={viewportRef}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
          aria-label="Listing media gallery"
        >
          {items.map((m, i) => (
            <div
              key={m.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              className="relative snap-center shrink-0 w-[90%] sm:w-[75%] md:w-[65%] lg:w-[55%] xl:w-[50%] max-w-[720px]"
            >
              <div
                className="relative w-full h-[240px] sm:h-[280px] md:h-[340px] lg:h-[240px] xl:h-[240px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
                role="button"
                aria-label="Open image in full screen"
                onClick={() => setLightboxOpen(true)}
              >
                {m.type === "image" ? (
                  <Image
                    src={m.src}
                    alt={m.alt ?? `Photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-fit"
                    priority={i === 0}
                  />
                ) : (
                  <video
                    className="h-full w-full object-cover"
                    poster={m.thumb}
                    controls
                    onClick={(e) => e.stopPropagation()} // allow play without opening lightbox
                  >
                    <source src={m.src} />
                    {/* Fallback text */}
                    Your browser does not support HTML video.
                  </video>
                )}

                {/* Count badge */}
                <div className="absolute bottom-3 left-3 rounded-full bg-black/60 text-white text-xs px-2 py-1">
                  {i + 1} / {items.length}
                </div>

                {/* Prev/Next controls (desktop) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous media"
                  className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full bg-black/50 text-white"
                >
                  {/* left chevron */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next media"
                  className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full bg-black/50 text-white"
                >
                  {/* right chevron */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Thumb strip */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar" aria-label="Media thumbnails">
          {items.map((m, i) => (
            <button
              key={`thumb-${m.id}`}
              type="button"
              onClick={() => {
                setActive(i);
                scrollToIndex(i);
              }}
              className={[
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border",
                active === i ? "border-amber-500 ring-2 ring-amber-200" : "border-neutral-200",
              ].join(" ")}
              aria-label={`Go to media ${i + 1}`}
            >
              {m.type === "image" ? (
                <Image
                  src={m.thumb || m.src}
                  alt={m.alt ?? `Thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <>
                  <Image
                    src={m.thumb || "/video-thumb-fallback.jpg"}
                    alt={m.alt ?? `Video ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {/* play badge */}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    </span>
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox items={items} startIndex={active} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}

/* ───────────────────────── Lightbox (simple, no deps) ───────────────────────── */

function Lightbox({
  items,
  startIndex = 0,
  onClose,
}: {
  items: Media[];
  startIndex?: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const closeOnEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => Math.min(p + 1, items.length - 1));
      if (e.key === "ArrowLeft") setIdx((p) => Math.max(p - 1, 0));
    },
    [items.length, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", closeOnEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEsc);
      document.body.style.overflow = "";
    };
  }, [closeOnEsc]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 text-white" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="relative w-full max-w-5xl">
          <div className="relative aspect-[16/10] w-full">
            {items[idx].type === "image" ? (
              <Image
                src={items[idx].src}
                alt={items[idx].alt ?? `Image ${idx + 1}`}
                fill
                sizes="80vw"
                className="object-contain"
                priority
              />
            ) : (
              <video className="h-full w-full object-contain" controls autoPlay>
                <source src={items[idx].src} />
              </video>
            )}
          </div>

          {/* Nav */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              type="button"
              onClick={() => setIdx((p) => Math.max(p - 1, 0))}
              aria-label="Previous"
              className="ml-2 grid h-10 w-10 place-items-center rounded-full bg-white/15"
              disabled={idx === 0}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              onClick={() => setIdx((p) => Math.min(p + 1, items.length - 1))}
              aria-label="Next"
              className="mr-2 grid h-10 w-10 place-items-center rounded-full bg-white/15"
              disabled={idx === items.length - 1}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs">
            {idx + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );
}

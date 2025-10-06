"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type Media = {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  thumb?: string;
};

type Props = {
  media: Media[];
  isOpen: boolean;
  onClose: () => void;
};

export default function MediaViewer({ media, isOpen, onClose }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // videos first, then images
  const ordered = [...media].sort((a, b) => (a.type === b.type ? 0 : a.type === "video" ? -1 : 1));

  // keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (e.key === "ArrowRight" && lightboxIndex !== null) {
        setLightboxIndex((i) => Math.min((i ?? 0) + 1, ordered.length - 1));
      }
      if (e.key === "ArrowLeft" && lightboxIndex !== null) {
        setLightboxIndex((i) => Math.max((i ?? 0) - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, lightboxIndex, ordered.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <h2 className="text-sm font-medium text-neutral-700">Media ({ordered.length})</h2>
        <button
          onClick={() => (lightboxIndex !== null ? setLightboxIndex(null) : onClose())}
          className="rounded-full bg-neutral-100 p-2 hover:bg-neutral-200"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-neutral-700" />
        </button>
      </div>

      {/* grid view */}
      {lightboxIndex === null && (
        <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {ordered.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
              aria-label="Open media"
            >
              {m.type === "image" ? (
                <Image
                  src={m.thumb || m.src}
                  alt={m.alt || "media"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="200px"
                />
              ) : (
                <>
                  <video className="h-full w-full object-cover" muted poster={m.thumb}>
                    <source src={m.src} />
                  </video>
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white">
                      ▶
                    </span>
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* lightbox with swipe */}
      {lightboxIndex !== null && (
        <LightboxContent
          ordered={ordered}
          index={lightboxIndex}
          setIndex={setLightboxIndex}
          onExit={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

/* ───────────────────────── LightboxContent (swipe-enabled) ───────────────────────── */

function LightboxContent({
  ordered,
  index,
  setIndex,
  onExit,
}: {
  ordered: Media[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onExit: () => void;
}) {
  const [startX, setStartX] = useState<number | null>(null);
  const [deltaX, setDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const canPrev = index > 0;
  const canNext = index < ordered.length - 1;

  const THRESHOLD = 60; // px swipe threshold

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    setStartX(x);
    setDeltaX(0);
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startX === null) return;
      const currentX = e.touches[0].clientX;
      setDeltaX(currentX - startX);
    },
    [startX],
  );

  const onTouchEnd = useCallback(() => {
    if (!isDragging) return;
    const abs = Math.abs(deltaX);
    if (abs > THRESHOLD) {
      if (deltaX < 0 && canNext) {
        // swipe left → next
        setIndex((i) => Math.min((i ?? 0) + 1, ordered.length - 1));
      } else if (deltaX > 0 && canPrev) {
        // swipe right → prev
        setIndex((i) => Math.max((i ?? 0) - 1, 0));
      }
    }
    // reset
    setStartX(null);
    setDeltaX(0);
    setIsDragging(false);
  }, [deltaX, isDragging, canNext, canPrev, ordered.length, setIndex]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95">
      {/* Close */}
      <button
        onClick={onExit}
        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Arrows */}
      {canPrev && (
        <button
          onClick={() => setIndex((i) => Math.max((i ?? 0) - 1, 0))}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canNext && (
        <button
          onClick={() => setIndex((i) => Math.min((i ?? 0) + 1, ordered.length - 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Media area (swipe handlers here) */}
      <div
        className="relative mx-auto flex max-h-[85vh] w-full max-w-5xl touch-none items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: isDragging ? `translateX(${deltaX}px)` : "translateX(0)",
          }}
        >
          {ordered[index].type === "image" ? (
            // use <img> to avoid next/image fill issues in fullscreen
            <img
              src={ordered[index].src}
              alt={ordered[index].alt || "image"}
              className="max-h-[80vh] w-auto object-contain"
            />
          ) : (
            <video
              src={ordered[index].src}
              controls
              autoPlay
              className="max-h-[80vh] w-auto object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

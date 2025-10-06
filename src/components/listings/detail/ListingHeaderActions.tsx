"use client";

import { Bookmark, Share2 } from "lucide-react";
import React from "react";

type Props = {
  listingId: string;
  title: string;
};

export default function ListingHeaderActions({ listingId, title }: Props) {
  const [saved, setSaved] = React.useState(false);
  const [copyDone, setCopyDone] = React.useState(false);

  const onSave = () => {
    // TODO: call your API to persist save/unsave
    setSaved((s) => !s);
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 1500);
      }
    } catch {
      // silent
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
        aria-label="Share listing"
      >
        <Share2 className="h-4 w-4" />
        {copyDone ? "Link copied" : "Share"}
      </button>

      <button
        type="button"
        onClick={onSave}
        className={[
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
          saved
            ? "bg-amber-500 text-white"
            : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
        ].join(" ")}
        aria-pressed={saved}
        aria-label={saved ? "Saved" : "Save listing"}
      >
        <Bookmark className="h-4 w-4" />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}

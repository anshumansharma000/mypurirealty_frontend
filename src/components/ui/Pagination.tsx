// components/ui/Pagination.tsx
"use client";

import React from "react";

// components/ui/Pagination.tsx

// components/ui/Pagination.tsx

type Props = {
  currentPage: number; // 1-based
  totalPages: number; // >= 1
  makeHref?: (page: number) => string; // optional for now
  onPageChange?: (page: number) => void; // optional click handler
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  makeHref,
  onPageChange,
  className = "",
}: Props) {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const btn =
    "rounded-lg px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300";
  const pill = "rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-neutral-200";

  const renderLink = (page: number, content: React.ReactNode, isDisabled?: boolean) => {
    if (makeHref) {
      return (
        <a className={btn} href={makeHref(page)} aria-disabled={isDisabled}>
          {content}
        </a>
      );
    }
    return (
      <button
        type="button"
        className={btn}
        onClick={() => onPageChange?.(page)}
        disabled={isDisabled}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-1 shadow-sm",
        className,
      ].join(" ")}
    >
      {renderLink(1, "First", currentPage === 1)}
      {renderLink(Math.max(1, currentPage - 1), "Previous", currentPage === 1)}

      {pages.map((p) =>
        p === currentPage ? (
          <span key={p} className={`${pill} text-neutral-900 bg-neutral-50`}>
            {p}
          </span>
        ) : (
          renderLink(p, p)
        ),
      )}

      {renderLink(Math.min(totalPages, currentPage + 1), "Next", currentPage === totalPages)}
      {renderLink(totalPages, "Last", currentPage === totalPages)}
    </nav>
  );
}

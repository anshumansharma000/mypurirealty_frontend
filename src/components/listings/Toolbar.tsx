// components/listings/Toolbar.tsx
"use client";

import React from "react";

// components/listings/Toolbar.tsx

type SortOption = "relevance" | "priceLowHigh" | "priceHighLow" | "newest";

export type ListingsToolbarProps = {
  total?: number; // results count to show on the right
  search?: string; // controlled search value
  sort?: SortOption; // controlled sort value
  disabled?: boolean; // greys out and disables inputs (UI-only)

  onSearchChange?: (value: string) => void;
  onSortChange?: (value: SortOption) => void;

  className?: string;
};

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  priceLowHigh: "Price: Low to High",
  priceHighLow: "Price: High to Low",
  newest: "Newest",
};

export default function ListingsToolbar({
  total,
  search = "",
  sort = "relevance",
  disabled = false,
  onSearchChange,
  onSortChange,
  className = "",
}: ListingsToolbarProps) {
  return (
    <div
      className={[
        "flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        disabled ? "opacity-60" : "",
        className,
      ].join(" ")}
    >
      {/* Left: search */}
      <div className="flex w-full items-center gap-2 sm:max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, locality…"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>

      {/* Right: sort + count */}
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-sm text-neutral-600 sm:block">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value as SortOption)}
            disabled={disabled}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-400"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {typeof total === "number" && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
            {total} results
          </div>
        )}
      </div>
    </div>
  );
}

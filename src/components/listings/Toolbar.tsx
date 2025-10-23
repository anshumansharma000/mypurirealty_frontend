// components/listings/Toolbar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// components/listings/Toolbar.tsx

type SortOption = "relevance" | "priceLowHigh" | "priceHighLow" | "newest";

export type ListingsToolbarProps = {
  total?: number;
  search?: string; // optional controlled
  sort?: SortOption; // optional controlled
  disabled?: boolean;

  onSearchChange?: (value: string) => void; // if provided, we'll debounce calls to it
  onSortChange?: (value: SortOption) => void;

  className?: string;
};

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  priceLowHigh: "Price: Low to High",
  priceHighLow: "Price: High to Low",
  newest: "Newest",
};

// UI ↔ query param mapping
const toParam = (s: SortOption | undefined | null) => {
  switch (s) {
    case "priceLowHigh":
      return "price_asc";
    case "priceHighLow":
      return "price_desc";
    case "newest":
      return "newest";
    case "relevance":
    default:
      return "relevance";
  }
};
const fromParam = (p: string | null): SortOption => {
  switch (p) {
    case "price_asc":
      return "priceLowHigh";
    case "price_desc":
      return "priceHighLow";
    case "newest":
      return "newest";
    case "relevance":
    default:
      return "relevance";
  }
};

export default function ListingsToolbar({
  total,
  search,
  sort,
  disabled = false,
  onSearchChange,
  onSortChange,
  className = "",
}: ListingsToolbarProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  // helper to write many params
  const setMany = (next: Record<string, string | number | undefined | null>) => {
    const q = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") q.delete(k);
      else q.set(k, String(v));
    });
    router.replace(`${pathname}?${q.toString()}`);
  };

  // Resolve current values (URL is the source if uncontrolled)
  const urlQ = sp.get("q") ?? "";
  const urlSort = fromParam(sp.get("sort"));
  const isSearchControlled = typeof search === "string";
  const isSortControlled = typeof sort === "string";

  // Local input state (for debouncing + clear button)
  const [input, setInput] = useState<string>(isSearchControlled ? (search as string) : urlQ);

  // Keep input in sync if parent or URL changes externally
  useEffect(() => {
    if (isSearchControlled) setInput(search as string);
  }, [isSearchControlled, search]);
  useEffect(() => {
    if (!isSearchControlled) setInput(urlQ);
  }, [isSearchControlled, urlQ]);

  const currentSort: SortOption = isSortControlled ? (sort as SortOption) : urlSort;

  // Debounce machinery
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushDebounce = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const schedule = (fn: () => void, delay = 400) => {
    flushDebounce();
    timerRef.current = setTimeout(fn, delay);
  };
  useEffect(() => () => flushDebounce(), []);

  const applySearch = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setMany({ q: value || undefined, page: undefined }); // reset page on new search
  };

  // Handlers
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInput(v);
    schedule(() => applySearch(v));
  };
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      flushDebounce();
      applySearch(input);
    }
  };
  const clearInput = (inputEl?: HTMLInputElement | null) => {
    setInput("");
    flushDebounce();
    applySearch("");
    inputEl?.focus();
  };

  const onSortChangeLocal = (value: SortOption) => {
    if (onSortChange) onSortChange(value);
    else setMany({ sort: toParam(value), page: undefined });
  };

  // ref for focusing after clear
  const inputRef = useRef<HTMLInputElement | null>(null);

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
            ref={inputRef}
            type="text"
            placeholder="Search by title, locality…"
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            disabled={disabled}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm text-neutral-800 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
          />
          {/* search icon (right) */}
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
          {/* clear button (shows only when there is text) */}
          {input?.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-7 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-600"
              onClick={() => clearInput(inputRef.current)}
              disabled={disabled}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
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
            value={currentSort}
            onChange={(e) => onSortChangeLocal(e.target.value as SortOption)}
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

"use client";

import {
  ConstructionStatus,
  Furnishing,
  ListingCategory,
  formatConstructionStatus,
  formatFurnishing,
} from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export type FiltersState = {
  categories: ListingCategory[]; // multi
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number; // 1,2,3,4 (4 means 4+ if you want)
  furnishing?: Furnishing; // single
  construction?: ConstructionStatus; // single
};

export type FiltersProps = {
  value: FiltersState;
  onChange?: (next: FiltersState) => void;
  onApply?: (next: FiltersState) => void;
  onClear?: () => void;
  className?: string;
};

const CATEGORIES: ListingCategory[] = [
  "Plot",
  "Farm Land",
  "Independent House",
  "Flat (Housing Complex)",
  "Flat (Society)",
  "Villa",
  "Row House",
  "Commercial Space",
  "Shop",
  "Office",
  "Other",
];

const BEDROOMS = [1, 2, 3, 4];
const FURNISHINGS: Furnishing[] = ["unfurnished", "semi", "fully"];
const CONSTRUCTIONS: ConstructionStatus[] = ["ready_to_move", "under_construction", "new_launch"];

function isLandCategory(c: ListingCategory) {
  return c === "Plot" || c === "Farm Land";
}

export default function Filters({
  value,
  onChange,
  onApply,
  onClear,
  className = "",
}: FiltersProps) {
  // URL helpers
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const setMany = (next: Record<string, string | number | undefined | null>) => {
    const q = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") q.delete(k);
      else q.set(k, String(v));
    });
    router.replace(`${pathname}?${q.toString()}`);
  };

  // Local shadow state (so users can change fields and only "Apply" when ready)
  const [local, setLocal] = useState<FiltersState>(value);
  const [open, setOpen] = useState(false);

  // Derived: number of active filters (for badge)
  const activeCount = useMemo(() => {
    let n = 0;
    if (local.categories?.length) n++;
    if (local.minPrice || local.maxPrice) n++;
    if (local.bedrooms) n++;
    if (local.furnishing) n++;
    if (local.construction) n++;
    return n;
  }, [local]);

  // Hide unit-related filters when ONLY land categories are selected
  const hideUnitFilters = useMemo(() => {
    const cats = local.categories ?? [];
    if (cats.length === 0) return false; // no category selected → show all
    return cats.every(isLandCategory);
  }, [local.categories]);

  const set = <K extends keyof FiltersState>(key: K, v: FiltersState[K]) => {
    const next = { ...local, [key]: v };
    setLocal(next);
    onChange?.(next);
  };

  const toggleCategory = (cat: ListingCategory) => {
    const next = new Set(local.categories ?? []);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    set("categories", Array.from(next));
  };

  const clearAll = () => {
    const cleared: FiltersState = { categories: [] };
    setLocal(cleared);
    onChange?.(cleared);
    onClear?.();

    // also clear from URL (and reset page)
    setMany({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      furnishing: undefined,
      construction: undefined,
      page: undefined,
    });
  };

  const apply = () => {
    // write to URL; backend expects basic scalar params
    setMany({
      categories: local.categories?.length ? local.categories.join(",") : undefined,
      minPrice: local.minPrice,
      maxPrice: local.maxPrice,
      bedrooms: local.bedrooms,
      furnishing: local.furnishing,
      construction: local.construction,
      page: undefined, // reset pagination on filter change
    });
    onApply?.(local);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile bar */}
      <div className={["sm:hidden", className].join(" ")}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
            onClick={() => setOpen(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Filters{" "}
            {activeCount ? (
              <span className="ml-1 rounded bg-neutral-900 px-1.5 py-0.5 text-xs text-white">
                {activeCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
            onClick={clearAll}
          >
            Clear
          </button>
        </div>

        {/* Sheet */}
        {open && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-semibold">Filters</div>
                <button
                  className="rounded-md p-1 hover:bg-neutral-100"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto px-4 py-3">
                <FiltersBody
                  local={local}
                  set={set}
                  toggleCategory={toggleCategory}
                  hideUnitFilters={hideUnitFilters}
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
                <button className="rounded-lg border px-3 py-2 text-sm" onClick={clearAll}>
                  Clear all
                </button>
                <button
                  className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
                  onClick={apply}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className={["hidden sm:block", className].join(" ")}>
        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Filters</div>
            {activeCount ? (
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-xs text-white">
                {activeCount}
              </span>
            ) : null}
          </div>

          <FiltersBody
            local={local}
            set={set}
            toggleCategory={toggleCategory}
            hideUnitFilters={hideUnitFilters}
          />

          <div className="mt-4 flex items-center justify-between">
            <button className="rounded-lg border px-3 py-2 text-sm" onClick={clearAll}>
              Clear all
            </button>
            <button
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
              onClick={apply}
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function FiltersBody({
  local,
  set,
  toggleCategory,
  hideUnitFilters,
}: {
  local: FiltersState;
  set: <K extends keyof FiltersState>(key: K, v: FiltersState[K]) => void;
  toggleCategory: (cat: ListingCategory) => void;
  hideUnitFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Category */}
      <section>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Category
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => {
            const checked = local.categories?.includes(c) ?? false;
            return (
              <label key={c} className="flex items-center gap-2 text-sm text-neutral-800">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300"
                  checked={checked}
                  onChange={() => toggleCategory(c)}
                />
                <span className="line-clamp-1">{c}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Price */}
      <section>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Price (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={local.minPrice ?? ""}
            onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={local.maxPrice ?? ""}
            onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Bedrooms (hidden for land) */}
      {!hideUnitFilters && (
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Bedrooms
          </h4>
          <div className="flex flex-wrap gap-2">
            {BEDROOMS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => set("bedrooms", local.bedrooms === b ? undefined : b)}
                className={[
                  "rounded-full px-3 py-1 text-sm",
                  local.bedrooms === b
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-800",
                ].join(" ")}
              >
                {b === 4 ? "4+" : b}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set("bedrooms", undefined)}
              className={[
                "rounded-full px-3 py-1 text-sm",
                local.bedrooms == null
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-800",
              ].join(" ")}
            >
              Any
            </button>
          </div>
        </section>
      )}

      {/* Furnishing (hidden for land) */}
      {!hideUnitFilters && (
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Furnishing
          </h4>
          <select
            value={local.furnishing ?? ""}
            onChange={(e) =>
              set(
                "furnishing",
                e.target.value ? (e.target.value as FiltersState["furnishing"]) : undefined,
              )
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {FURNISHINGS.map((f) => (
              <option key={f} value={f}>
                {formatFurnishing(f) ?? f}
              </option>
            ))}
          </select>
        </section>
      )}

      {/* Construction status (hidden for land) */}
      {!hideUnitFilters && (
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Construction Status
          </h4>
          <select
            value={local.construction ?? ""}
            onChange={(e) =>
              set(
                "construction",
                e.target.value ? (e.target.value as FiltersState["construction"]) : undefined,
              )
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {CONSTRUCTIONS.map((c) => (
              <option key={c} value={c}>
                {formatConstructionStatus(c) ?? c}
              </option>
            ))}
          </select>
        </section>
      )}
    </div>
  );
}

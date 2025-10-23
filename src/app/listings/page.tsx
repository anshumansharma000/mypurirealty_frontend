"use client";

import Filters, { type FiltersState } from "@/components/listings/Filters";
import ListingsGrid from "@/components/listings/ListingGrid";
import ListingsToolbar from "@/components/listings/Toolbar";
import Pagination from "@/components/ui/Pagination";
import { useListings } from "@/features/listings/hooks/useListings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

// your existing hook

function urlToFilters(sp: URLSearchParams): FiltersState {
  const categoriesStr = sp.get("categories") ?? "";
  const categories = categoriesStr ? (categoriesStr.split(",") as FiltersState["categories"]) : [];
  const num = (k: string) => {
    const v = sp.get(k);
    return v ? Number(v) : undefined;
  };
  const str = (k: string) => sp.get(k) ?? undefined;

  return {
    categories,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    bedrooms: num("bedrooms"),
    furnishing: str("furnishing") as FiltersState["furnishing"],
    construction: str("construction") as FiltersState["construction"],
  };
}

type QueryParamValue = string | number | undefined | null | (string | number)[];

function setMany(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  sp: URLSearchParams,
  next: Record<string, QueryParamValue>,
) {
  const q = new URLSearchParams(sp.toString());
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))
      q.delete(k);
    else q.set(k, Array.isArray(v) ? v.join(",") : String(v));
  });
  router.replace(`${pathname}?${q.toString()}`);
}

function ListingsPageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  // derive applied filters + other query params (search/sort/pagination)
  const appliedFilters = useMemo(() => urlToFilters(sp), [sp]);
  const q = sp.get("q") ?? undefined;
  const sort = sp.get("sort") ?? "price_desc";
  const page = Number(sp.get("page") ?? 1);
  const perPage = Number(sp.get("perPage") ?? 12);
  const city = sp.get("city") ?? "puri";

  // hook -> refetches when search params change (only after Apply/Clear)
  const { data, isLoading, isError } = useListings({
    city,
    q,
    sort,
    page,
    perPage,
    minPrice: appliedFilters.minPrice,
    maxPrice: appliedFilters.maxPrice,
    bedrooms: appliedFilters.bedrooms,
    furnishing: appliedFilters.furnishing,
    constructionStatus: appliedFilters.construction,
    category: appliedFilters.categories?.length ? appliedFilters.categories.join(",") : undefined,
  });

  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  // handlers passed to Filters — only write to URL on Apply/Clear
  const handleApply = (next: FiltersState) => {
    setMany(router, pathname, new URLSearchParams(sp.toString()), {
      categories: next.categories?.length ? next.categories.join(",") : undefined,
      minPrice: next.minPrice,
      maxPrice: next.maxPrice,
      bedrooms: next.bedrooms,
      furnishing: next.furnishing,
      construction: next.construction,
      page: undefined, // reset pagination
    });
  };

  const handleClear = () => {
    setMany(router, pathname, new URLSearchParams(sp.toString()), {
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      furnishing: undefined,
      construction: undefined,
      page: undefined,
    });
  };

  // pagination handler (kept simple)
  const goToPage = (nextPage: number) => {
    setMany(router, pathname, new URLSearchParams(sp.toString()), { page: nextPage });
  };

  return (
    <main className="container mx-auto px-4 py-6 mt-16">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Properties in Puri</h1>
        <ListingsToolbar total={total} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr]">
        {/* Sidebar filters — show currently applied values; fetch only on Apply */}
        <Filters value={appliedFilters} onApply={handleApply} onClear={handleClear} className="" />

        {/* Results */}
        <div className="flex flex-col gap-4">
          <ListingsGrid data={items} loading={isLoading} />
          {!isError && total > 0 && (
            <div className="mt-2 flex items-center justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.max(1, Math.ceil(total / perPage))}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-6 mt-16">
          <p className="text-sm text-neutral-600">Loading listings…</p>
        </main>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}

"use client";

import Filters from "@/components/listings/Filters";
import ListingsGrid from "@/components/listings/ListingGrid";
import ListingsToolbar from "@/components/listings/Toolbar";
import Pagination from "@/components/ui/Pagination";
import type { ListingsQuery } from "@/features/listings/api/getListings";
import { useListings } from "@/features/listings/hooks/useListings";
import QueryProvider from "@/shared/query/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function ListingsPage() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // URL → query (URL is source of truth)
  const page = Number(sp.get("page") ?? 1);
  const perPage = Number(sp.get("perPage") ?? 12);

  const params: ListingsQuery = useMemo(
    () => ({
      q: sp.get("q") ?? undefined,
      sort: sp.get("sort") ?? "price_desc",
      city: sp.get("city") ?? "puri",
      minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      bedrooms: sp.get("bedrooms") ? Number(sp.get("bedrooms")) : undefined,
      page,
      perPage,
    }),
    [sp, page, perPage],
  );

  // Fetch (TanStack Query v5)
  const { data, isLoading, isError } = useListings(params);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // (your existing filters expect a default value)
  const defaultFilters = { categories: [] as any[] };

  const onPageChange = (nextPage: number) => {
    const next = new URLSearchParams(sp.toString());
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <main className="container mx-auto px-4 py-6 mt-16">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Properties in Puri</h1>
        <ListingsToolbar total={total} disabled={isLoading || isError} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr]">
        {/* Sidebar filters (unchanged UI) */}
        <Filters value={defaultFilters} />

        {/* Results */}
        <div className="flex flex-col gap-4">
          <ListingsGrid
            data={data?.items ?? []}
            loading={isLoading}
            // keep your existing API for favorites; wire later if needed
            onFavoriteToggle={undefined}
          />

          <div className="mt-2 flex items-center justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        </div>
      </div>
    </main>
  );
}

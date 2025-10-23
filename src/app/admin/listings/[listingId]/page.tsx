"use client";

import Pagination from "@/components/ui/Pagination";
import { useListingInterests } from "@/features/interest/hooks/useListingInterests";
import { resolveInterestFetchError } from "@/features/interest/utils/errors";
import { useListing } from "@/features/listings/hooks/useListing";
import { useAdminAuthGuard } from "@/features/auth/hooks/useAdminAuthGuard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

export default function AdminListingInterestsPage() {
  const params = useParams();
  const listingParam = params?.listingId;
  const listingId =
    typeof listingParam === "string"
      ? listingParam
      : Array.isArray(listingParam) && listingParam.length > 0
        ? listingParam[0]
        : undefined;

  const { authorized, checking } = useAdminAuthGuard();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [listingId]);

  const { data: listing, isLoading: listingLoading } = useListing(
    authorized ? listingId : undefined,
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useListingInterests(listingId, page, PAGE_SIZE, authorized);

  const interests = data?.items ?? [];
  const pagination = data?.pagination;

  const totalLabel = useMemo(() => {
    if (!pagination) return null;
    return `${pagination.totalItems} inquiry${pagination.totalItems === 1 ? "" : "ies"}`;
  }, [pagination]);

  if (checking) return null;
  if (!authorized) return null;

  if (!listingId) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          Listing id not provided. Return to{" "}
          <Link className="underline" href="/admin">
            the admin dashboard
          </Link>{" "}
          and pick a listing again.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-neutral-500">
            <Link href="/admin" className="text-neutral-600 hover:text-neutral-900">
              ← Back to dashboard
            </Link>
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Listing inquiries</h1>
          <p className="text-sm text-neutral-500">
            {listingLoading
              ? "Loading listing details…"
              : listing
                ? `Visitors who showed interest in “${listing.title ?? listing.id}”.`
                : "Visitors who showed interest in this listing."}
          </p>
        </div>
        {totalLabel && (
          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-sm text-neutral-700">
            {totalLabel}
          </span>
        )}
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Visitor inquiries</h2>
            <p className="text-sm text-neutral-500">
              Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            disabled={isLoading || isFetching}
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    Loading inquiries…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-red-600">
                    {resolveInterestFetchError(error)}
                  </td>
                </tr>
              ) : interests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    No inquiries yet. Once someone submits the interest form, you’ll see it here.
                  </td>
                </tr>
              ) : (
                interests.map((interest, index) => (
                  <tr key={interest.id || `${interest.phone}-${interest.createdAt ?? index}`}>
                    <td className="px-6 py-4 font-medium text-neutral-900">{interest.name}</td>
                    <td className="px-6 py-4 font-mono text-sm text-neutral-800">
                      {interest.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {interest.email ? (
                        <a className="text-amber-700 hover:underline" href={`mailto:${interest.email}`}>
                          {interest.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {interest.message ? (
                        <span className="block whitespace-pre-wrap">{interest.message}</span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {formatTimestamp(interest.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 text-sm text-neutral-600">
          <span>
            {pagination
              ? `Showing page ${pagination.page} of ${pagination.totalPages}`
              : `Showing page ${page}`}
            {isFetching && !isLoading && <span className="ml-2 text-neutral-400">Updating…</span>}
          </span>
          <Pagination
            currentPage={pagination?.page ?? page}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={(next) => setPage(next)}
          />
        </div>
      </section>
    </main>
  );
}

function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

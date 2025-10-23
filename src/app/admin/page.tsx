"use client";

import ListingForm from "@/components/admin/ListingForm";
import { useAdminAuthGuard } from "@/features/auth/hooks/useAdminAuthGuard";
import { createListing } from "@/features/listings/api/createListing";
import { deleteListing } from "@/features/listings/api/deleteListing";
import { getListings } from "@/features/listings/api/getListings";
import { updateListing } from "@/features/listings/api/updateListing";
import type { ListingFormValues } from "@/features/listings/models/listingForm";
import { LISTING_STATUS_OPTIONS } from "@/features/listings/models/listingOptions";
import { clearTokens } from "@/shared/auth/token";
import type { Listing } from "@/shared/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Row = ListingFormValues & {
  _id: string;
  id?: string;
  status?: Listing["status"] | ListingFormValues["status"];
  imagePreviews?: string[];
  videoPreviews?: string[];
};

type FormDrawerState = { mode: "create" } | { mode: "edit"; row: Row };

export default function AdminDashboard() {
  const router = useRouter();
  const { authorized, checking } = useAdminAuthGuard();
  const [rows, setRows] = useState<Row[]>([]);
  const [drawer, setDrawer] = useState<FormDrawerState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const total = rows.length;
  const published = useMemo(
    () =>
      rows.filter((r) => {
        const status = (r.status ?? "").toLowerCase();
        return status === "published" || status === "available";
      }).length,
    [rows],
  );
  const drafts = total - published;
  const statsTotal = initializing ? "…" : String(total);
  const statsPublished = initializing ? "…" : String(published);
  const statsDrafts = initializing ? "…" : String(drafts);

  useEffect(() => {
    return () => {
      rows.forEach(revokeRowPreviews);
    };
  }, [rows]);

  useEffect(() => {
    if (!authorized) return;

    let cancelled = false;

    const fetchListings = async () => {
      try {
        const { items } = await getListings({ page: 1, perPage: 50 });
        if (cancelled) return;
        setRows(items.map((item) => listingToRow(item)));
        setErrorMsg(null);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load listings for the dashboard";
        setErrorMsg(message);
      } finally {
        if (cancelled) return;
        setInitializing(false);
      }
    };

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, [authorized]);

  if (checking) return null;
  if (!authorized) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 mt-8">
      {/* Top bar */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage listings for mypurirealty.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            View site
          </button>
          <button
            onClick={() => {
              clearTokens();
              document.cookie = "admin_auth=; Max-Age=0; path=/; SameSite=Lax";
              router.replace("/admin/login");
            }}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Listings" value={statsTotal} />
        <StatCard label="Published" value={statsPublished} />
        <StatCard label="Drafts" value={statsDrafts} />
      </section>

      {/* Actions */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <button
          className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
          onClick={() => setDrawer({ mode: "create" })}
        >
          + New Listing
        </button>
        <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">Import CSV</button>
        <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">Settings</button>
      </section>

      {/* Error (if any) */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Table */}
      <section className="rounded-2xl border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Listings</h2>
          <div className="flex gap-2">
            <input
              placeholder="Search…"
              className="w-56 rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
            <select className="rounded-xl border px-3 py-2 text-sm outline-none">
              <option>Sort: Newest</option>
              <option>Sort: Oldest</option>
              <option>Sort: Price (low→high)</option>
              <option>Sort: Price (high→low)</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Title</Th>
                <Th>Price</Th>
                <Th>Beds</Th>
                <Th>Baths</Th>
                <Th>City</Th>
                <Th>Status</Th>
                <Th>Media</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {initializing ? (
                <tr>
                  <Td colSpan={8}>
                    <div className="flex items-center justify-center py-16 text-gray-500">
                      Loading listings…
                    </div>
                  </Td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <Td colSpan={8}>
                    <div className="flex items-center justify-center py-16 text-gray-500">
                      No listings yet. Click <span className="mx-1 font-medium">+ New Listing</span>{" "}
                      to create one.
                    </div>
                  </Td>
                </tr>
              ) : (
                rows.map((r) => {
                  const detailId = r.id ?? r._id;
                  const detailHref = detailId
                    ? `/admin/listings/${encodeURIComponent(detailId)}`
                    : null;

                  return (
                    <tr key={r._id} className="border-t">
                      <Td className="font-medium">{r.title}</Td>
                      <Td>₹ {Number(r.price ?? 0).toLocaleString("en-IN")}</Td>
                      <Td>{r.bedrooms ?? "—"}</Td>
                      <Td>{r.bathrooms ?? "—"}</Td>
                      <Td>{r.addressParts?.city ?? "—"}</Td>
                      <Td>{formatStatus(r.status) ?? "Draft"}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          {(r.imagePreviews ?? []).slice(0, 3).map((src, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={src} alt="" className="h-8 w-8 rounded object-cover" />
                          ))}
                          {(r.videoPreviews ?? []).length > 0 && (
                            <span className="text-xs text-gray-500">+ video</span>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex gap-2">
                          {detailHref ? (
                            <Link
                              href={detailHref}
                              className="rounded-lg border px-2 py-1 text-gray-700 hover:bg-gray-50"
                            >
                              Inquiries
                            </Link>
                          ) : (
                            <button
                              className="rounded-lg border px-2 py-1 text-gray-400"
                              onClick={() =>
                                setErrorMsg("Missing listing id; unable to view inquiries.")
                              }
                            >
                              Inquiries
                            </button>
                          )}
                          <button
                            className="rounded-lg border px-2 py-1 hover:bg-gray-50"
                            onClick={() => {
                              setDrawer({ mode: "edit", row: r });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-lg border px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
                            onClick={async () => {
                              const id = r.id ?? r._id;
                              if (!id) {
                                setErrorMsg("Missing listing id; unable to delete.");
                                return;
                              }
                              const confirmDelete =
                                typeof window === "undefined"
                                  ? true
                                  : window.confirm("Delete this listing?");
                              if (!confirmDelete) return;
                              setErrorMsg(null);
                              setDeletingId(id);
                              try {
                                await deleteListing(id);
                                revokeRowPreviews(r);
                                setRows((prev) => prev.filter((x) => x._id !== r._id));
                              } catch (err: unknown) {
                                const message =
                                  err instanceof Error ? err.message : "Failed to delete listing";
                                setErrorMsg(message);
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === (r.id ?? r._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
          <span className="text-gray-500">
            {rows.length === 0 ? "0–0 of 0" : `1–${rows.length} of ${rows.length}`}
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50">
              Prev
            </button>
            <button className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Slide-over (Create/Edit) */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              if (!saving) setDrawer(null);
            }}
            aria-hidden
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl">
            <ListingForm
              mode={drawer.mode}
              initial={drawer.mode === "edit" ? drawer.row : undefined}
              onCancel={() => {
                if (!saving) setDrawer(null);
              }}
              onSubmit={async ({ listing: listingPatch, listingSnapshot, media }) => {
                const current = drawer;
                if (!current) return;
                setErrorMsg(null);
                setSaving(true);

                const snapshot = listingSnapshot as Partial<Row>;
                const snapshotForMedia = listingSnapshot as Partial<ListingFormValues>;
                const newImagePreviews = media.newImages.map((item) =>
                  URL.createObjectURL(item.file),
                );
                const newVideoPreviews = media.newVideos.map((file) => URL.createObjectURL(file));

                try {
                  if (current.mode === "create") {
                    const { listing: createdListing, raw } = await createListing({
                      listing: listingPatch,
                      media,
                    });

                    const createdRaw =
                      createdListing ??
                      (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null);

                    const listingId =
                      createdListing?.id ??
                      (createdRaw
                        ? (readString(createdRaw, "id") ?? readString(createdRaw, "_id"))
                        : undefined);

                    const fallbackId = listingId ?? crypto.randomUUID();

                    const rawStatus =
                      createdListing?.status ??
                      (createdRaw ? readString(createdRaw, "status") : undefined);
                    const status =
                      (rawStatus as Row["status"]) ||
                      (snapshot.status as Row["status"]) ||
                      ("Draft" as Row["status"]);

                    let nextRow: Row;
                    if (createdListing) {
                      nextRow = listingToRow(createdListing);
                    } else {
                      const createdRest =
                        createdRaw && typeof createdRaw === "object"
                          ? (Object.fromEntries(
                              Object.entries(createdRaw).filter(
                                ([key]) => key !== "status" && key !== "id" && key !== "_id",
                              ),
                            ) as Record<string, unknown>)
                          : {};
                      nextRow = {
                        _id: fallbackId,
                        id: listingId ?? fallbackId,
                        status,
                        ...(snapshot as Partial<Row>),
                        ...(createdRest as Partial<Row>),
                      } as Row;
                    }

                    nextRow._id = nextRow._id ?? fallbackId;
                    nextRow.id = nextRow.id ?? listingId ?? fallbackId;
                    nextRow.status = (nextRow.status as Row["status"]) ?? status;

                    const existingImageSources =
                      nextRow.imagePreviews && nextRow.imagePreviews.length > 0
                        ? nextRow.imagePreviews
                        : collectImagePreviewUrls(nextRow);
                    const existingVideoSources =
                      nextRow.videoPreviews && nextRow.videoPreviews.length > 0
                        ? nextRow.videoPreviews
                        : collectVideoPreviewUrls(nextRow);

                    nextRow.imagePreviews =
                      newImagePreviews.length > 0
                        ? newImagePreviews
                        : existingImageSources.length > 0
                          ? existingImageSources
                          : collectImagePreviewUrls(snapshotForMedia);
                    nextRow.videoPreviews =
                      newVideoPreviews.length > 0
                        ? newVideoPreviews
                        : existingVideoSources.length > 0
                          ? existingVideoSources
                          : collectVideoPreviewUrls(snapshotForMedia);

                    setRows((prev) => [nextRow, ...prev]);
                  } else {
                    const targetRow = current.row;
                    const listingId = targetRow.id ?? targetRow._id;
                    if (!listingId) {
                      throw new Error("Missing listing id; unable to update.");
                    }

                    const { listing: updatedListing, raw } = await updateListing(listingId, {
                      listing: listingPatch,
                      media,
                    });

                    const updatedRaw =
                      updatedListing ??
                      (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null);

                    let nextRow: Row;
                    if (updatedListing) {
                      nextRow = listingToRow(updatedListing);
                    } else if (updatedRaw) {
                      const updatedRecord = updatedRaw as Record<string, unknown>;
                      const updatedRest = Object.fromEntries(
                        Object.entries(updatedRecord).filter(
                          ([key]) => key !== "status" && key !== "id" && key !== "_id",
                        ),
                      ) as Record<string, unknown>;
                      const rawStatus = readString(updatedRecord, "status");
                      nextRow = {
                        _id: targetRow._id,
                        id:
                          readString(updatedRecord, "id") ??
                          readString(updatedRecord, "_id") ??
                          targetRow.id ??
                          listingId,
                        status:
                          (rawStatus as Row["status"]) ??
                          (snapshot.status as Row["status"]) ??
                          targetRow.status,
                        ...(snapshot as Partial<Row>),
                        ...(updatedRest as Partial<Row>),
                      } as Row;
                    } else {
                      nextRow = {
                        ...targetRow,
                        ...(snapshot as Partial<Row>),
                      } as Row;
                    }

                    nextRow._id = targetRow._id;
                    nextRow.id = nextRow.id ?? targetRow.id ?? listingId;
                    nextRow.status =
                      (nextRow.status as Row["status"]) ??
                      (snapshot.status as Row["status"]) ??
                      targetRow.status;

                    const existingImageSources =
                      nextRow.imagePreviews && nextRow.imagePreviews.length > 0
                        ? nextRow.imagePreviews
                        : collectImagePreviewUrls(nextRow);
                    const existingVideoSources =
                      nextRow.videoPreviews && nextRow.videoPreviews.length > 0
                        ? nextRow.videoPreviews
                        : collectVideoPreviewUrls(nextRow);

                    nextRow.imagePreviews =
                      newImagePreviews.length > 0
                        ? newImagePreviews
                        : existingImageSources.length > 0
                          ? existingImageSources
                          : targetRow.imagePreviews;
                    nextRow.videoPreviews =
                      newVideoPreviews.length > 0
                        ? newVideoPreviews
                        : existingVideoSources.length > 0
                          ? existingVideoSources
                          : targetRow.videoPreviews;

                    revokeRowPreviews(targetRow);
                    setRows((prev) =>
                      prev.map((existing) => (existing._id === targetRow._id ? nextRow : existing)),
                    );
                  }

                  setDrawer(null);
                } catch (err: unknown) {
                  if (newImagePreviews.length > 0) revokeUrls(newImagePreviews);
                  if (newVideoPreviews.length > 0) revokeUrls(newVideoPreviews);
                  const message =
                    err instanceof Error
                      ? err.message
                      : current.mode === "edit"
                        ? "Failed to update listing"
                        : "Failed to create listing";
                  setErrorMsg(message);
                } finally {
                  setSaving(false);
                }
              }}
              submitting={saving}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function listingToRow(listing: Listing): Row {
  const imagePreviews =
    listing.images?.map((media) => media.url).filter((url): url is string => Boolean(url)) ?? [];
  const videoPreviews = listing.videoUrls?.filter((url): url is string => Boolean(url)) ?? [];

  return {
    _id: listing.id ?? crypto.randomUUID(),
    id: listing.id ?? undefined,
    title: listing.title ?? "",
    slug: listing.slug ?? undefined,
    externalId: listing.externalId ?? undefined,
    category: listing.category ?? "",
    transactionType: listing.transactionType ?? "",
    status: listing.status ?? "",
    constructionStatus: listing.constructionStatus ?? undefined,
    price: Number(listing.price ?? 0),
    pricePerSqft: listing.pricePerSqft ?? undefined,
    description: listing.description ?? undefined,
    subtitle: listing.subtitle ?? undefined,
    highlights: listing.highlights ?? undefined,
    ownership: listing.ownership ?? undefined,
    yearBuilt: listing.yearBuilt ?? null,
    possessionDate: listing.possessionDate ?? null,
    maintenanceTerms: listing.maintenanceTerms ?? null,
    carpetArea: listing.carpetArea
      ? { value: listing.carpetArea.value, unit: listing.carpetArea.unit }
      : undefined,
    builtUpArea: listing.builtUpArea
      ? { value: listing.builtUpArea.value, unit: listing.builtUpArea.unit }
      : undefined,
    superBuiltUpArea: listing.superBuiltUpArea
      ? { value: listing.superBuiltUpArea.value, unit: listing.superBuiltUpArea.unit }
      : undefined,
    landArea: listing.landArea
      ? { value: listing.landArea.value, unit: listing.landArea.unit }
      : undefined,
    plotLengthFt: listing.plotLengthFt ?? undefined,
    plotWidthFt: listing.plotWidthFt ?? undefined,
    frontageFt: listing.frontageFt ?? undefined,
    roadWidthFt: listing.roadWidthFt ?? undefined,
    plotFacing: listing.plotFacing ?? undefined,
    cornerPlot: listing.cornerPlot ?? null,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    balconies: listing.balconies ?? null,
    furnishing: listing.furnishing ?? null,
    floorNumber: listing.floorNumber ?? null,
    totalFloors: listing.totalFloors ?? null,
    hasLift: listing.hasLift ?? null,
    coveredParkingCount: listing.coveredParkingCount ?? null,
    openParkingCount: listing.openParkingCount ?? null,
    vaastuCompliant: listing.vaastuCompliant ?? null,
    unitFacing: listing.unitFacing ?? undefined,
    priceBreakup: listing.priceBreakup ?? undefined,
    address: listing.address ?? undefined,
    addressParts: listing.addressParts ?? undefined,
    geo: listing.geo ?? null,
    societyName: listing.societyName ?? undefined,
    projectName: listing.projectName ?? undefined,
    reraId: listing.reraId ?? undefined,
    reraRegistered: listing.reraRegistered ?? null,
    amenities: listing.amenities ?? undefined,
    tags: listing.tags ?? undefined,
    images: listing.images?.map((image) => ({
      url: image.url,
      alt: image.alt ?? undefined,
      isPrimary: image.isPrimary ?? undefined,
    })),
    videoUrls: listing.videoUrls ?? undefined,
    virtualTourUrl: listing.virtualTourUrl ?? undefined,
    documents: listing.documents?.map((doc) => ({
      label: doc.label,
      url: doc.url,
    })),
    listedByType: listing.listedByType ?? null,
    listedByName: listing.listedByName ?? undefined,
    contactNumber: listing.contactNumber ?? undefined,
    contactEmail: listing.contactEmail ?? undefined,
    whatsAppNumber: listing.whatsAppNumber ?? undefined,
    verified: listing.verified ?? null,
    broker: listing.broker
      ? {
          id: listing.broker.id ?? undefined,
          name: listing.broker.name ?? undefined,
          phone: listing.broker.phone ?? undefined,
          email: listing.broker.email ?? undefined,
          type: listing.broker.type ?? null,
        }
      : null,
    seo: listing.seo
      ? {
          title: listing.seo.title ?? undefined,
          description: listing.seo.description ?? undefined,
          keywords: listing.seo.keywords ?? undefined,
        }
      : undefined,
    isFeatured: listing.isFeatured ?? null,
    imagePreviews,
    videoPreviews,
  };
}

function collectImagePreviewUrls(
  source: Pick<ListingFormValues, "images"> & Partial<Pick<Row, "imagePreviews">>,
): string[] {
  if (source.imagePreviews && source.imagePreviews.length > 0) {
    return source.imagePreviews;
  }
  const images = source.images ?? [];
  return images
    ?.map((entry) => entry?.url)
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

function collectVideoPreviewUrls(
  source: Pick<ListingFormValues, "videoUrls"> & Partial<Pick<Row, "videoPreviews">>,
): string[] {
  if (source.videoPreviews && source.videoPreviews.length > 0) {
    return source.videoPreviews;
  }
  return (
    source.videoUrls?.filter((url): url is string => typeof url === "string" && url.length > 0) ??
    []
  );
}

function revokeRowPreviews(row: Row) {
  (row.imagePreviews ?? []).forEach((url) => {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
  (row.videoPreviews ?? []).forEach((url) => {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
}

function revokeUrls(urls: string[]) {
  urls.forEach((url) => {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
}

/* -------- helpers ---------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left font-semibold">{children}</th>;
}
function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td className={`px-3 py-2 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function formatStatus(status?: string | null) {
  const label = getOptionLabel(LISTING_STATUS_OPTIONS, status);
  if (label) return label;
  if (!status) return undefined;
  return toTitleCase(status);
}

function getOptionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value?: string | null,
) {
  if (!value) return undefined;
  return options.find((option) => option.value === value)?.label;
}

function toTitleCase(input: string) {
  return input
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

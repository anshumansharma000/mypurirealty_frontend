"use client";

import type { ListingMediaPayload } from "@/features/listings/api/createListing";
import { getListing } from "@/features/listings/api/getListing";
import {
  LISTING_FORM_AREA_UNITS,
  type ListingFormValues,
  createListingFormState,
} from "@/features/listings/models/listingForm";
import {
  HYBRID_PLOT_CATEGORY_VALUES,
  LAND_ONLY_CATEGORY_VALUES,
  LISTING_CATEGORY_OPTIONS,
  LISTING_CONSTRUCTION_STATUS_OPTIONS,
  LISTING_CONTACT_TYPE_OPTIONS,
  LISTING_DIRECTION_OPTIONS,
  LISTING_FURNISHING_OPTIONS,
  LISTING_STATUS_OPTIONS,
  LISTING_TRANSACTION_TYPE_OPTIONS,
  RESIDENTIAL_UNIT_CATEGORY_VALUES,
} from "@/features/listings/models/listingOptions";
import type { AreaUnit, Listing } from "@/shared/types";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

export type { ListingFormValues } from "@/features/listings/models/listingForm";

type ExistingImageState = {
  id: string;
  url: string;
  alt: string;
  removed: boolean;
};

type NewImageState = {
  file: File;
  alt: string;
  replacesId?: string;
};

type ExistingVideoState = {
  url: string;
  removed: boolean;
};

type PrimarySelection = { type: "existing"; id: string } | { type: "new"; index: number } | null;

type ImageState = {
  existing: ExistingImageState[];
  newItems: NewImageState[];
  primary: PrimarySelection;
};

type ImageAction =
  | { type: "reset"; payload: ImageState }
  | { type: "add-new"; files: File[] }
  | { type: "set-existing-alt"; id: string; alt: string }
  | { type: "set-new-alt"; index: number; alt: string }
  | { type: "set-primary-existing"; id: string }
  | { type: "set-primary-new"; index: number }
  | { type: "remove-existing"; id: string }
  | { type: "replace-existing"; id: string; file: File }
  | { type: "remove-new"; index: number };

/** Props */
export default function ListingForm({
  initial,
  listingId,
  onCancel,
  onSubmit,
  submitting,
  mode = "create",
}: {
  initial?: (Partial<ListingFormValues> & { id?: string; _id?: string }) | null;
  listingId?: string;
  onCancel: () => void;
  onSubmit: (data: {
    listing: Record<string, unknown>;
    listingSnapshot: Record<string, unknown>;
    media: ListingMediaPayload;
  }) => void;
  submitting?: boolean;
  mode?: "create" | "edit";
}) {
  // --- form state (defaults aligned to DTO expectations)
  const [form, setForm] = useState<ListingFormValues>(() =>
    createListingFormState(initial ?? undefined),
  );
  const [priceInput, setPriceInput] = useState(() =>
    initial?.price !== undefined && initial?.price !== null ? String(initial.price) : "",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imageState, dispatchImages] = useReducer(imageReducer, form, (initialForm) => {
    const info = deriveExistingImages(initialForm);
    const initialPrimary: PrimarySelection | null =
      info.primaryId && info.images.some((image) => image.id === info.primaryId)
        ? { type: "existing", id: info.primaryId }
        : info.images.length > 0
          ? { type: "existing", id: info.images[0].id }
          : null;
    return {
      existing: info.images,
      newItems: [],
      primary: initialPrimary,
    };
  });
  const existingImages = imageState.existing;
  const newImages = imageState.newItems;
  const primarySelection = imageState.primary;
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [existingVideos, setExistingVideos] = useState<ExistingVideoState[]>(() =>
    deriveExistingVideos(form),
  );
  const [removeVideoUrls, setRemoveVideoUrls] = useState<string[]>([]);
  const [externalVideoUrls, setExternalVideoUrls] = useState<string[]>([]);
  const [externalVideoInput, setExternalVideoInput] = useState("");
  const newImageFiles = useMemo(() => newImages.map((item) => item.file), [newImages]);
  const imagePreviews = useObjectUrls(newImageFiles);
  const videoPreviews = useObjectUrls(newVideos);
  const initialNormalizedRef = useRef<Record<string, unknown>>({});
  const [ready, setReady] = useState(mode !== "edit");
  const [reloadToken, setReloadToken] = useState(0);

  const effectiveListingId = useMemo(() => {
    if (listingId) return listingId;
    if (initial && typeof initial === "object") {
      const fromId = (initial as { id?: string | null }).id;
      if (fromId && typeof fromId === "string") return fromId;
      const fromLegacy = (initial as { _id?: string | null })._id;
      if (fromLegacy && typeof fromLegacy === "string") return fromLegacy;
    }
    return undefined;
  }, [initial, listingId]);

  const applyFormState = useCallback((nextForm: ListingFormValues) => {
    setForm(nextForm);
    const priceString =
      nextForm.price !== undefined && nextForm.price !== null ? String(nextForm.price) : "";
    setPriceInput(priceString);
    const { images: existing, primaryId } = deriveExistingImages(nextForm);
    const candidatePrimary: PrimarySelection =
      primaryId && existing.some((image) => image.id === primaryId)
        ? { type: "existing", id: primaryId }
        : existing.length > 0
          ? { type: "existing", id: existing[0].id }
          : null;
    const nextPrimary = ensurePrimarySelection(existing, [], candidatePrimary);
    dispatchImages({
      type: "reset",
      payload: {
        existing,
        newItems: [],
        primary: nextPrimary,
      },
    });
    setNewVideos([]);
    const videos = deriveExistingVideos(nextForm);
    setExistingVideos(videos);
    setRemoveVideoUrls([]);
    setExternalVideoUrls([]);
    setExternalVideoInput("");
      initialNormalizedRef.current = serializeListingForm({
        form: nextForm,
        priceInput: priceString,
        existingImages: existing,
        existingVideos: videos,
        externalVideoUrls: [],
        primarySelection: nextPrimary,
      });
  }, []);

  useEffect(() => {
    if (mode !== "edit") {
      const baseForm = createListingFormState(initial ?? undefined);
      applyFormState(baseForm);
      setReady(true);
      return;
    }

    setReady(false);

    const id = effectiveListingId;
    if (!id) {
      setLoadError("Missing listing id; unable to load listing.");
      return;
    }

    let cancelled = false;
    setLoadError(null);

    (async () => {
      try {
        const listing = await getListing(id);
        if (cancelled) return;
        const nextForm = createListingFormState(listingToFormSeed(listing));
        applyFormState(nextForm);
        setReady(true);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load listing details.";
        setLoadError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyFormState, effectiveListingId, initial, mode, reloadToken]);

  const handleNewImagesSelected = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
      if (files.length === 0) return;
      dispatchImages({ type: "add-new", files });
    },
    [dispatchImages],
  );

  const handleExistingImageAltChange = useCallback(
    (id: string, alt: string) => {
      dispatchImages({ type: "set-existing-alt", id, alt });
    },
    [dispatchImages],
  );

  const handleNewImageAltChange = useCallback(
    (index: number, alt: string) => {
      dispatchImages({ type: "set-new-alt", index, alt });
    },
    [dispatchImages],
  );

  const handleRemoveExistingImage = useCallback(
    (id: string) => {
      dispatchImages({ type: "remove-existing", id });
    },
    [dispatchImages],
  );

  const handleReplaceExistingImage = useCallback(
    (id: string, fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const file = Array.from(fileList).find((entry) => entry.type.startsWith("image/"));
      if (!file) return;
      dispatchImages({ type: "replace-existing", id, file });
    },
    [dispatchImages],
  );

  const handleRemoveNewImage = useCallback(
    (index: number) => {
      dispatchImages({ type: "remove-new", index });
    },
    [dispatchImages],
  );

  const handleSetPrimaryExisting = useCallback(
    (id: string) => {
      dispatchImages({ type: "set-primary-existing", id });
    },
    [dispatchImages],
  );

  const handleSetPrimaryNew = useCallback(
    (index: number) => {
      dispatchImages({ type: "set-primary-new", index });
    },
    [dispatchImages],
  );

  const handleAddNewVideos = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((file) => file.type.startsWith("video/"));
    if (files.length === 0) return;
    setNewVideos((prev) => [...prev, ...files]);
  }, []);

  const handleRemoveNewVideo = useCallback((index: number) => {
    setNewVideos((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const handleRemoveExistingVideo = useCallback((url: string) => {
    const trimmed = url.trim();
    setExistingVideos((prev) =>
      prev.map((video) => (video.url === trimmed ? { ...video, removed: true } : video)),
    );
    setRemoveVideoUrls((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });
  }, []);

  const handleAddExternalVideo = useCallback(() => {
    const trimmed = externalVideoInput.trim();
    if (!trimmed) return;
    setExternalVideoUrls((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setExternalVideoInput("");
  }, [externalVideoInput]);

  const handleRemoveExternalVideo = useCallback((url: string) => {
    setExternalVideoUrls((prev) => prev.filter((entry) => entry !== url));
  }, []);
  const headingText = mode === "edit" ? "Edit Listing" : "Create Listing";
  const submitLabel = submitting ? "Saving…" : mode === "edit" ? "Update" : "Save";

  const selectedCategory = form.category ?? "";
  const hasSelectedCategory = selectedCategory !== "";
  const isLandOnlyCategory = LAND_ONLY_CATEGORY_VALUES.includes(
    selectedCategory as (typeof LAND_ONLY_CATEGORY_VALUES)[number],
  );
  const isHybridPlotCategory = HYBRID_PLOT_CATEGORY_VALUES.includes(
    selectedCategory as (typeof HYBRID_PLOT_CATEGORY_VALUES)[number],
  );
  const isResidentialUnitCategory = RESIDENTIAL_UNIT_CATEGORY_VALUES.includes(
    selectedCategory as (typeof RESIDENTIAL_UNIT_CATEGORY_VALUES)[number],
  );
  const showUnitDetails = !hasSelectedCategory || isResidentialUnitCategory;
  const showPlotDetails = !hasSelectedCategory || isLandOnlyCategory || isHybridPlotCategory;
  const showInteriorAreas = !hasSelectedCategory || !isLandOnlyCategory;
  const showAnyArea = showInteriorAreas || showPlotDetails;

  useEffect(() => {
    if (!selectedCategory) return;
    setForm((prev) => {
      if ((prev.category ?? "") !== selectedCategory) return prev;

      let changed = false;
      const next: ListingFormValues = { ...prev };

      if (!showUnitDetails) {
        if (next.bedrooms !== null) {
          next.bedrooms = null;
          changed = true;
        }
        if (next.bathrooms !== null) {
          next.bathrooms = null;
          changed = true;
        }
        if (next.balconies !== null) {
          next.balconies = null;
          changed = true;
        }
        if (next.furnishing != null) {
          next.furnishing = null;
          changed = true;
        }
        if (next.floorNumber !== null) {
          next.floorNumber = null;
          changed = true;
        }
        if (next.totalFloors !== null) {
          next.totalFloors = null;
          changed = true;
        }
        if (next.hasLift !== null) {
          next.hasLift = null;
          changed = true;
        }
        if (next.coveredParkingCount !== null) {
          next.coveredParkingCount = null;
          changed = true;
        }
        if (next.openParkingCount !== null) {
          next.openParkingCount = null;
          changed = true;
        }
        if (next.vaastuCompliant !== null) {
          next.vaastuCompliant = null;
          changed = true;
        }
        if (next.unitFacing != null) {
          next.unitFacing = null;
          changed = true;
        }
      }

      if (!showPlotDetails) {
        if (next.plotLengthFt !== undefined) {
          next.plotLengthFt = undefined;
          changed = true;
        }
        if (next.plotWidthFt !== undefined) {
          next.plotWidthFt = undefined;
          changed = true;
        }
        if (next.frontageFt !== undefined) {
          next.frontageFt = undefined;
          changed = true;
        }
        if (next.roadWidthFt !== undefined) {
          next.roadWidthFt = undefined;
          changed = true;
        }
        if (next.plotFacing != null) {
          next.plotFacing = null;
          changed = true;
        }
        if (next.cornerPlot !== null) {
          next.cornerPlot = null;
          changed = true;
        }
        if (next.landArea !== undefined) {
          next.landArea = undefined;
          changed = true;
        }
      }

      if (!showInteriorAreas) {
        if (next.carpetArea !== undefined) {
          next.carpetArea = undefined;
          changed = true;
        }
        if (next.builtUpArea !== undefined) {
          next.builtUpArea = undefined;
          changed = true;
        }
        if (next.superBuiltUpArea !== undefined) {
          next.superBuiltUpArea = undefined;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [selectedCategory, showUnitDetails, showPlotDetails, showInteriorAreas]);

  const handlePriceChange = (value: string) => {
    setPriceInput(value);
    const numeric = value === "" ? 0 : Number(value);
    setForm((prev) => ({
      ...prev,
      price: Number.isNaN(numeric) ? prev.price : numeric,
    }));
  };

  // helpers: set area as number or {value, unit}
  const setArea = (
    key: "carpetArea" | "builtUpArea" | "superBuiltUpArea" | "landArea",
    value?: number,
    unit?: AreaUnit,
  ) => {
    setForm((f) => {
      if (!value && value !== 0) return { ...f, [key]: undefined };
      if (!unit) return { ...f, [key]: value };
      return { ...f, [key]: { value, unit } };
    });
  };

  const areaGetter = (area?: ListingFormValues["carpetArea"]) => {
    if (typeof area === "number") return { value: area, unit: "sqft" as AreaUnit };
    if (area && typeof area === "object") return { value: area.value, unit: area.unit as AreaUnit };
    return { value: undefined as unknown as number, unit: "sqft" as AreaUnit };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalized = serializeListingForm({
      form,
      priceInput,
      existingImages,
      existingVideos,
      externalVideoUrls,
      primarySelection,
    });
    const baseline = initialNormalizedRef.current ?? {};
    const listingPatch = buildMergePatch(normalized, baseline);
    const trimmedExternalUrls = Array.from(
      new Set(externalVideoUrls.map((url) => url.trim()).filter(Boolean)),
    );
    const removedImageIds = Array.from(
      new Set(existingImages.filter((image) => image.removed).map((image) => image.id)),
    );
    const removedVideos = Array.from(
      new Set(removeVideoUrls.map((url) => url.trim()).filter(Boolean)),
    );
    const primaryNewIndex = primarySelection?.type === "new" ? primarySelection.index : -1;

    const mediaPayload: ListingMediaPayload = {
      newImages: newImages.map((image, index) => ({
        file: image.file,
        alt: image.alt,
        isPrimary: primarySelection?.type === "new" && primarySelection.index === index,
        replacesId: image.replacesId,
      })),
      newVideos,
      externalVideoUrls: trimmedExternalUrls,
      removeImageIds: removedImageIds,
      removeVideoUrls: removedVideos,
      primaryNewImageIndex: primaryNewIndex >= 0 ? primaryNewIndex : undefined,
    };

    onSubmit({
      listing: listingPatch,
      listingSnapshot: normalized,
      media: mediaPayload,
    });
  };

  if (!ready) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        {loadError ? (
          <>
            <p className="text-sm text-red-600">{loadError}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => setReloadToken((token) => token + 1)}
              >
                Retry
              </button>
              <button
                type="button"
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={onCancel}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-500">Loading listing…</span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="text-lg font-semibold">{headingText}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Basics */}
        <Section title="Basics">
          <Grid cols={2}>
            <Field label="Title" required>
              <input
                className="w-full rounded-xl border px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Field>
            <TextField
              label="Subtitle"
              value={form.subtitle ?? ""}
              onChange={(v) => setForm({ ...form, subtitle: v })}
            />
            <Field label="Price (₹)" required>
              <input
                type="number"
                className="w-full rounded-xl border px-3 py-2"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                min={0}
                inputMode="decimal"
                required
              />
            </Field>
            <NumField
              label="Price per Sqft"
              value={form.pricePerSqft}
              onChange={(v) => setForm({ ...form, pricePerSqft: v })}
            />
            <SelectField
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v || undefined })}
              options={LISTING_CATEGORY_OPTIONS}
              placeholder="Select category"
            />
            <SelectField
              label="Transaction Type"
              value={form.transactionType}
              onChange={(v) => setForm({ ...form, transactionType: v || undefined })}
              options={LISTING_TRANSACTION_TYPE_OPTIONS}
              placeholder="Select transaction type"
            />
            <SelectField
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v || undefined })}
              options={LISTING_STATUS_OPTIONS}
              placeholder="Select status"
            />
            <SelectField
              label="Construction Status"
              value={form.constructionStatus}
              onChange={(v) => setForm({ ...form, constructionStatus: v || undefined })}
              options={LISTING_CONSTRUCTION_STATUS_OPTIONS}
              placeholder="Select construction status"
            />
            <TextField
              label="Slug"
              value={form.slug ?? ""}
              onChange={(v) => setForm({ ...form, slug: v })}
            />
            <TextField
              label="External ID"
              value={form.externalId ?? ""}
              onChange={(v) => setForm({ ...form, externalId: v })}
            />
            <TextField
              label="Ownership"
              value={form.ownership ?? ""}
              onChange={(v) => setForm({ ...form, ownership: v })}
            />
            <NumField
              label="Year Built"
              value={form.yearBuilt}
              onChange={(v) => setForm({ ...form, yearBuilt: v })}
            />
            <Field label="Possession Date">
              <input
                type="date"
                className="w-full rounded-xl border px-3 py-2"
                value={form.possessionDate ?? ""}
                onChange={(e) => setForm({ ...form, possessionDate: e.target.value })}
              />
            </Field>
            <TextField
              label="Maintenance Terms"
              value={form.maintenanceTerms ?? ""}
              onChange={(v) => setForm({ ...form, maintenanceTerms: v })}
            />
            <Field label="Description" colSpan>
              <textarea
                rows={4}
                className="w-full rounded-xl border px-3 py-2"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <Field label="Highlights (comma-separated)" colSpan>
              <textarea
                rows={3}
                className="w-full rounded-xl border px-3 py-2"
                value={form.highlights === null ? "" : (form.highlights ?? []).join(", ")}
                onChange={(e) => setForm({ ...form, highlights: splitCSV(e.target.value) })}
              />
            </Field>
          </Grid>
        </Section>

        {/* Areas */}
        {showAnyArea && (
          <Section title="Areas">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {showInteriorAreas && (
                <>
                  <AreaInput
                    key="carpetArea"
                    label="Carpet Area"
                    valueUnit={areaGetter(form.carpetArea)}
                    onChange={(val, unit) => setArea("carpetArea", val, unit)}
                  />
                  <AreaInput
                    key="builtUpArea"
                    label="Built-up Area"
                    valueUnit={areaGetter(form.builtUpArea)}
                    onChange={(val, unit) => setArea("builtUpArea", val, unit)}
                  />
                  <AreaInput
                    key="superBuiltUpArea"
                    label="Super Built-up Area"
                    valueUnit={areaGetter(form.superBuiltUpArea)}
                    onChange={(val, unit) => setArea("superBuiltUpArea", val, unit)}
                  />
                </>
              )}
              {showPlotDetails && (
                <AreaInput
                  key="landArea"
                  label="Land Area"
                  valueUnit={areaGetter(form.landArea)}
                  onChange={(val, unit) => setArea("landArea", val, unit)}
                />
              )}
            </div>
          </Section>
        )}

        {/* Unit details */}
        {showUnitDetails && (
          <Section title="Unit Details">
            <Grid cols={4}>
              <NumField
                label="Bedrooms"
                value={form.bedrooms}
                onChange={(v) => setForm({ ...form, bedrooms: v })}
              />
              <NumField
                label="Bathrooms"
                value={form.bathrooms}
                onChange={(v) => setForm({ ...form, bathrooms: v })}
              />
              <NumField
                label="Balconies"
                value={form.balconies}
                onChange={(v) => setForm({ ...form, balconies: v })}
              />
              <SelectField
                label="Furnishing"
                value={form.furnishing}
                onChange={(v) => setForm({ ...form, furnishing: v || null })}
                options={LISTING_FURNISHING_OPTIONS}
                placeholder="Select furnishing"
              />

              <NumField
                label="Floor Number"
                value={form.floorNumber}
                onChange={(v) => setForm({ ...form, floorNumber: v })}
              />
              <NumField
                label="Total Floors"
                value={form.totalFloors}
                onChange={(v) => setForm({ ...form, totalFloors: v })}
              />
              <BoolField
                label="Has Lift"
                value={form.hasLift}
                onChange={(v) => setForm({ ...form, hasLift: v })}
              />
              <SelectField
                label="Unit Facing"
                value={form.unitFacing}
                onChange={(v) => setForm({ ...form, unitFacing: v || null })}
                options={LISTING_DIRECTION_OPTIONS}
                placeholder="Select direction"
              />

              <NumField
                label="Covered Parking"
                value={form.coveredParkingCount}
                onChange={(v) => setForm({ ...form, coveredParkingCount: v })}
              />
              <NumField
                label="Open Parking"
                value={form.openParkingCount}
                onChange={(v) => setForm({ ...form, openParkingCount: v })}
              />
              <BoolField
                label="Vastu Compliant"
                value={form.vaastuCompliant}
                onChange={(v) => setForm({ ...form, vaastuCompliant: v })}
              />
            </Grid>
          </Section>
        )}

        {/* Plot details */}
        {showPlotDetails && (
          <Section title="Plot Details">
            <Grid cols={4}>
              <NumField
                label="Plot Length (ft)"
                value={form.plotLengthFt}
                onChange={(v) => setForm({ ...form, plotLengthFt: v ?? undefined })}
              />
              <NumField
                label="Plot Width (ft)"
                value={form.plotWidthFt}
                onChange={(v) => setForm({ ...form, plotWidthFt: v ?? undefined })}
              />
              <NumField
                label="Frontage (ft)"
                value={form.frontageFt}
                onChange={(v) => setForm({ ...form, frontageFt: v ?? undefined })}
              />
              <NumField
                label="Road Width (ft)"
                value={form.roadWidthFt}
                onChange={(v) => setForm({ ...form, roadWidthFt: v ?? undefined })}
              />

              <SelectField
                label="Plot Facing"
                value={form.plotFacing}
                onChange={(v) => setForm({ ...form, plotFacing: v || null })}
                options={LISTING_DIRECTION_OPTIONS}
                placeholder="Select direction"
              />
              <BoolField
                label="Corner Plot"
                value={form.cornerPlot}
                onChange={(v) => setForm({ ...form, cornerPlot: v })}
              />
            </Grid>
          </Section>
        )}

        {/* Pricing breakdown */}
        <Section title="Price Breakdown">
          <Grid cols={4}>
            <PB field="basePrice" label="Base Price" form={form} setForm={setForm} />
            <PB
              field="maintenanceMonthly"
              label="Maintenance (Monthly)"
              form={form}
              setForm={setForm}
            />
            <PB field="parkingCharges" label="Parking Charges" form={form} setForm={setForm} />
            <PB
              field="clubMembershipCharges"
              label="Club Membership"
              form={form}
              setForm={setForm}
            />
            <PB
              field="registrationCharges"
              label="Registration Charges"
              form={form}
              setForm={setForm}
            />
            <PB field="gstPercent" label="GST (%)" form={form} setForm={setForm} />
            <PBBool field="negotiable" label="Negotiable" form={form} setForm={setForm} />
            <PBBool field="allInclusive" label="All Inclusive" form={form} setForm={setForm} />
            <PB field="bookingAmount" label="Booking Amount" form={form} setForm={setForm} />
          </Grid>
        </Section>

        {/* Address */}
        <Section title="Address">
          <Grid cols={2}>
            <TextField
              label="Address (freeform)"
              value={form.address ?? ""}
              onChange={(v) => setForm({ ...form, address: v })}
              colSpan
            />
            <TextField
              label="Line 1"
              value={form.addressParts?.line1 ?? ""}
              onChange={(v) => setAddr("line1", v, form, setForm)}
            />
            <TextField
              label="Line 2"
              value={form.addressParts?.line2 ?? ""}
              onChange={(v) => setAddr("line2", v, form, setForm)}
            />
            <TextField
              label="Locality"
              value={form.addressParts?.locality ?? ""}
              onChange={(v) => setAddr("locality", v, form, setForm)}
            />
            <TextField
              label="Landmark"
              value={form.addressParts?.landmark ?? ""}
              onChange={(v) => setAddr("landmark", v, form, setForm)}
            />
            <TextField
              label="City"
              value={form.addressParts?.city ?? ""}
              onChange={(v) => setAddr("city", v, form, setForm)}
            />
            <TextField
              label="State"
              value={form.addressParts?.state ?? ""}
              onChange={(v) => setAddr("state", v, form, setForm)}
            />
            <TextField
              label="Pincode"
              value={form.addressParts?.pincode ?? ""}
              onChange={(v) => setAddr("pincode", v, form, setForm)}
            />
          </Grid>
        </Section>

        {/* Media (with remove controls) */}
        <Section title="Media">
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleNewImagesSelected(e.target.files);
                    if (e.target) e.target.value = "";
                  }}
                />
              </div>
              {existingImages.filter((image) => !image.removed).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {existingImages
                    .filter((image) => !image.removed)
                    .map((image) => {
                      const isPrimary =
                        primarySelection?.type === "existing" && primarySelection.id === image.id;
                      return (
                        <div key={image.id} className="rounded-lg border p-3">
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image.url}
                              alt={image.alt || ""}
                              className="h-28 w-full rounded object-cover"
                            />
                            {isPrimary && (
                              <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="mt-3 space-y-2 text-xs">
                            <input
                              className="w-full rounded-lg border px-2 py-1 text-sm"
                              placeholder="Alt text"
                              value={image.alt}
                              onChange={(e) =>
                                handleExistingImageAltChange(image.id, e.target.value)
                              }
                            />
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className={`rounded-lg border px-2 py-1 ${
                                  isPrimary ? "bg-black text-white" : "text-xs hover:bg-gray-50"
                                }`}
                                onClick={() => handleSetPrimaryExisting(image.id)}
                              >
                                {isPrimary ? "Primary image" : "Set primary"}
                              </button>
                              <label className="cursor-pointer rounded-lg border px-2 py-1 text-xs hover:bg-gray-50">
                                Replace
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(event) => {
                                    handleReplaceExistingImage(image.id, event.target.files);
                                    if (event.target) event.target.value = "";
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                className="rounded-lg border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveExistingImage(image.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No existing images.</p>
              )}
            </div>

            {newImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">New uploads</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {newImages.map((image, index) => {
                    const preview = imagePreviews[index];
                    const isPrimary =
                      primarySelection?.type === "new" && primarySelection.index === index;
                    return (
                      <div key={`${image.file.name}-${index}`} className="rounded-lg border p-3">
                        {preview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt=""
                              className="h-28 w-full rounded object-cover"
                            />
                          </>
                        ) : (
                          <div className="flex h-28 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                            Preview unavailable
                          </div>
                        )}
                        <div className="mt-3 space-y-2 text-xs">
                          <input
                            className="w-full rounded-lg border px-2 py-1 text-sm"
                            placeholder="Alt text"
                            value={image.alt}
                            onChange={(e) => handleNewImageAltChange(index, e.target.value)}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className={`rounded-lg border px-2 py-1 ${
                                isPrimary ? "bg-black text-white" : "text-xs hover:bg-gray-50"
                              }`}
                              onClick={() => handleSetPrimaryNew(index)}
                            >
                              {isPrimary ? "Primary image" : "Set primary"}
                            </button>
                            <button
                              type="button"
                              className="rounded-lg border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveNewImage(index)}
                            >
                              Remove
                            </button>
                          </div>
                          {image.replacesId && (
                            <p className="text-xs text-gray-500">Replaces existing image</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium">Existing videos</label>
              {existingVideos.filter((video) => !video.removed).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {existingVideos
                    .filter((video) => !video.removed)
                    .map((video) => (
                      <div key={video.url} className="rounded-lg border p-3">
                        <div className="aspect-video overflow-hidden rounded bg-black/5">
                          <video
                            src={video.url}
                            controls
                            className="h-full w-full rounded object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="truncate pr-2" title={video.url}>
                            {video.url}
                          </span>
                          <button
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => handleRemoveExistingVideo(video.url)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No existing videos.</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Upload new videos</label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  handleAddNewVideos(e.target.files);
                  if (e.target) e.target.value = "";
                }}
              />
              {videoPreviews.length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {videoPreviews.map((src, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <video src={src} controls className="w-full rounded" />
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="truncate pr-2">{newVideos[i]?.name}</span>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => handleRemoveNewVideo(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">External video URLs</label>
              <div className="flex gap-2">
                <input
                  value={externalVideoInput}
                  onChange={(e) => setExternalVideoInput(e.target.value)}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  placeholder="https://example.com/video"
                />
                <button
                  type="button"
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                  onClick={handleAddExternalVideo}
                  disabled={externalVideoInput.trim().length === 0}
                >
                  Add
                </button>
              </div>
              {externalVideoUrls.length > 0 && (
                <ul className="space-y-2 text-xs">
                  {externalVideoUrls.map((url) => (
                    <li
                      key={url}
                      className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                    >
                      <span className="truncate pr-2">{url}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => handleRemoveExternalVideo(url)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <TextField
              label="Virtual Tour URL"
              value={form.virtualTourUrl ?? ""}
              onChange={(v) => setForm({ ...form, virtualTourUrl: v })}
            />
          </div>
        </Section>

        {/* Meta & Contacts (collapsed by default using <details>) */}
        <DetailsSection summary="More Details (RERA, Amenities, Contact)">
          <Grid cols={3}>
            <TextField
              label="Society Name"
              value={form.societyName ?? ""}
              onChange={(v) => setForm({ ...form, societyName: v })}
            />
            <TextField
              label="Project Name"
              value={form.projectName ?? ""}
              onChange={(v) => setForm({ ...form, projectName: v })}
            />
            <TextField
              label="RERA ID"
              value={form.reraId ?? ""}
              onChange={(v) => setForm({ ...form, reraId: v })}
            />
            <BoolField
              label="RERA Registered"
              value={form.reraRegistered}
              onChange={(v) => setForm({ ...form, reraRegistered: v })}
            />

            <TextField
              label="Amenities (comma-separated)"
              value={(form.amenities ?? []).join(", ")}
              onChange={(v) => setForm({ ...form, amenities: splitCSV(v) })}
              colSpan
            />
            <TextField
              label="Tags (comma-separated)"
              value={(form.tags ?? []).join(", ")}
              onChange={(v) => setForm({ ...form, tags: splitCSV(v) })}
              colSpan
            />

            <SelectField
              label="Listed By Type"
              value={form.listedByType}
              onChange={(v) =>
                setForm({
                  ...form,
                  listedByType: (v || null) as ListingFormValues["listedByType"],
                })
              }
              options={LISTING_CONTACT_TYPE_OPTIONS}
              placeholder="Select contact type"
            />
            <TextField
              label="Listed By Name"
              value={form.listedByName ?? ""}
              onChange={(v) => setForm({ ...form, listedByName: v })}
            />
            <TextField
              label="Contact Number"
              value={form.contactNumber ?? ""}
              onChange={(v) => setForm({ ...form, contactNumber: v })}
            />
            <TextField
              label="Contact Email"
              value={form.contactEmail ?? ""}
              onChange={(v) => setForm({ ...form, contactEmail: v })}
            />
            <TextField
              label="WhatsApp Number"
              value={form.whatsAppNumber ?? ""}
              onChange={(v) => setForm({ ...form, whatsAppNumber: v })}
            />
            <BoolField
              label="Verified"
              value={form.verified}
              onChange={(v) => setForm({ ...form, verified: v })}
            />
            <BoolField
              label="Featured"
              value={form.isFeatured}
              onChange={(v) => setForm({ ...form, isFeatured: v })}
            />
          </Grid>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Broker (optional)</h4>
              <Grid cols={3}>
                <TextField
                  label="Broker Name"
                  value={form.broker?.name ?? ""}
                  onChange={(v) =>
                    setForm((prev) => {
                      const broker =
                        prev.broker === null || prev.broker === undefined
                          ? { id: "", name: "", phone: "", email: "", type: null }
                          : { ...prev.broker };
                      broker.name = v;
                      return { ...prev, broker };
                    })
                  }
                />
                <TextField
                  label="Broker Phone"
                  value={form.broker?.phone ?? ""}
                  onChange={(v) =>
                    setForm((prev) => {
                      const broker =
                        prev.broker === null || prev.broker === undefined
                          ? { id: "", name: "", phone: "", email: "", type: null }
                          : { ...prev.broker };
                      broker.phone = v;
                      return { ...prev, broker };
                    })
                  }
                />
                <TextField
                  label="Broker Email"
                  value={form.broker?.email ?? ""}
                  onChange={(v) =>
                    setForm((prev) => {
                      const broker =
                        prev.broker === null || prev.broker === undefined
                          ? { id: "", name: "", phone: "", email: "", type: null }
                          : { ...prev.broker };
                      broker.email = v;
                      return { ...prev, broker };
                    })
                  }
                />
                <SelectField
                  label="Broker Type"
                  value={form.broker?.type ?? null}
                  onChange={(v) =>
                    setForm((prev) => {
                      const broker =
                        prev.broker === null || prev.broker === undefined
                          ? { id: "", name: "", phone: "", email: "", type: null }
                          : { ...prev.broker };
                      broker.type = (v || null) as ListingFormValues["listedByType"];
                      return { ...prev, broker };
                    })
                  }
                  options={LISTING_CONTACT_TYPE_OPTIONS}
                  placeholder="Select broker type"
                />
              </Grid>
            </div>

            <div>
              <h4 className="text-sm font-semibold">SEO (optional)</h4>
              <Grid cols={3}>
                <TextField
                  label="SEO Title"
                  value={form.seo?.title ?? ""}
                  onChange={(v) =>
                    setForm((prev) => {
                      const seo =
                        prev.seo === null || prev.seo === undefined
                          ? { title: "", description: "", keywords: [] as string[] | null }
                          : { ...prev.seo };
                      seo.title = v;
                      return { ...prev, seo };
                    })
                  }
                />
                <Field label="SEO Description" colSpan>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border px-3 py-2"
                    value={form.seo?.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => {
                        const seo =
                          prev.seo === null || prev.seo === undefined
                            ? { title: "", description: "", keywords: [] as string[] | null }
                            : { ...prev.seo };
                        seo.description = e.target.value;
                        return { ...prev, seo };
                      })
                    }
                  />
                </Field>
                <TextField
                  label="SEO Keywords (comma-separated)"
                  value={form.seo?.keywords === null ? "" : (form.seo?.keywords ?? []).join(", ")}
                  onChange={(v) =>
                    setForm((prev) => {
                      const seo =
                        prev.seo === null || prev.seo === undefined
                          ? { title: "", description: "", keywords: [] as string[] | null }
                          : { ...prev.seo };
                      seo.keywords = splitCSV(v);
                      return { ...prev, seo };
                    })
                  }
                  colSpan
                />
              </Grid>
            </div>
          </div>

          {/* Documents: add/remove rows */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Documents</h4>
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    documents: [...(f.documents ?? []), { label: "", url: "" }],
                  }))
                }
              >
                + Add Document
              </button>
            </div>
            <div className="space-y-2">
              {(form.documents ?? []).map((d, i) => (
                <div key={i} className="grid grid-cols-5 gap-2">
                  <input
                    className="col-span-2 rounded-xl border px-3 py-2 text-sm"
                    placeholder="Label"
                    value={d.label}
                    onChange={(e) =>
                      setForm((f) => {
                        const copy = [...(f.documents ?? [])];
                        copy[i] = { ...copy[i], label: e.target.value };
                        return { ...f, documents: copy };
                      })
                    }
                  />
                  <input
                    className="col-span-3 rounded-xl border px-3 py-2 text-sm"
                    placeholder="https://..."
                    value={d.url}
                    onChange={(e) =>
                      setForm((f) => {
                        const copy = [...(f.documents ?? [])];
                        copy[i] = { ...copy[i], url: e.target.value };
                        return { ...f, documents: copy };
                      })
                    }
                  />
                  <div className="col-span-5">
                    <button
                      type="button"
                      className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() =>
                        setForm((f) => {
                          const copy = [...(f.documents ?? [])];
                          copy.splice(i, 1);
                          return { ...f, documents: copy };
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {(form.documents ?? []).length === 0 && (
                <p className="text-sm text-gray-500">No documents added.</p>
              )}
            </div>
          </div>
        </DetailsSection>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !form.title.trim() || priceInput.trim() === ""}
          className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ============ Small UI helpers ============ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}
function DetailsSection({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="rounded-2xl border p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold">{summary}</summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}
function Grid({ cols = 2, children }: { cols?: 1 | 2 | 3 | 4; children: React.ReactNode }) {
  const c =
    cols === 4
      ? "md:grid-cols-4"
      : cols === 3
        ? "md:grid-cols-3"
        : cols === 2
          ? "md:grid-cols-2"
          : "";
  return <div className={`grid grid-cols-1 gap-4 ${c}`}>{children}</div>;
}
function Field({
  label,
  children,
  colSpan,
  required,
}: {
  label: string;
  children: React.ReactNode;
  colSpan?: boolean;
  required?: boolean;
}) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
function TextField({
  label,
  value,
  onChange,
  colSpan,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colSpan?: boolean;
}) {
  return (
    <Field label={label} colSpan={colSpan}>
      <input
        className="w-full rounded-xl border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        className="w-full rounded-xl border px-3 py-2"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        min={0}
      />
    </Field>
  );
}
function BoolField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null | undefined;
  onChange: (v: boolean | null) => void;
}) {
  return (
    <Field label={label}>
      <select
        className="w-full rounded-xl border px-3 py-2"
        value={value === null || value === undefined ? "" : value ? "true" : "false"}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : v === "true");
        }}
      >
        <option value="">—</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </Field>
  );
}
type SelectOption = { value: string; label: string };

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  allowEmpty = true,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  allowEmpty?: boolean;
}) {
  const current = value ?? "";
  const hasValue = options.some((option) => option.value === current);
  const normalizedOptions: SelectOption[] = [
    ...(allowEmpty ? [{ value: "", label: placeholder ?? "—" }] : []),
    ...options,
    ...(current && !hasValue ? [{ value: current, label: current }] : []),
  ];

  return (
    <Field label={label}>
      <select
        className="w-full rounded-xl border px-3 py-2"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {normalizedOptions.map((option) => (
          <option key={option.value || "_blank"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
function AreaInput({
  label,
  valueUnit,
  onChange,
}: {
  label: string;
  valueUnit: { value: number | undefined; unit: AreaUnit };
  onChange: (value?: number, unit?: AreaUnit) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="number"
          className="flex-1 min-w-0 rounded-xl border px-3 py-2"
          value={valueUnit.value ?? ""}
          onChange={(e) => onChange(toNum(e.target.value) ?? undefined, valueUnit.unit)}
          min={0}
        />
        <select
          className="w-full rounded-xl border px-3 py-2 sm:w-36"
          value={valueUnit.unit}
          onChange={(e) => onChange(valueUnit.value, e.target.value as AreaUnit)}
        >
          {LISTING_FORM_AREA_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

/* ============ tiny utils ============ */
function toNum(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
function emptyToUndef<T extends string | undefined>(v: T) {
  return (v?.trim?.() || "") === "" ? undefined : v;
}
function emptyToOptional(v?: string | null) {
  return !v || v.trim() === "" ? undefined : v;
}
function splitCSV(v: string): string[] {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
function listingToFormSeed(listing: Listing): Partial<ListingFormValues> {
  return {
    title: listing.title ?? "",
    slug: listing.slug ?? undefined,
    externalId: listing.externalId ?? undefined,
    category: listing.category ?? undefined,
    transactionType: listing.transactionType ?? undefined,
    status: listing.status ?? undefined,
    constructionStatus: listing.constructionStatus ?? undefined,
    price: Number(listing.price ?? 0),
    pricePerSqft: listing.pricePerSqft ?? undefined,
    description: listing.description ?? undefined,
    subtitle: listing.subtitle ?? undefined,
    highlights: listing.highlights ?? undefined,
    ownership: listing.ownership ?? undefined,
    yearBuilt: listing.yearBuilt ?? undefined,
    possessionDate: listing.possessionDate ?? undefined,
    maintenanceTerms: listing.maintenanceTerms ?? undefined,
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
      id: image.id ?? image.url,
      url: image.url,
      alt: image.alt ?? "",
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
          id: listing.broker.id ?? "",
          name: listing.broker.name ?? "",
          phone: listing.broker.phone ?? "",
          email: listing.broker.email ?? "",
          type: listing.broker.type ?? null,
        }
      : null,
    seo: listing.seo
      ? {
          title: listing.seo.title ?? "",
          description: listing.seo.description ?? "",
          keywords: listing.seo.keywords ?? undefined,
        }
      : undefined,
    isFeatured: listing.isFeatured ?? null,
  };
}

function deriveExistingImages(source: ListingFormValues | Partial<ListingFormValues>): {
  images: ExistingImageState[];
  primaryId?: string;
} {
  const raw = Array.isArray(source.images) ? source.images : [];
  const mapped = raw
    .map((entry) => {
      if (!entry) return null;
      const url = entry.url;
      const id = entry.id ?? entry.url;
      if (!url || !id) return null;
      return {
        image: {
          id,
          url,
          alt: entry.alt ?? "",
          removed: false,
        },
        isPrimary: Boolean(entry.isPrimary),
      };
    })
    .filter((value): value is { image: ExistingImageState; isPrimary: boolean } => Boolean(value));

  let primaryId = mapped.find((item) => item.isPrimary)?.image.id;
  const images = mapped.map((item) => item.image);

  if (!primaryId && images.length > 0) {
    primaryId = images[0].id;
  }

  return { images, primaryId };
}

function deriveExistingVideos(
  source: ListingFormValues | Partial<ListingFormValues>,
): ExistingVideoState[] {
  const urls = Array.isArray(source.videoUrls) ? source.videoUrls : [];
  return urls
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url): url is string => url.length > 0)
    .map((url) => ({ url, removed: false }));
}

function ensurePrimarySelection(
  existing: ExistingImageState[],
  newItems: NewImageState[],
  preferred: PrimarySelection | null,
): PrimarySelection | null {
  if (preferred?.type === "existing") {
    const match = existing.find((image) => !image.removed && image.id === preferred.id);
    if (match) return preferred;
  } else if (preferred?.type === "new") {
    if (preferred.index >= 0 && preferred.index < newItems.length) {
      return preferred;
    }
  }

  const existingCandidate = existing.find((image) => !image.removed);
  if (existingCandidate) {
    return { type: "existing", id: existingCandidate.id };
  }

  if (newItems.length > 0) {
    return { type: "new", index: 0 };
  }

  return null;
}

function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case "reset": {
      const nextExisting = action.payload.existing.map((image) => ({ ...image }));
      const nextNew = action.payload.newItems.map((item) => ({ ...item }));
      const nextPrimary = ensurePrimarySelection(nextExisting, nextNew, action.payload.primary);
      return {
        existing: nextExisting,
        newItems: nextNew,
        primary: nextPrimary,
      };
    }
    case "add-new": {
      if (!action.files || action.files.length === 0) return state;
      const appended = action.files.map((file) => ({ file, alt: "" }));
      const newItems = [...state.newItems, ...appended];
      const preferred =
        state.primary ??
        (state.existing.some((image) => !image.removed)
          ? state.primary
          : { type: "new", index: state.newItems.length });
      return {
        existing: state.existing.map((image) => ({ ...image })),
        newItems,
        primary: ensurePrimarySelection(state.existing, newItems, preferred),
      };
    }
    case "set-existing-alt": {
      const existing = state.existing.map((image) =>
        image.id === action.id ? { ...image, alt: action.alt } : image,
      );
      return { ...state, existing };
    }
    case "set-new-alt": {
      const newItems = state.newItems.map((item, index) =>
        index === action.index ? { ...item, alt: action.alt } : item,
      );
      return { ...state, newItems };
    }
    case "set-primary-existing": {
      if (!state.existing.some((image) => !image.removed && image.id === action.id)) {
        return state;
      }
      return { ...state, primary: { type: "existing", id: action.id } };
    }
    case "set-primary-new": {
      if (action.index < 0 || action.index >= state.newItems.length) {
        return state;
      }
      return { ...state, primary: { type: "new", index: action.index } };
    }
    case "remove-existing": {
      const existing = state.existing.map((image) =>
        image.id === action.id ? { ...image, removed: true } : image,
      );
      const preferred =
        state.primary?.type === "existing" && state.primary.id === action.id ? null : state.primary;
      return {
        existing,
        newItems: state.newItems,
        primary: ensurePrimarySelection(existing, state.newItems, preferred),
      };
    }
    case "replace-existing": {
      const target = state.existing.find((image) => image.id === action.id);
      const existing = state.existing.map((image) =>
        image.id === action.id ? { ...image, removed: true } : image,
      );
      const newItem: NewImageState = {
        file: action.file,
        alt: target?.alt ?? "",
        replacesId: action.id,
      };
      const newItems = [...state.newItems, newItem];
      const preferred: PrimarySelection | null =
        state.primary?.type === "existing" && state.primary.id === action.id
          ? { type: "new", index: newItems.length - 1 }
          : state.primary;
      return {
        existing,
        newItems,
        primary: ensurePrimarySelection(existing, newItems, preferred),
      };
    }
    case "remove-new": {
      if (action.index < 0 || action.index >= state.newItems.length) return state;
      const newItems = state.newItems.filter((_, idx) => idx !== action.index);
      let preferred = state.primary;
      if (preferred?.type === "new") {
        if (preferred.index === action.index) {
          preferred = null;
        } else if (preferred.index > action.index) {
          preferred = { type: "new", index: preferred.index - 1 };
        }
      }
      return {
        existing: state.existing.map((image) => ({ ...image })),
        newItems,
        primary: ensurePrimarySelection(state.existing, newItems, preferred),
      };
    }
    default:
      return state;
  }
}

function serializeListingForm({
  form,
  priceInput,
  existingImages,
  existingVideos,
  externalVideoUrls,
  primarySelection,
}: {
  form: ListingFormValues;
  priceInput: string;
  existingImages: ExistingImageState[];
  existingVideos: ExistingVideoState[];
  externalVideoUrls: string[];
  primarySelection: PrimarySelection;
}): Record<string, unknown> {
  const priceValue = priceInput.trim();
  const parsedPrice = Number(priceValue === "" ? 0 : priceValue);
  const title = form.title.trim();

  const slug = emptyToUndef(form.slug);
  const externalId = emptyToOptional(form.externalId);
  const category = emptyToUndef(form.category);
  const transactionType = emptyToUndef(form.transactionType);
  const status = emptyToUndef(form.status);
  const constructionStatus = emptyToUndef(form.constructionStatus);
  const description = emptyToUndef(form.description);
  const subtitle = emptyToOptional(form.subtitle);
  const ownership = emptyToOptional(form.ownership ?? undefined);
  const possessionDate = emptyToOptional(form.possessionDate);
  const maintenanceTerms = emptyToOptional(form.maintenanceTerms);
  const furnishing = emptyToOptional(form.furnishing);
  const unitFacing = emptyToOptional(form.unitFacing);
  const address = emptyToOptional(form.address);
  const societyName = emptyToOptional(form.societyName);
  const projectName = emptyToOptional(form.projectName);
  const reraId = emptyToOptional(form.reraId);
  const virtualTourUrl = emptyToOptional(form.virtualTourUrl);
  const listedByName = emptyToOptional(form.listedByName);
  const contactNumber = emptyToOptional(form.contactNumber);
  const contactEmail = emptyToOptional(form.contactEmail);
  const whatsAppNumber = emptyToOptional(form.whatsAppNumber);

  const highlights =
    Array.isArray(form.highlights) && form.highlights.length > 0
      ? dedupeStrings(form.highlights)
      : undefined;
  const amenities =
    Array.isArray(form.amenities) && form.amenities.length > 0
      ? dedupeStrings(form.amenities)
      : undefined;
  const tags =
    Array.isArray(form.tags) && form.tags.length > 0 ? dedupeStrings(form.tags) : undefined;

  const addressPartsRaw = form.addressParts
    ? Object.entries(form.addressParts).reduce(
        (acc, [key, value]) => {
          const next = emptyToOptional(value as string | null | undefined);
          if (next !== undefined) {
            acc[key as keyof NonNullable<ListingFormValues["addressParts"]>] = next;
          }
          return acc;
        },
        {} as NonNullable<ListingFormValues["addressParts"]>,
      )
    : undefined;
  const addressParts =
    addressPartsRaw && Object.keys(addressPartsRaw).length > 0 ? addressPartsRaw : undefined;

  const documents =
    form.documents && form.documents.length > 0
      ? form.documents.filter((d) => d.label && d.url)
      : undefined;

  const broker =
    form.broker && form.broker !== null
      ? (() => {
          const brokerType = form.broker.type ?? undefined;
          const info = {
            id: emptyToOptional(form.broker.id ?? ""),
            name: emptyToOptional(form.broker.name ?? ""),
            phone: emptyToOptional(form.broker.phone ?? ""),
            email: emptyToOptional(form.broker.email ?? ""),
            ...(brokerType ? { type: brokerType } : {}),
          };
          const hasValues = Object.values(info).some((value) => value !== undefined);
          return hasValues ? info : undefined;
        })()
      : undefined;

  const seo =
    form.seo && form.seo !== null
      ? (() => {
          const keywords =
            form.seo.keywords === null
              ? undefined
              : form.seo.keywords && form.seo.keywords.length > 0
                ? dedupeStrings(form.seo.keywords)
                : undefined;
          const info = {
            title: emptyToOptional(form.seo.title ?? ""),
            description: emptyToOptional(form.seo.description ?? ""),
            keywords,
          };
          const hasValues = Object.values(info).some((value) =>
            Array.isArray(value) ? value.length > 0 : value !== undefined,
          );
          return hasValues ? info : undefined;
        })()
      : undefined;

  const priceBreakupRaw = form.priceBreakup ?? {};
  const priceBreakup: NonNullable<ListingFormValues["priceBreakup"]> = {};
  if (
    priceBreakupRaw.basePrice !== undefined &&
    priceBreakupRaw.basePrice !== null &&
    !Number.isNaN(priceBreakupRaw.basePrice)
  ) {
    priceBreakup.basePrice = priceBreakupRaw.basePrice;
  }
  if (
    priceBreakupRaw.maintenanceMonthly !== undefined &&
    priceBreakupRaw.maintenanceMonthly !== null &&
    !Number.isNaN(priceBreakupRaw.maintenanceMonthly)
  ) {
    priceBreakup.maintenanceMonthly = priceBreakupRaw.maintenanceMonthly;
  }
  if (
    priceBreakupRaw.parkingCharges !== undefined &&
    priceBreakupRaw.parkingCharges !== null &&
    !Number.isNaN(priceBreakupRaw.parkingCharges)
  ) {
    priceBreakup.parkingCharges = priceBreakupRaw.parkingCharges;
  }
  if (
    priceBreakupRaw.clubMembershipCharges !== undefined &&
    priceBreakupRaw.clubMembershipCharges !== null &&
    !Number.isNaN(priceBreakupRaw.clubMembershipCharges)
  ) {
    priceBreakup.clubMembershipCharges = priceBreakupRaw.clubMembershipCharges;
  }
  if (
    priceBreakupRaw.registrationCharges !== undefined &&
    priceBreakupRaw.registrationCharges !== null &&
    !Number.isNaN(priceBreakupRaw.registrationCharges)
  ) {
    priceBreakup.registrationCharges = priceBreakupRaw.registrationCharges;
  }
  if (
    priceBreakupRaw.gstPercent !== undefined &&
    priceBreakupRaw.gstPercent !== null &&
    !Number.isNaN(priceBreakupRaw.gstPercent)
  ) {
    priceBreakup.gstPercent = priceBreakupRaw.gstPercent;
  }
  if (priceBreakupRaw.negotiable !== undefined && priceBreakupRaw.negotiable !== null) {
    priceBreakup.negotiable = priceBreakupRaw.negotiable;
  }
  if (priceBreakupRaw.allInclusive !== undefined && priceBreakupRaw.allInclusive !== null) {
    priceBreakup.allInclusive = priceBreakupRaw.allInclusive;
  }
  if (
    priceBreakupRaw.bookingAmount !== undefined &&
    priceBreakupRaw.bookingAmount !== null &&
    !Number.isNaN(priceBreakupRaw.bookingAmount)
  ) {
    priceBreakup.bookingAmount = priceBreakupRaw.bookingAmount;
  }

  const normalized: Record<string, unknown> = {
    title,
    price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
  };

  if (slug) normalized.slug = slug;
  if (externalId) normalized.externalId = externalId;
  if (category) normalized.category = category;
  if (transactionType) normalized.transactionType = transactionType;
  if (status) normalized.status = status;
  if (constructionStatus) normalized.constructionStatus = constructionStatus;
  if (description) normalized.description = description;
  if (subtitle) normalized.subtitle = subtitle;
  if (highlights?.length) normalized.highlights = highlights;
  if (ownership) normalized.ownership = ownership;
  if (typeof form.yearBuilt === "number") normalized.yearBuilt = form.yearBuilt;
  if (possessionDate) normalized.possessionDate = possessionDate;
  if (typeof form.pricePerSqft === "number" && !Number.isNaN(form.pricePerSqft)) {
    normalized.pricePerSqft = form.pricePerSqft;
  }
  if (maintenanceTerms) normalized.maintenanceTerms = maintenanceTerms;

  if (form.carpetArea !== undefined) normalized.carpetArea = form.carpetArea;
  if (form.builtUpArea !== undefined) normalized.builtUpArea = form.builtUpArea;
  if (form.superBuiltUpArea !== undefined) normalized.superBuiltUpArea = form.superBuiltUpArea;
  if (form.landArea !== undefined) normalized.landArea = form.landArea;

  if (form.plotLengthFt !== undefined && form.plotLengthFt !== null) {
    normalized.plotLengthFt = form.plotLengthFt;
  }
  if (form.plotWidthFt !== undefined && form.plotWidthFt !== null) {
    normalized.plotWidthFt = form.plotWidthFt;
  }
  if (form.frontageFt !== undefined && form.frontageFt !== null) {
    normalized.frontageFt = form.frontageFt;
  }
  if (form.roadWidthFt !== undefined && form.roadWidthFt !== null) {
    normalized.roadWidthFt = form.roadWidthFt;
  }
  if (form.plotFacing) normalized.plotFacing = form.plotFacing;
  if (form.cornerPlot !== undefined && form.cornerPlot !== null) {
    normalized.cornerPlot = form.cornerPlot;
  }

  if (form.bedrooms !== undefined && form.bedrooms !== null) normalized.bedrooms = form.bedrooms;
  if (form.bathrooms !== undefined && form.bathrooms !== null) {
    normalized.bathrooms = form.bathrooms;
  }
  if (form.balconies !== undefined && form.balconies !== null) {
    normalized.balconies = form.balconies;
  }
  if (furnishing) normalized.furnishing = furnishing as ListingFormValues["furnishing"];
  if (form.floorNumber !== undefined && form.floorNumber !== null) {
    normalized.floorNumber = form.floorNumber;
  }
  if (form.totalFloors !== undefined && form.totalFloors !== null) {
    normalized.totalFloors = form.totalFloors;
  }
  if (form.hasLift !== undefined && form.hasLift !== null) {
    normalized.hasLift = form.hasLift;
  }
  if (unitFacing) normalized.unitFacing = unitFacing as ListingFormValues["unitFacing"];
  if (form.coveredParkingCount !== undefined && form.coveredParkingCount !== null) {
    normalized.coveredParkingCount = form.coveredParkingCount;
  }
  if (form.openParkingCount !== undefined && form.openParkingCount !== null) {
    normalized.openParkingCount = form.openParkingCount;
  }
  if (form.vaastuCompliant !== undefined && form.vaastuCompliant !== null) {
    normalized.vaastuCompliant = form.vaastuCompliant;
  }

  if (Object.keys(priceBreakup).length > 0) {
    normalized.priceBreakup = priceBreakup;
  }

  if (address) normalized.address = address;
  if (addressParts) normalized.addressParts = addressParts;
  if (form.geo) normalized.geo = form.geo;

  if (societyName) normalized.societyName = societyName;
  if (projectName) normalized.projectName = projectName;
  if (reraId) normalized.reraId = reraId;
  if (form.reraRegistered !== undefined && form.reraRegistered !== null) {
    normalized.reraRegistered = form.reraRegistered;
  }
  if (amenities?.length) normalized.amenities = amenities;
  if (tags?.length) normalized.tags = tags;

  const activeExisting = existingImages.filter((image) => !image.removed);
  if (activeExisting.length > 0) {
    normalized.images = activeExisting.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt.trim().length > 0 ? image.alt : null,
      isPrimary: primarySelection?.type === "existing" && primarySelection.id === image.id,
    }));
  }

  if (virtualTourUrl) normalized.virtualTourUrl = virtualTourUrl;

  const activeExistingVideos = existingVideos
    .filter((video) => !video.removed)
    .map((video) => video.url.trim())
    .filter(Boolean);
  const externalVideoList = externalVideoUrls.map((url) => url.trim()).filter(Boolean);
  normalized.videoUrls = [...activeExistingVideos, ...externalVideoList];
  if (documents && documents.length > 0) normalized.documents = documents;

  if (form.listedByType) normalized.listedByType = form.listedByType;
  if (listedByName) normalized.listedByName = listedByName;
  if (contactNumber) normalized.contactNumber = contactNumber;
  if (contactEmail) normalized.contactEmail = contactEmail;
  if (whatsAppNumber) normalized.whatsAppNumber = whatsAppNumber;
  if (form.verified !== undefined && form.verified !== null) {
    normalized.verified = form.verified;
  }
  if (broker) normalized.broker = broker as ListingFormValues["broker"];

  if (form.isFeatured !== undefined && form.isFeatured !== null) {
    normalized.isFeatured = form.isFeatured;
  }
  if (seo) normalized.seo = seo as ListingFormValues["seo"];

  return normalized;
}

function buildMergePatch(
  current: Record<string, unknown>,
  baseline: Record<string, unknown>,
): Record<string, unknown> {
  const diff = computeMergePatch(current, baseline);
  return diff && typeof diff === "object" ? (diff as Record<string, unknown>) : {};
}

function computeMergePatch(current: unknown, baseline: unknown): unknown {
  if (typeof current === "undefined") {
    return typeof baseline === "undefined" ? undefined : null;
  }
  if (typeof baseline === "undefined") {
    if (Array.isArray(current)) return current;
    if (current && typeof current === "object") {
      const result: Record<string, unknown> = {};
      Object.entries(current as Record<string, unknown>).forEach(([key, value]) => {
        const diff = computeMergePatch(value, undefined);
        if (typeof diff !== "undefined") {
          result[key] = diff;
        }
      });
      return result;
    }
    return current;
  }
  if (deepEqual(current, baseline)) {
    return undefined;
  }
  if (current === null || baseline === null) {
    return current;
  }
  if (Array.isArray(current) || Array.isArray(baseline)) {
    return deepEqual(current, baseline) ? undefined : current;
  }
  if (typeof current === "object" && typeof baseline === "object") {
    const result: Record<string, unknown> = {};
    const keys = new Set([
      ...Object.keys(baseline as Record<string, unknown>),
      ...Object.keys(current as Record<string, unknown>),
    ]);
    keys.forEach((key) => {
      const diff = computeMergePatch(
        (current as Record<string, unknown>)[key],
        (baseline as Record<string, unknown>)[key],
      );
      if (typeof diff !== "undefined") {
        result[key] = diff;
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }
  return current;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function dedupeStrings(arr: string[]) {
  return Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));
}
function setAddr<K extends keyof NonNullable<ListingFormValues["addressParts"]>>(
  key: K,
  value: string,
  form: ListingFormValues,
  setForm: React.Dispatch<React.SetStateAction<ListingFormValues>>,
) {
  setForm({
    ...form,
    addressParts: {
      ...(form.addressParts ?? {}),
      [key]: value,
    },
  });
}
function useObjectUrls(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const u = files.map((f) => URL.createObjectURL(f));
    setUrls(u);
    return () => u.forEach((x) => URL.revokeObjectURL(x));
  }, [files]);
  return urls;
}

// --- Price Breakup field helpers --------------------------------------------
type PBField = keyof NonNullable<ListingFormValues["priceBreakup"]>;

function PB({
  field,
  label,
  form,
  setForm,
}: {
  field: PBField;
  label: string;
  form: ListingFormValues;
  setForm: React.Dispatch<React.SetStateAction<ListingFormValues>>;
}) {
  const val = form.priceBreakup?.[field] as number | null | undefined;

  return (
    <Field label={label}>
      <input
        type="number"
        className="w-full rounded-xl border px-3 py-2"
        value={val ?? ""}
        min={0}
        onChange={(e) => {
          const n = e.target.value === "" ? null : Number(e.target.value);
          setForm((f) => ({
            ...f,
            priceBreakup: {
              ...(f.priceBreakup ?? {}),
              [field]: n,
            },
          }));
        }}
      />
    </Field>
  );
}

function PBBool({
  field,
  label,
  form,
  setForm,
}: {
  field: PBField;
  label: string;
  form: ListingFormValues;
  setForm: React.Dispatch<React.SetStateAction<ListingFormValues>>;
}) {
  const val = form.priceBreakup?.[field] as boolean | null | undefined;

  return (
    <Field label={label}>
      <select
        className="w-full rounded-xl border px-3 py-2"
        value={val === null || val === undefined ? "" : val ? "true" : "false"}
        onChange={(e) => {
          const v = e.target.value;
          const next = v === "" ? null : v === "true";
          setForm((f) => ({
            ...f,
            priceBreakup: {
              ...(f.priceBreakup ?? {}),
              [field]: next,
            },
          }));
        }}
      >
        <option value="">—</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </Field>
  );
}

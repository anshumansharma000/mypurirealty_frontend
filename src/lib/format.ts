// lib/format.ts
import type { Area, AreaUnit, PriceBreakup } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Currency / Numbers
// ─────────────────────────────────────────────────────────────────────────────
export const LAKH = 1_00_000; // 1 lakh
export const CRORE = 1_00_00_000; // 1 crore

export function formatINR(
  amount: number,
  opts?: { maximumFractionDigits?: number; minimumFractionDigits?: number },
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: opts?.maximumFractionDigits ?? 0,
      minimumFractionDigits: opts?.minimumFractionDigits ?? 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

// Compact helper used widely in Indian real estate (₹xx L / ₹x.x Cr)
export function formatINRCompact(amount: number, opts?: { showSymbol?: boolean }) {
  const showSymbol = opts?.showSymbol !== false;
  const sym = showSymbol ? "₹" : "";
  if (amount >= CRORE) {
    const cr = amount / CRORE;
    const digits = cr % 1 === 0 ? 0 : cr >= 10 ? 1 : 2;
    return `${sym}${cr.toFixed(digits)} Cr`;
  }
  if (amount >= LAKH) {
    const l = amount / LAKH;
    const digits = l % 1 === 0 ? 0 : l >= 10 ? 1 : 2;
    return `${sym}${l.toFixed(digits)} L`;
  }
  return formatINR(amount);
}

export function formatNumberIN(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Area Conversion / Formatting
// NOTE: “biswa” varies regionally; left undefined by default.
// Use setAreaUnitFactor("biswa", factorToSqft) to set a region-specific factor.
// ─────────────────────────────────────────────────────────────────────────────
const AREA_FACTORS_TO_SQFT: Partial<Record<AreaUnit, number>> = {
  sqft: 1,
  sqyd: 9, // 1 sq yard = 9 sq ft
  sqm: 10.76391041671, // 1 sq m = 10.7639 sq ft
  acre: 43_560, // 1 acre = 43,560 sq ft
  hectare: 107_639.1041671, // 1 ha = 107,639.10 sq ft
  decimal: 435.6, // 1 decimal = 1/100 acre (common in Odisha/WB)
  guntha: 1_089, // 1 guntha ≈ 1,089 sq ft (33 ft x 33 ft)
  // biswa: (region-dependent; set via setAreaUnitFactor)
};

let CUSTOM_UNIT_TO_SQFT: Partial<Record<AreaUnit, number>> = {};

export function setAreaUnitFactor(unit: AreaUnit, factorToSqft: number) {
  CUSTOM_UNIT_TO_SQFT[unit] = factorToSqft;
}

function factorToSqft(unit: AreaUnit): number {
  const custom = CUSTOM_UNIT_TO_SQFT[unit];
  if (typeof custom === "number") return custom;
  const f = AREA_FACTORS_TO_SQFT[unit];
  if (typeof f === "number") return f;
  throw new Error(
    `No conversion factor defined for unit '${unit}'. Use setAreaUnitFactor(...) to define one.`,
  );
}

function areaToSqft(area: Area): number {
  return area.value * factorToSqft(area.unit);
}

export function convertArea(area: Area, toUnit: AreaUnit): Area {
  if (area.unit === toUnit) return { ...area };
  const sqft = areaToSqft(area);
  const toFactor = factorToSqft(toUnit);
  return { value: sqft / toFactor, unit: toUnit };
}

export function formatArea(
  area?: Area,
  opts?: { toUnit?: AreaUnit; maximumFractionDigits?: number; withUnit?: boolean },
): string {
  if (!area) return "—";
  const target = opts?.toUnit ? convertArea(area, opts.toUnit) : area;
  const digits =
    opts?.maximumFractionDigits ?? (target.value >= 100 ? 0 : target.value >= 10 ? 1 : 2);
  const v = formatNumberIN(target.value, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
  const unit = opts?.withUnit === false ? "" : ` ${target.unit}`;
  return `${v}${unit}`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Time Ago (for postedAt / updatedAt)
// ─────────────────────────────────────────────────────────────────────────────
export function timeAgo(iso?: string, nowMs: number = Date.now()): string {
  if (!iso) return "Recently posted";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const diff = Math.max(0, nowMs - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min > 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr${hr > 1 ? "s" : ""} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day > 1 ? "s" : ""} ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk} wk${wk > 1 ? "s" : ""} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} mo${mo > 1 ? "s" : ""} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} yr${yr > 1 ? "s" : ""} ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Misc helpers
// ─────────────────────────────────────────────────────────────────────────────
const DIR_ABBR: Record<string, string> = {
  North: "N",
  "North-East": "NE",
  East: "E",
  "South-East": "SE",
  South: "S",
  "South-West": "SW",
  West: "W",
  "North-West": "NW",
};

export function compactFacing(dir?: string): string {
  if (!dir) return "—";
  return DIR_ABBR[dir] ?? dir;
}

export function estimateAllInclusivePrice(basePrice: number, breakup?: PriceBreakup): number {
  if (!breakup) return basePrice;
  if (breakup.allInclusive) return basePrice;

  let total = basePrice;
  if (breakup.parkingCharges) total += breakup.parkingCharges;
  if (breakup.clubMembershipCharges) total += breakup.clubMembershipCharges;
  if (breakup.registrationCharges) total += breakup.registrationCharges;
  if (breakup.gstPercent) total += (basePrice * breakup.gstPercent) / 100;
  // maintenanceMonthly & bookingAmount are not typically capitalized into base price
  return total;
}

export function formatPhoneReadable(phone?: string): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D+/g, "").slice(-10); // take last 10 digits for Indian numbers
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`; // 5-5 split looks clean
}

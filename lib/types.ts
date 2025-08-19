import type { Property } from "@/lib/types";

// Exporting so you can reuse in other places if needed
export type MojoListing = {
  id?: string;
  code?: string;                // used for schedule URL
  property_name?: string;
  address?: string;
  unit?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  beds?: number | string;
  baths?: number | string;
  square_feet?: number | string;
  rent?: number | string;
  rent_high?: number | string;
  photos?: string[];            // some accounts return absolute URLs
  description?: string;
  neighborhood?: string;
  amenities?: string[];         // sometimes present
};

function toNum(v: unknown): number | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export async function fetchMojoListings(): Promise<MojoListing[]> {
  const endpoint = "https://showmojo.com/api/v3/reports/detailed_listing_data";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.SHOWMOJO_API_TOKEN) {
    headers.Authorization = `Token ${process.env.SHOWMOJO_API_TOKEN}`;
  } else if (process.env.SHOWMOJO_USER && process.env.SHOWMOJO_PASS) {
    const token = Buffer.from(`${process.env.SHOWMOJO_USER}:${process.env.SHOWMOJO_PASS}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  } else {
    // No credentials configured
    return [];
  }

  // POST per ShowMojo "Report Export" behavior
  const res = await fetch(endpoint, { method: "POST", headers, cache: "no-store" });
  if (!res.ok) return [];

  const json = await res.json();
  // Different accounts/versions return data under different keys
  const rows: any[] = Array.isArray(json) ? json : (json?.data ?? json?.listings ?? []);
  return rows;
}

export function mapMojoToProperty(m: MojoListing): Property {
  const line1 = [
    m.address,
    m.unit && !/unit|apt|#/.test((m.unit || "").toLowerCase()) ? `#${m.unit}` : m.unit,
  ]
    .filter(Boolean)
    .join(" ");

  const neighborhood = m.neighborhood || m.city || "";
  const title = m.property_name ? `${m.property_name}${m.unit ? ` • ${m.unit}` : ""}` : line1 || "Residence";
  const slug = (title || m.code || m.id || "listing")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const scheduleUrl = m.code ? `https://showmojo.com/l/${m.code}` : undefined;

  // Normalize numerics
  const beds = toNum(m.beds) ?? 0;
  const baths = toNum(m.baths) ?? 0;
  const sqft = toNum(m.square_feet);
  const rentFrom = toNum(m.rent) ?? 0;
  const rentTo = toNum(m.rent_high);

  // Amenities (if present)
  const amenities =
    Array.isArray(m.amenities)
      ? m.amenities.map(s => (s ?? "").toString().trim()).filter(Boolean)
      : [];

  // Photos: use as provided; ShowMojo usually serves absolute URLs
  const images = Array.isArray(m.photos) && m.photos.length > 0 ? m.photos : ["/images/sample1.jpg"];

  return {
    id: m.id || m.code || slug,
    slug,
    title,
    address: line1 || "",
    neighborhood,
    beds,
    baths,
    areaSqFt: sqft,
    rentFrom,
    rentTo,
    available: "TBA",
    images,
    amenities,
    description: m.description || "",
    scheduleUrl,
  };
}

// Derive a building key (property name if present; otherwise address without unit)
export function buildingKey(m: MojoListing): { key: string; label: string } {
  if (m.property_name) {
    const label = (m.property_name || "").trim();
    return { key: label.toLowerCase(), label };
  }
  const addr = (m.address || "").trim();
  // strip common unit patterns (Apt 12, #12, Unit 12)
  const label = addr.replace(/\s*(?:apt|unit|#)\s*[\w-]+$/i, "");
  return { key: label.toLowerCase(), label };
}
// lib/types.ts

export type Property = {
  id: string;
  slug: string;
  title: string;
  address: string;
  neighborhood: string;
  beds: number;
  baths: number;
  areaSqFt?: number;
  rentFrom: number;
  rentTo?: number;
  available?: string;
  images: string[];
  amenities?: string[];
  description?: string;
  /** Present when sourced from ShowMojo */
  scheduleUrl?: string;
};

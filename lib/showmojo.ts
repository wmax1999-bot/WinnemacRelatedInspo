import type { Property } from "@/lib/types";

/** ShowMojo row shape (keys vary by account/report) */
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
  photos?: string[];
  description?: string;
  neighborhood?: string;
  amenities?: string[];
};

/** Optional report options you can pass from /api/mojo?start=YYYY-MM-DD&end=YYYY-MM-DD */
export type ReportOpts = {
  /** start date (YYYY-MM-DD or ISO string or Date) */
  start?: string | Date;
  /** end date (YYYY-MM-DD or ISO string or Date) */
  end?: string | Date;
  /** if your account uses “acting as master account” flag */
  actingAsMasterAccount?: boolean;
};

/* ---------- helpers ---------- */

function toNum(v: unknown): number | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/** RFC3339 start-of-day UTC if date-only string */
function toIsoStart(d: string | Date): string {
  if (d instanceof Date) return d.toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T00:00:00Z`).toISOString();
  return new Date(d).toISOString();
}

/** RFC3339 end-of-day UTC if date-only string */
function toIsoEnd(d: string | Date): string {
  if (d instanceof Date) return d.toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T23:59:59Z`).toISOString();
  return new Date(d).toISOString();
}

/* ---------- core fetch ---------- */

/**
 * Fetch listings from ShowMojo “detailed_listing_data” report.
 * Requires one of:
 *   - SHOWMOJO_API_TOKEN   (recommended)
 *   - SHOWMOJO_USER + SHOWMOJO_PASS (basic auth)
 *
 * You can pass { start, end } to filter by date range.
 */
export async function fetchMojoListings(opts: ReportOpts = {}): Promise<MojoListing[]> {
  const endpoint = "https://showmojo.com/api/v3/reports/detailed_listing_data";

  // --- Build Authorization header
  let authHeader = "";
  if (process.env.SHOWMOJO_API_TOKEN) {
    // Most accounts accept either of these; start with the simple form
    authHeader = `Token ${process.env.SHOWMOJO_API_TOKEN}`;
    // If you ever see 401, try the quoted variant:
    // authHeader = `Token token="${process.env.SHOWMOJO_API_TOKEN}"`;
  } else if (process.env.SHOWMOJO_USER && process.env.SHOWMOJO_PASS) {
    const b64 = Buffer.from(`${process.env.SHOWMOJO_USER}:${process.env.SHOWMOJO_PASS}`).toString("base64");
    authHeader = `Basic ${b64}`;
  } else {
    // No credentials configured
    return [];
  }

  // --- Form-encoded body per docs
  const body = new URLSearchParams();
  if (opts.start) body.set("start_date", toIsoStart(opts.start));
  if (opts.end) body.set("end_date", toIsoEnd(opts.end));
  if (opts.actingAsMasterAccount) body.set("acting_as_master_account", "true");

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: authHeader,
  };

  // First attempt
  let res = await fetch(endpoint, { method: "POST", headers, body, cache: "no-store" });

  // If unauthorized with simple Token form, retry with quoted variant once.
  if (res.status === 401 && process.env.SHOWMOJO_API_TOKEN && authHeader.startsWith("Token ")) {
    headers.Authorization = `Token token="${process.env.SHOWMOJO_API_TOKEN}"`;
    res = await fetch(endpoint, { method: "POST", headers, body, cache: "no-store" });
  }

  if (!res.ok) return [];

  const json = await res.json();
  // Some accounts return { data: [...] }, others { listings: [...] }, others just [...]
  const rows: any[] = Array.isArray(json) ? json : (json?.data ?? json?.listings ?? []);
  return rows;
}

/* ---------- mapping to your Property shape ---------- */

export function mapMojoToProperty(m: MojoListing): Property {
  const addrLine = [
    m.address,
    m.unit && !/unit|apt|#/.test(String(m.unit).toLowerCase()) ? `#${m.unit}` : m.unit,
  ]
    .filter(Boolean)
    .join(" ");

  const title =
    m.property_name ? `${m.property_name}${m.unit ? ` • ${m.unit}` : ""}` : addrLine || "Residence";

  const slug = (title || m.code || m.id || "listing")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const scheduleUrl = m.code ? `https://showmojo.com/l/${m.code}` : undefined;

  const beds = toNum(m.beds) ?? 0;
  const baths = toNum(m.baths) ?? 0;
  const sqft = toNum(m.square_feet);
  const rentFrom = toNum(m.rent) ?? 0;
  const rentTo = toNum(m.rent_high);

  const amenities =
    Array.isArray(m.amenities)
      ? m.amenities.map(s => (s ?? "").toString().trim()).filter(Boolean)
      : [];

  const images = Array.isArray(m.photos) && m.photos.length > 0
    ? m.photos
    : ["/images/sample1.jpg"];

  return {
    id: m.id || m.code || slug,
    slug,
    title,
    address: addrLine || "",
    neighborhood: m.neighborhood || m.city || "",
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

/** Derive a building grouping key/label */
export function buildingKey(m: MojoListing): { key: string; label: string } {
  if (m.property_name) {
    const label = m.property_name.trim();
    return { key: label.toLowerCase(), label };
  }
  const addr = (m.address || "").trim();
  const label = addr.replace(/\s*(?:apt|unit|#)\s*[\w-]+$/i, "");
  return { key: label.toLowerCase(), label };
}

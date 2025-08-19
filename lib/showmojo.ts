// lib/showmojo.ts
import type { Property } from "@/lib/types";

export type MojoListing = {
  id?: string;
  code?: string;
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

export type ReportOpts = {
  start?: string | Date;             // YYYY-MM-DD or ISO or Date
  end?: string | Date;               // YYYY-MM-DD or ISO or Date
  actingAsMasterAccount?: boolean;
};

function toNum(v: unknown): number | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}
function toIsoStart(d: string | Date): string {
  if (d instanceof Date) return d.toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T00:00:00Z`).toISOString();
  return new Date(d).toISOString();
}
function toIsoEnd(d: string | Date): string {
  if (d instanceof Date) return d.toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T23:59:59Z`).toISOString();
  return new Date(d).toISOString();
}

/** Stronger building normalizer */
export function buildingKey(m: MojoListing): { key: string; label: string } {
  const primary = (m.property_name || m.address || "").trim();
  if (!primary) return { key: "other", label: "Other" };
  let base = primary.split(",")[0]; // only street line
  base = base
    .replace(/[, ]*(?:Apt\.?|Apartment|Unit)\s*[-:]?\s*[\w.-]+$/i, "")
    .replace(/\s*#\s*[\w.-]+$/i, "")
    .replace(/\s*[-–—]\s*[\w.-]+$/i, "")
    .trim();
  const label = base || primary;
  return { key: label.toLowerCase(), label };
}

/** Fetch ShowMojo report; defaults to last 2 years if no dates passed */
export async function fetchMojoListings(opts: ReportOpts = {}): Promise<MojoListing[]> {
  const endpoint = "https://showmojo.com/api/v3/reports/detailed_listing_data";

  // Default window: last 2 years
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setFullYear(now.getFullYear() - 2);

  const startISO = toIsoStart(opts.start ?? defaultStart);
  const endISO = toIsoEnd(opts.end ?? now);

  let authHeader = "";
  if (process.env.SHOWMOJO_API_TOKEN) {
    authHeader = `Token ${process.env.SHOWMOJO_API_TOKEN}`;
  } else if (process.env.SHOWMOJO_USER && process.env.SHOWMOJO_PASS) {
    const b64 = Buffer.from(`${process.env.SHOWMOJO_USER}:${process.env.SHOWMOJO_PASS}`).toString("base64");
    authHeader = `Basic ${b64}`;
  } else {
    console.error("[showmojo] Missing SHOWMOJO credentials");
    return [];
  }

  const body = new URLSearchParams();
  body.set("start_date", startISO);
  body.set("end_date", endISO);
  if (opts.actingAsMasterAccount) body.set("acting_as_master_account", "true");

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: authHeader,
  };

  let res = await fetch(endpoint, { method: "POST", headers, body, cache: "no-store" });

  // Retry with quoted token form if 401
  if (res.status === 401 && process.env.SHOWMOJO_API_TOKEN && headers.Authorization.startsWith("Token ")) {
    headers.Authorization = `Token token="${process.env.SHOWMOJO_API_TOKEN}"`;
    res = await fetch(endpoint, { method: "POST", headers, body, cache: "no-store" });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[showmojo] HTTP", res.status, text || res.statusText);
    return [];
  }

  const json = await res.json().catch((e) => {
    console.error("[showmojo] JSON parse error", e);
    return null;
  });
  if (!json) return [];

  const rows: any[] = Array.isArray(json) ? json : (json?.data ?? json?.listings ?? []);
  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn("[showmojo] No rows in response (check dates/auth).");
  }
  return rows;
}

export function mapMojoToProperty(m: MojoListing): Property {
  const addrLine = [
    m.address,
    m.unit && !/unit|apt|#/.test(String(m.unit).toLowerCase()) ? `#${m.unit}` : m.unit,
  ].filter(Boolean).join(" ");

  const title = m.property_name ? `${m.property_name}${m.unit ? ` • ${m.unit}` : ""}` : addrLine || "Residence";
  const slug = (title || m.code || m.id || "listing").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const scheduleUrl = m.code ? `https://showmojo.com/l/${m.code}` : undefined;

  const beds = toNum(m.beds) ?? 0;
  const baths = toNum(m.baths) ?? 0;
  const sqft = toNum(m.square_feet);
  const rentFrom = toNum(m.rent) ?? 0;
  const rentTo = toNum(m.rent_high);

  const amenities = Array.isArray(m.amenities) ? m.amenities.map(s => (s ?? "").toString().trim()).filter(Boolean) : [];
  const images = Array.isArray(m.photos) && m.photos.length > 0 ? m.photos : ["/images/sample1.jpg"];

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

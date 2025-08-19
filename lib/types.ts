import type { Property } from "@/lib/types";

type MojoListing = {
  id?: string;
  code?: string; // used in schedule URL
  property_name?: string;
  address?: string;
  unit?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  beds?: number;
  baths?: number;
  square_feet?: number;
  rent?: number;
  rent_high?: number;
  photos?: string[];
  description?: string;
  neighborhood?: string;
};

export async function fetchMojoListings(): Promise<MojoListing[]> {
  const endpoint = "https://showmojo.com/api/v3/reports/detailed_listing_data";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.SHOWMOJO_API_TOKEN) {
    // Token auth (per ShowMojo docs)
    headers.Authorization = `Token ${process.env.SHOWMOJO_API_TOKEN}`;
  } else if (process.env.SHOWMOJO_USER && process.env.SHOWMOJO_PASS) {
    const token = Buffer.from(`${process.env.SHOWMOJO_USER}:${process.env.SHOWMOJO_PASS}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  } else {
    // No credentials configured
    return [];
  }

  const res = await fetch(endpoint, { method: "POST", headers, cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  // Some accounts return { data: [...] }, others return an array
  const rows: any[] = Array.isArray(json) ? json : (json?.data ?? json?.listings ?? []);
  return rows;
}

export function mapMojoToProperty(m: MojoListing): Property {
  const line1 = [m.address, m.unit && !/unit|apt|#/.test(m.unit.toLowerCase()) ? `#${m.unit}` : m.unit]
    .filter(Boolean)
    .join(" ");
  const neighborhood = m.neighborhood || m.city || "";
  const title = m.property_name ? `${m.property_name}${m.unit ? ` • ${m.unit}` : ""}` : line1 || "Residence";
  const slug = (title || m.code || m.id || "listing").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const scheduleUrl = m.code ? `https://showmojo.com/l/${m.code}` : undefined;

  return {
    id: m.id || m.code || slug,
    slug,
    title,
    address: line1 || "",
    neighborhood,
    beds: m.beds ?? 0,
    baths: m.baths ?? 0,
    areaSqFt: m.square_feet,
    rentFrom: m.rent ?? 0,
    rentTo: m.rent_high,
    available: "TBA",
    images: m.photos?.length ? m.photos : ["/images/sample1.jpg"],
    amenities: [],
    description: m.description || "",
    scheduleUrl,
  };
}

// Derive a building key (property name if present; otherwise address without unit)
export function buildingKey(m: MojoListing): { key: string; label: string } {
  if (m.property_name) {
    const label = m.property_name.trim();
    return { key: label.toLowerCase(), label };
  }
  const addr = (m.address || "").trim();
  // strip common unit patterns (Apt 12, #12, Unit 12)
  const label = addr.replace(/\s*(?:apt|unit|#)\s*[\w-]+$/i, "");
  return { key: label.toLowerCase(), label };
}

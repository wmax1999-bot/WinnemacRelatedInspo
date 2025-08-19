import type { Property } from "@/lib/types";

/** Shape of a ShowMojo listing row (keys vary by account/report) */
export type MojoListing = {
  id?: string;
  code?: string;                // used for schedule URL
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

/** Fetch listings from ShowMojo “detailed_listing_data” report.
 *  Requires: SHOWMOJO_API_TOKEN in your env.
 */
export async function fetchMojoListings(): Promise<MojoListing[]> {
  const token = process.env.SHOWMOJO_API_TOKEN;
  if (!token) return [];

  const endpoint = "https://showmojo.com/api/v3/reports/detailed_listing_data";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Token auth per ShowMojo
      Authorization: `Token ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const json = await res.json();
  // Some accounts return { data: [...] }, others { listings: [...] }, others just [...]
  const rows: any[] = Array.isArray(json) ? json : (json?.data ?? json?.listings ?? []);
  return rows;
}

/** Map a ShowMojo row into our Property shape */
export function mapMojoToProperty(m: MojoListing): Property {
  const addrLine = [
    m.address,
    m.unit && !/unit|apt|#/.test(m.unit.toLowerCase()) ? `#${m.unit}` : m.unit,
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

  return {
    id: m.id || m.code || slug,
    slug,
    title,
    address: addrLine || "",
    neighborhood: m.neighborhood || m.city || "",
    beds: m.beds ?? 0,
    baths: m.baths ?? 0,
    areaSqFt: m.square_feet,
    rentFrom: m.rent ?? 0,
    rentTo: m.rent_high,
    available: "TBA",
    images: m.photos?.length ? m.photos : ["/images/sample1.jpg"],
    amenities: [],
    description: m.description || "",
    // add this optional field to your Property type if you haven’t yet
    // (in lib/types.ts: scheduleUrl?: string)
    // @ts-ignore
    scheduleUrl,
  } as Property;
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

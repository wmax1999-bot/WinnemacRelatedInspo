import { NextRequest, NextResponse } from "next/server";
import { fetchMojoListings, buildingKey, mapMojoToProperty } from "@/lib/showmojo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start") ?? undefined; // e.g. 2024-01-01 or 2024-01-01T00:00:00Z
  const end   = url.searchParams.get("end")   ?? undefined; // e.g. 2025-08-19 or 2025-08-19T23:59:59Z

  const listings = await fetchMojoListings({ start, end });

  // Group by building and map to your Property type
  const groupsMap = new Map<string, { building: string; properties: ReturnType<typeof mapMojoToProperty>[] }>();
  for (const m of listings) {
    const { key, label } = buildingKey(m);
    const prop = mapMojoToProperty(m);
    if (!groupsMap.has(key)) groupsMap.set(key, { building: label, properties: [] });
    groupsMap.get(key)!.properties.push(prop);
  }

  const groups = Array.from(groupsMap.values())
    .map(g => ({
      ...g,
      properties: g.properties.sort((a, b) => (a.beds - b.beds) || (a.rentFrom - b.rentFrom)),
    }))
    .sort((a, b) => a.building.localeCompare(b.building));

  return NextResponse.json({ groups, properties: groups.flatMap(g => g.properties) }, { status: 200 });
}

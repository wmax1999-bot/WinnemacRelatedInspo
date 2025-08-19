import { NextResponse } from "next/server";
import { fetchMojoListings, buildingKey, mapMojoToProperty } from "@/lib/showmojo";

export const dynamic = "force-dynamic";

export async function GET() {
  const listings = await fetchMojoListings();
  if (!listings.length) return NextResponse.json({ groups: [], properties: [] }, { status: 200 });

  const groupsMap = new Map<string, { building: string; properties: ReturnType<typeof mapMojoToProperty>[] }>();

  for (const m of listings) {
    const { key, label } = buildingKey(m);
    const asProp = mapMojoToProperty(m);
    if (!groupsMap.has(key)) groupsMap.set(key, { building: label, properties: [] });
    groupsMap.get(key)!.properties.push(asProp);
  }

  // stable sort buildings alpha; within building, sort by beds then rent
  const groups = Array.from(groupsMap.values()).map(g => ({
    ...g,
    properties: g.properties.sort((a, b) => (a.beds - b.beds) || (a.rentFrom - b.rentFrom))
  })).sort((a, b) => a.building.localeCompare(b.building));

  // also return a flat list if you ever need it
  const properties = groups.flatMap(g => g.properties);

  return NextResponse.json({ groups, properties }, { status: 200 });
}

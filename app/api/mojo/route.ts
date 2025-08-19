// app/api/mojo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchMojoListings, buildingKey, mapMojoToProperty } from "@/lib/showmojo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start") ?? undefined;
  const end = url.searchParams.get("end") ?? undefined;

  const rows = await fetchMojoListings({ start, end });
  const props = rows.map(mapMojoToProperty);

  const groupsMap = new Map<string, { building: string; properties: ReturnType<typeof mapMojoToProperty>[] }>();
  rows.forEach((r, i) => {
    const { key, label } = buildingKey(r);
    if (!groupsMap.has(key)) groupsMap.set(key, { building: label, properties: [] });
    groupsMap.get(key)!.properties.push(props[i]);
  });

  const groups = Array.from(groupsMap.values()).sort((a, b) => a.building.localeCompare(b.building));

  return NextResponse.json({
    ok: true,
    count: props.length,
    groupsCount: groups.length,
    groups,
    sample: rows[0] ?? null,
  });
}

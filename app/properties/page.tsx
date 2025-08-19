import nextDynamic from "next/dynamic";
import { getAllProperties } from "@/lib/data";
import PropertyGrid from "@/components/PropertyGrid";
import SectionHeader from "@/components/SectionHeader";

const ShowMojoEmbed = nextDynamic(() => import("@/components/ShowMojoEmbed"), { ssr: false });

export const dynamic = "force-dynamic"; // live ShowMojo data

export default async function PropertiesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // 1) Your local JSON (kept as-is)
  const properties = await getAllProperties();
  const beds = Number(searchParams.beds ?? 0);
  const min  = Number(searchParams.min ?? 0);
  const max  = Number(searchParams.max ?? 0);

  const filteredLocal = properties.filter((p) => {
    const byBeds = beds ? p.beds >= beds : true;
    const byMin  = min  ? p.rentFrom >= min : true;
    const byMax  = max  ? (p.rentTo ?? p.rentFrom) <= max : true;
    return byBeds && byMin && byMax;
  });

  // 2) Live ShowMojo → grouped by building
  const apiBase = process.env.NEXT_PUBLIC_SITE_URL || "";
  let groups: { building: string; properties: typeof filteredLocal }[] = [];
  try {
    const res = await fetch(`${apiBase}/api/mojo`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      groups = data.groups || [];
    }
  } catch {
    // swallow and fall back
  }

  return (
    <section className="container py-12 space-y-12">
      {/* Your existing block */}
      <div>
        <SectionHeader title="All Properties" subtitle="Browse current availability" />
        <PropertyGrid properties={filteredLocal} />
      </div>

      {/* ShowMojo groups (only if API returned data) */}
      {groups.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Live Availability (Grouped by Building)</h2>
          <p className="text-gray-600 mb-6">Sourced in real time from ShowMojo.</p>

          <div className="space-y-10">
            {groups.map((g: any) => (
              <div key={g.building}>
                <h3 className="text-xl font-semibold mb-4">{g.building}</h3>
                <PropertyGrid properties={g.properties} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fallback: keep the iframe if API isn’t configured yet
        <div>
          <h2 className="text-2xl font-semibold mb-3">Schedule a Tour</h2>
          <p className="text-gray-600 mb-6">This list is live from ShowMojo.</p>
          <ShowMojoEmbed />
        </div>
      )}
    </section>
  );
}

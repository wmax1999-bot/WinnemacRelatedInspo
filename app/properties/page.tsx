// app/properties/page.tsx
import { fetchMojoListings, mapMojoToProperty, buildingKey, type MojoListing } from "@/lib/showmojo";
import PropertyGrid from "@/components/PropertyGrid";
import SectionHeader from "@/components/SectionHeader";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - 2);

  const rows: MojoListing[] = await fetchMojoListings({ start, end: now });
  const props: Property[] = rows.map(mapMojoToProperty);

  const byBuilding = rows.reduce<Record<string, { label: string; items: Property[] }>>((acc, row, idx) => {
    const { key, label } = buildingKey(row);
    if (!acc[key]) acc[key] = { label, items: [] };
    acc[key].items.push(props[idx]);
    return acc;
  }, {});
  const groups = Object.values(byBuilding).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <section className="container py-12">
      <SectionHeader title="All Properties" subtitle="Grouped by building" />
      {groups.length === 0 && (
        <p className="mt-4 text-sm text-gray-600">No listings returned from ShowMojo right now.</p>
      )}
      {groups.map(({ label, items }) => (
        <div key={label} className="mb-14">
          <h2 className="text-2xl font-semibold mb-3">{label}</h2>
          <PropertyGrid properties={items} />
        </div>
      ))}
    </section>
  );
}

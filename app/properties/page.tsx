import { fetchMojoListings, mapMojoToProperty, buildingKey } from "@/lib/showmojo";
import PropertyGrid from "@/components/PropertyGrid";
import SectionHeader from "@/components/SectionHeader";
import type { Property } from "@/lib/types";

// Revalidate occasionally so the list stays fresh
export const revalidate = 300; // 5 min

export default async function PropertiesPage() {
  // Pull everything (you can pass { start: "2024-01-01", end: "2025-08-19" } if desired)
  const rows = await fetchMojoListings();
  const props: Property[] = rows.map(mapMojoToProperty);

  // Group by building
  const groups = Object.values(
    rows.reduce<Record<string, { label: string; items: Property[] }>>((acc, row, i) => {
      const { key, label } = buildingKey(row);
      if (!acc[key]) acc[key] = { label, items: [] };
      acc[key].items.push(props[i]);
      return acc;
    }, {})
  ).sort((a, b) => a.label.localeCompare(b.label));

  // Fallback: if API returns nothing, show the ShowMojo iframe for now
  if (groups.length === 0) {
    return (
      <section className="container py-12">
        <SectionHeader title="All Properties" subtitle="Live from ShowMojo" />
        <div className="rounded-2xl overflow-hidden ring-1 ring-black/10">
          <iframe
            className="w-full"
            style={{ border: 0, height: 900 }}
            name="ShowMojoListingFrame"
            scrolling="yes"
            frameBorder="0"
            src="https://showmojo.com/981f1460d4/l"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <p className="text-sm text-gray-500 mb-6">This list is live from ShowMojo.</p>

      {groups.map(({ label, items }) => (
        <div key={label} className="mb-14">
          <SectionHeader
            title={label}
            subtitle={`${items.length} home${items.length > 1 ? "s" : ""} available`}
          />
          <PropertyGrid properties={items} />
        </div>
      ))}
    </section>
  );
}

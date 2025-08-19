// app/properties/page.tsx
import { fetchMojoListings, mapMojoToProperty, buildingKey, type MojoListing } from "@/lib/showmojo";
import PropertyGrid from "@/components/PropertyGrid";
import SectionHeader from "@/components/SectionHeader";
import type { Property } from "@/lib/types";

export const revalidate = 300; // 5 minutes

export default async function PropertiesPage() {
  // Pull live data (pass dates if you want to restrict range)
  const rows: MojoListing[] = await fetchMojoListings();
  const props: Property[] = rows.map(mapMojoToProperty);

  // Group by building label derived from ShowMojo row
  const groups = Object.values(
    rows.reduce<Record<string, { label: string; items: Property[] }>>((acc, row, idx) => {
      const { key, label } = buildingKey(row);
      if (!acc[key]) acc[key] = { label, items: [] };
      acc[key].items.push(props[idx]);
      return acc;
    }, {})
  ).sort((a, b) => a.label.localeCompare(b.label));

  // Fallback: if the API gives nothing, show the iframe so the page isn't empty
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
            subtitle={`${items.length} unit${items.length > 1 ? "s" : ""} available`}
          />
          <PropertyGrid properties={items} />
        </div>
      ))}
    </section>
  );
}

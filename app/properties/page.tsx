import { getAllProperties } from "@/lib/data";
import PropertyGrid from "@/components/PropertyGrid";
import SectionHeader from "@/components/SectionHeader";

export const dynamic = "force-static";

export default async function PropertiesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const properties = await getAllProperties();
  // Simple client-side-like filtering emulation on server for now
  const beds = Number(searchParams.beds ?? 0);
  const min = Number(searchParams.min ?? 0);
  const max = Number(searchParams.max ?? 0);

  const filtered = properties.filter(p => {
    const byBeds = beds ? p.beds >= beds : true;
    const byMin = min ? p.rentFrom >= min : true;
    const byMax = max ? (p.rentTo ?? p.rentFrom) <= max : true;
    return byBeds && byMin && byMax;
  });

  return (
    <section className="container py-12">
      <SectionHeader title="All Properties" subtitle="Browse current availability" />
      <PropertyGrid properties={filtered} />
    </section>
  );
}

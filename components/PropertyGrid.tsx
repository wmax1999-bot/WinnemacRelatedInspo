import type { Property } from "@/lib/types";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  if (!properties.length) {
    return <div className="text-gray-600">No properties found.</div>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}

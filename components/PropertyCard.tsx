import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";

export default function PropertyCard({ property }: { property: Property }) {
  return (
<Link href={`/properties/${property.slug}`} className="group rounded-2xl bg-white border shadow-sm overflow-hidden block">
  <div className="relative aspect-[4/3] w-full">
    <Image src={property.images[0] ?? "/images/sample1.jpg"} alt={property.title} fill
      className="object-cover transition-transform duration-500 group-hover:scale-105" />
  </div>
  <div className="p-5 space-y-1">
    <div className="text-xs uppercase tracking-wider text-gray-500">{property.neighborhood}</div>
    <h3 className="text-lg font-medium">{property.title}</h3>
    <div className="text-sm text-gray-600">{property.address}</div>
    <div className="text-sm">{property.beds} BR · {property.baths} BA{property.areaSqFt ? ` · ${property.areaSqFt} SF` : ""}</div>
    <div className="pt-2 font-medium">${property.rentFrom}{property.rentTo ? ` – $${property.rentTo}` : ""} / mo</div>
  </div>
</Link>


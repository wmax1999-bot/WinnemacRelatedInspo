import Image from "next/image";
import { getPropertyBySlug } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  return {
    title: property ? property.title : "Residence",
    description: property?.description ?? undefined
  };
}

export default async function PropertyDetail({ params }: Props) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) return <div className="container py-12">Not found.</div>;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-semibold">{property.title}</h1>
      <p className="text-gray-600">{property.address} · {property.neighborhood}</p>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          {/* Placeholder local images; replace with actual listing images */}
          <Image src={property.images[0] ?? "/images/sample1.jpg"} alt={property.title} fill className="object-cover" />
        </div>
        <div className="space-y-3">
          <div className="text-xl">
            {property.beds} BR · {property.baths} BA{property.areaSqFt ? ` · ${property.areaSqFt} SF` : ""}
          </div>
          <div className="text-lg">
            From ${property.rentFrom}{property.rentTo ? ` – $${property.rentTo}` : ""} / mo
          </div>
          <div className="text-sm text-gray-600">Available: {property.available ?? "TBA"}</div>
          {property.amenities?.length ? (
            <ul className="list-disc list-inside text-sm">
              {property.amenities.map(a => <li key={a}>{a}</li>)}
            </ul>
          ) : null}

          <div className="pt-4 flex gap-3">
            <a href="/contact" className="px-4 py-2 rounded-xl border">Schedule a Tour</a>
            <a href="/residents" className="px-4 py-2 rounded-xl border">Apply Now</a>
          </div>
        </div>
      </div>

      {property.images?.[1] ? (
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {property.images.slice(1).map((src, i) => (
            <div key={src + i} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src={src} alt={`${property.title} ${i+2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

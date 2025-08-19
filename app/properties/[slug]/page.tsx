import Image from "next/image";
import type { Metadata } from "next";
import type { Property } from "@/lib/types";
import { getPropertyBySlug } from "@/lib/data";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  return {
    title: property ? property.title : "Residence",
    description: property?.description ?? undefined,
  };
}

export default async function PropertyDetail({ params }: Props) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return (
      <section className="container py-12">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-gray-600 mt-2">
          We couldn’t find that residence.{" "}
          <a href="/properties" className="underline">Back to all properties</a>.
        </p>
      </section>
    );
  }

  const scheduleHref = (property as Property).scheduleUrl || "/schedule";

  return (
    <div className="container py-8">
      <a href="/properties" className="text-sm text-gray-600 hover:text-gray-900">
        ← Back to all properties
      </a>

      <h1 className="mt-2 text-3xl font-semibold">{property.title}</h1>
      <p className="text-gray-600">{property.address} · {property.neighborhood}</p>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Media */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={property.images?.[0] ?? "/images/sample1.jpg"}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Details / CTAs */}
        <div className="space-y-3 md:sticky md:top-24 h-max">
          <div className="text-xl">
            {property.beds} BR · {property.baths} BA
            {property.areaSqFt ? ` · ${property.areaSqFt} SF` : ""}
          </div>
          <div className="text-lg">
            From ${property.rentFrom}
            {property.rentTo ? ` – $${property.rentTo}` : ""} / mo
          </div>
          <div className="text-sm text-gray-600">
            Available: {property.available ?? "TBA"}
          </div>

          {property.amenities?.length ? (
            <ul className="list-disc list-inside text-sm">
              {property.amenities.map((a: string) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : null}

          <div className="pt-4 flex gap-3">
            <a
              href={scheduleHref}
              target={scheduleHref.startsWith("http") ? "_blank" : undefined}
              rel={scheduleHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-5 py-3 rounded-xl bg-black text-white"
            >
              Schedule a Tour
            </a>
            <a href="/residents" className="px-5 py-3 rounded-xl border">
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {property.images?.length && property.images.length > 1 ? (
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {property.images.slice(1).map((src, i) => (
            <div key={`${src}-${i}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src={src} alt={`${property.title} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {property.description ? (
        <div className="mt-8 max-w-3xl text-gray-800 leading-relaxed">
          {property.description}
        </div>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";

function formatMoney(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PropertyCard({ property }: { property: Property }) {
  const href = property.scheduleUrl ?? `/properties/${property.slug}`;
  const external = Boolean(property.scheduleUrl);

  const priceLow = formatMoney(property.rentFrom);
  const priceHigh = property.rentTo ? ` – ${formatMoney(property.rentTo)}` : "";
  const sqft = property.areaSqFt ? ` · ${property.areaSqFt} SF` : "";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group block rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={property.images?.[0] ?? "/images/sample1.jpg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          priority={false}
        />
        {property.available && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-black/5">
            {property.available}
          </span>
        )}
      </div>

      <div className="p-5 space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider text-gray-500">
          {property.neighborhood}
        </div>

        <h3 className="text-lg font-medium leading-snug line-clamp-2">
          {property.title}
        </h3>

        <div className="text-sm text-gray-600 line-clamp-1">
          {property.address}
        </div>

        <div className="text-sm text-gray-700">
          {property.beds} BR · {property.baths} BA{sqft}
        </div>

        <div className="pt-2 text-base font-semibold">
          {priceLow}
          {priceHigh} <span className="font-normal text-gray-500">/ mo</span>
        </div>

        {external && (
          <div className="pt-3">
            <span className="inline-flex items-center gap-1 rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-gray-900">
              View on ShowMojo
              <svg
                className="h-4 w-4 opacity-90"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.5 3a.75.75 0 0 0 0 1.5h2.69l-7.72 7.72a.75.75 0 1 0 1.06 1.06l7.72-7.72V8.5a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 16.5 3h-4z" />
                <path d="M5 5.75A1.75 1.75 0 0 1 6.75 4h3a.75.75 0 0 0 0-1.5h-3A3.25 3.25 0 0 0 3.5 5.75v8.5A3.25 3.25 0 0 0 6.75 17.5h8.5A3.25 3.25 0 0 0 18.5 14.25v-3a.75.75 0 0 0-1.5 0v3A1.75 1.75 0 0 1 15.25 16h-8.5A1.75 1.75 0 0 1 5 14.25v-8.5z" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

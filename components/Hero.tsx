import Image from "next/image";
import SearchBar from "@/components/SearchBar";

export default function Hero() {
  return (
    <section className="relative h-[64vh] min-h-[560px] w-full overflow-hidden">
      <Image
        src="/images/chicago-hero.jpg"
        alt="Chicago skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

      <div className="relative container h-full flex items-end pb-12">
        <div className="text-white">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight drop-shadow">
            Chicago Residences
          </h1>
          <p className="mt-2 text-white/90 max-w-xl">
            Modern apartments in Rogers Park, Edgewater, and beyond.
          </p>

          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}

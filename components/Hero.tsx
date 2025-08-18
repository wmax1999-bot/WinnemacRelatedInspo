import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-20 md:py-28">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Homes that feel <span className="text-brand">effortless</span>.
        </h1>
        <p className="text-gray-600 max-w-2xl mt-4">
          Modern apartments in vibrant neighborhoods—designed for everyday living.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/properties" className="px-5 py-3 rounded-xl border">Browse Properties</Link>
          <Link href="/contact" className="px-5 py-3 rounded-xl border">Schedule a Tour</Link>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_10%_10%,#e0f2ff,transparent),radial-gradient(600px_circle_at_90%_20%,#f0f9ff,transparent)]" />
    </section>
  );
}

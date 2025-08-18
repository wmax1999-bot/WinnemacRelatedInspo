import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[520px] w-full overflow-hidden">
      <img
        src="/images/chicago-hero.jpg"
        alt="Chicago skyline"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="relative container h-full flex items-end pb-12">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Chicago Residences</h1>
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

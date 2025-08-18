import SearchBar from "@/components/SearchBar";

export default function Hero() {
  return (
    <section className="relative h-[64vh] min-h-[560px] w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        poster="/images/chicago-hero.jpg"
      >
        {/* WebM first (if present), then MP4 */}
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/chicago_drone_shot.mp4.mp4" type="video/mp4" />
      </video>

      {/* stronger gradient for nav contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent" />

      {/* Content */}
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

import neighborhoods from "@/data/neighborhoods.json";

export default function NeighborhoodsPage() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-semibold mb-6">Neighborhoods</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {neighborhoods.map(n => (
          <div key={n.name} className="rounded-2xl border p-6">
            <h2 className="text-xl font-medium">{n.name}</h2>
            <p className="text-gray-600 mt-2">{n.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [beds, setBeds] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const router = useRouter();

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (beds) params.set("beds", beds);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={go} className="flex flex-wrap gap-2 bg-white/95 rounded-2xl p-2 shadow">
      <select
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
        className="px-4 py-2 rounded-xl border bg-white"
      >
        <option value="">Beds</option>
        <option value="0">Studio+</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
      </select>

      <input
        value={min}
        onChange={(e) => setMin(e.target.value)}
        type="number"
        min={0}
        placeholder="Min $"
        className="px-4 py-2 rounded-xl border bg-white w-28"
      />
      <input
        value={max}
        onChange={(e) => setMax(e.target.value)}
        type="number"
        min={0}
        placeholder="Max $"
        className="px-4 py-2 rounded-xl border bg-white w-28"
      />

      <button className="px-5 py-2 rounded-xl bg-black text-white">
        Search
      </button>
    </form>
  );
}

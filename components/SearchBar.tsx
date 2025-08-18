"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [beds, setBeds] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (beds) p.set("beds", beds);
    if (min) p.set("min", min);
    if (max) p.set("max", max);
    router.push(p.toString() ? `/properties?${p.toString()}` : "/properties");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 bg-white/95 rounded-2xl p-2 shadow ring-1 ring-black/5 text-gray-900"
    >
      <select
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
        className="px-4 py-2 rounded-xl border bg-white text-gray-900"
        aria-label="Minimum beds"
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
        className="px-4 py-2 rounded-xl border bg-white w-28 text-gray-900 placeholder-gray-600"
        aria-label="Minimum rent"
      />

      <input
        value={max}
        onChange={(e) => setMax(e.target.value)}
        type="number"
        min={0}
        placeholder="Max $"
        className="px-4 py-2 rounded-xl border bg-white w-28 text-gray-900 placeholder-gray-600"
        aria-label="Maximum rent"
      />

      <button type="submit" className="px-5 py-2 rounded-xl bg-black text-white">
        Search
      </button>
    </form>
  );
}

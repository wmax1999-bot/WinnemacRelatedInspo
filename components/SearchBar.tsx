"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SearchBar() {
  const [beds, setBeds] = useState<string>("");
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const router = useRouter();

  const go = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (beds) params.set("beds", beds);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    const q = params.toString();
    router.push(q ? `/properties?${q}` : "/properties");
  };

  return (
    <form
      onSubmit={go}
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

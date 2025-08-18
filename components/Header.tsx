"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "/properties", label: "Properties" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/about", label: "About" },
  { href: "/residents", label: "Residents" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition
      ${solid ? "bg-white/95 backdrop-blur border-b shadow-sm" : "bg-transparent"}
    `}
    >
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className={`font-semibold text-lg ${solid ? "text-gray-900" : "text-white drop-shadow"}`}>
          Winnemac
        </Link>

        <nav className="hidden md:flex gap-8">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`${solid ? "text-gray-800" : "text-white"} text-sm hover:opacity-75`}
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <Link href="/properties" className={`${solid ? "text-gray-800" : "text-white"} md:hidden text-sm underline`}>
          Browse
        </Link>
      </div>
    </header>
  );
}

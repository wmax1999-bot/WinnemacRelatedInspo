import Link from "next/link";

const nav = [
  { href: "/properties", label: "Properties" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/about", label: "About" },
  { href: "/residents", label: "Residents" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-semibold text-lg">Winnemac</Link>
        <nav className="hidden md:flex gap-6">
          {nav.map(i => (
            <Link key={i.href} href={i.href} className="text-sm hover:underline">{i.label}</Link>
          ))}
        </nav>
        <Link href="/properties" className="md:hidden text-sm underline">Browse</Link>
      </div>
    </header>
  );
}

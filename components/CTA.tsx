import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">Ready to find your next home?</h3>
          <p className="text-gray-600">Browse availability or schedule a tour with our team.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/properties" className="px-5 py-3 rounded-xl border">View Properties</Link>
          <Link href="/contact" className="px-5 py-3 rounded-xl border">Talk to Us</Link>
        </div>
      </div>
    </section>
  );
}

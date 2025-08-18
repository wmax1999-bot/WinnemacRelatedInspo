import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import PropertyGrid from "@/components/PropertyGrid";
import CTA from "@/components/CTA";
import { getAllProperties } from "@/lib/data";

export default async function HomePage() {
  const properties = await getAllProperties();
  return (
    <div>
      <Hero />
      <section className="container py-12">
        <SectionHeader title="Featured Residences" subtitle="Curated homes available now" />
        <PropertyGrid properties={properties.slice(0, 6)} />
      </section>
      <CTA />
    </div>
  );
}

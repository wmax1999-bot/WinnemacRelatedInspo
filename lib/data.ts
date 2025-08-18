import propertiesSeed from "@/data/properties.json";
import type { Property } from "./types";

export const getAllProperties = async (): Promise<Property[]> => {
  // In production, you can fetch from your database or ShowMojo/AppFolio.
  // For now, we serve local JSON (statically importable).
  return propertiesSeed as Property[];
};

export const getPropertyBySlug = async (slug: string): Promise<Property | null> => {
  const list = await getAllProperties();
  return list.find(p => p.slug === slug) ?? null;
};

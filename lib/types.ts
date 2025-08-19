// lib/types.ts
export type Property = {
  id: string;
  slug: string;
  title: string;
  address: string;
  neighborhood: string;
  beds: number;
  baths: number;
  areaSqFt?: number;
  rentFrom: number;
  rentTo?: number;
  available?: string;
  images: string[];
  amenities?: string[];
  description?: string;
  /** Present when sourced from ShowMojo */
  scheduleUrl?: string;
};

export type PropertyGroup = {
  building: string;
  properties: Property[];
};

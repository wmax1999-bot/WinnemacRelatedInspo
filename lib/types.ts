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
  available?: string; // ISO date or 'Now'
  images: string[];
  amenities?: string[];
  description?: string;
  coordinates?: { lat: number; lng: number };
};

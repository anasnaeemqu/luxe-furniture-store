// Type definition for Product — matches the database schema.
// Static PRODUCTS/CATEGORIES arrays have been removed; all data is now
// fetched from the API (PostgreSQL). See src/pages/* for usage.

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  dimensions: string;
  material: string;
  image: string;
  thumbnails: string[];
  createdAt?: string;
}

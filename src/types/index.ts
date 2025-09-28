export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  stock_count: number;
  units_sold: number;
  total_revenue: number;
  created_at: string;
  rating: {
    avg: number;
    count: number;
    breakdown: { [key: string]: number };
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  name?: string;
  rating: number;
  text: string;
  images?: string[];
  created_at: string;
}

export interface DatabaseSchema {
  meta: {
    brand: string;
    generated_at: string;
    version: string;
  };
  settings: {
    theme: 'light' | 'dark';
    admin_pin_hash: string;
    demo_mode: boolean;
  };
  products: Product[];
}

export interface LeaderboardItem {
  rank: number;
  id: string;
  name: string;
  slug?: string;
  thumb?: string;
  units_sold?: number;
  total_revenue?: number;
}
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  gender: 'Hombres' | 'Mujeres' | 'Unisex';
  brand: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
}

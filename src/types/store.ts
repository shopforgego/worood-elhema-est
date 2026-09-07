export interface Product {
  id: string;
  name: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  regular_price?: number;
  originalPrice?: number;
  sale_price?: number;
  currency?: string;
  currency_symbol?: string;
  category: string;
  categories?: string[];
  brand?: string;
  vendor?: string;
  sku?: string;
  barcode?: string;
  in_stock?: boolean;
  inStock?: boolean;
  quantity?: number;
  images?: string[];
  main_image?: string;
  image?: string;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  features?: string[];
  compatibility?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreConfig {
  storeNameAr: string;
  storeNameEn: string;
  companyNameAr: string;
  companyNameEn: string;
  taglineAr: string;
  taglineEn: string;
  cr: string;
  taxNumber: string;
  shortAddress: string;
  city: string;
  district: string;
  fullAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  supportHours: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingCost: number;
}

import { z } from "zod";

// Product type for discount deals website
export interface Product {
  "product-url": string;
  title: string;
  "old-price": string;
  "new-price": string;
  "img-url": string;
  "img-alt": string;
  categories: string;
  "description-html": string;
  "meta-description": string;
  "meta-title": string;
  "discount-percent": number;
  rating?: string;
  "review-count"?: number;
  badge?: string;
  features?: string[];
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Filter types
export interface ProductFilters {
  category?: string;
  priceRange?: string;
  rating?: string;
  search?: string;
}

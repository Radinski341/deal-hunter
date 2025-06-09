import { useQuery } from "@tanstack/react-query";
import { Product, ProductFilters, Category } from "@/shared/schema"; 
import fullProductsData from "@/data/full-products.json";
import categoriesData from "@/data/categories.json";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: async () => {
      let products = fullProductsData as Product[];
      
      if (filters?.category && filters.category !== 'all') {
        products = products.filter(p => 
          p.categories.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.categories.toLowerCase().includes(searchTerm) ||
          p["description-html"].toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters?.priceRange) {
        products = products.filter(p => {
          const price = parseFloat(p["new-price"].replace('$', ''));
          switch (filters.priceRange) {
            case 'under-100':
              return price < 100;
            case '100-300':
              return price >= 100 && price <= 300;
            case '300-500':
              return price >= 300 && price <= 500;
            case 'over-500':
              return price > 500;
            default:
              return true;
          }
        });
      }
      
      return products;
    },
  });
}

export function useProduct(productUrl: string) {
  return useQuery({
    queryKey: ['deal', productUrl],
    queryFn: async () => {
      const product = fullProductsData.find(p => p["product-url"] === productUrl);
      if (!product) {
        throw new Error('Product not found');
      }
      return product as Product;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return categoriesData as Category[];
    },
  });
}

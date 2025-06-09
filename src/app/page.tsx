// src/app/page.tsx
import { getFeaturedProducts } from "@/lib/productData";
import predefinedCategories from '@/data/predefined-categories.json';
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const categories = predefinedCategories.map(cat => ({
    slug: cat.displayName.toLowerCase().replace(/\s+/g, "-"),
    name: cat.displayName,
  }));
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any, index: number) => (
              <ProductCard key={product["product-url"] || index} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
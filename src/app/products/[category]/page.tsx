// src/app/products/[category]/page.tsx
import ClientHome from "@/components/ClientHome";
import { getAllProducts } from "@/lib/productData";
import { ProductFilters } from "@/shared/schema";

function getStringParam(param: string | string[] | undefined): string {
  return Array.isArray(param) ? param[0] : param || "";
}

export default async function CategoryProducts({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const { paramSearch, paramPriceRange, paramPage } = await searchParams;
  const search = getStringParam(paramSearch);
  const priceRange = getStringParam(paramPriceRange);
  const page = parseInt(getStringParam(paramPage) || "1", 10);
  const limit = 12;

  const initialFilters: ProductFilters = { category, search, priceRange };
  const { products, total } = await getAllProducts(page, limit, initialFilters);

  return (
    <ClientHome
      initialProducts={products}
      initialFilters={initialFilters}
      initialPage={page}
      totalProducts={total}
      isProductsPage={true}
      currentCategory={category}
    />
  );
}
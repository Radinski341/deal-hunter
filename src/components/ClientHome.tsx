// src/components/ClientHome.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Grid, List, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductFilters } from "@/shared/schema";

export default function ClientHome({
  initialProducts,
  initialFilters,
  initialPage,
  totalProducts,
  maxProducts,
  isProductsPage = false,
  currentCategory = "all",
}: {
  initialProducts: any[];
  initialFilters: ProductFilters;
  initialPage: number;
  totalProducts: number;
  maxProducts?: number;
  isProductsPage?: boolean;
  currentCategory?: string;
}) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get("category") || initialFilters.category || "all",
    search: searchParams.get("search") || initialFilters.search || "",
    priceRange: searchParams.get("priceRange") || initialFilters.priceRange || "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || initialPage.toString(), 10) || 1
  );
  const [products, setProducts] = useState(initialProducts || []);
  const [total, setTotal] = useState(totalProducts || 0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category") || initialFilters.category || "all",
      search: searchParams.get("search") || initialFilters.search || "",
      priceRange: searchParams.get("priceRange") || initialFilters.priceRange || "",
    };
    const newPage = parseInt(searchParams.get("page") || initialPage.toString(), 10) || 1;

    if (
      JSON.stringify(newFilters) !== JSON.stringify(filters) ||
      newPage !== currentPage
    ) {
      setFilters(newFilters);
      setCurrentPage(newPage);
    }
  }, [searchParams, initialFilters, initialPage]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const url = new URL("/api/products", window.location.origin);
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set("limit", itemsPerPage.toString());
      if (filters.category && filters.category !== "all") {
        url.searchParams.set("category", filters.category);
      }
      if (filters.search) {
        url.searchParams.set("search", filters.search);
      }
      if (filters.priceRange) {
        url.searchParams.set("priceRange", filters.priceRange);
      }
      if (!isProductsPage && maxProducts) {
        url.searchParams.set("maxProducts", maxProducts.toString());
      }

      try {
        const response = await fetch(url.toString(), { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [currentPage, filters, isProductsPage, maxProducts]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            parseFloat(a["new-price"].replace("$", "")) -
            parseFloat(b["new-price"].replace("$", ""))
          );
        case "price-high":
          return (
            parseFloat(b["new-price"].replace("$", "")) -
            parseFloat(a["new-price"].replace("$", ""))
          );
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const updateURL = (newFilters: ProductFilters, page: number) => {
    const url = new URL(window.location.href);
    if (newFilters.search) {
      url.searchParams.set("search", newFilters.search);
    } else {
      url.searchParams.delete("search");
    }
    if (newFilters.priceRange) {
      url.searchParams.set("priceRange", newFilters.priceRange);
    } else {
      url.searchParams.delete("priceRange");
    }
    if (page > 1) {
      url.searchParams.set("page", page.toString());
    } else {
      url.searchParams.delete("page");
    }
    window.history.pushState({}, "", url.toString());
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    if (newFilters.category !== currentCategory) {
      const url = new URL(window.location.origin);
      if (newFilters.category && newFilters.category !== "all") {
        url.pathname = `/products/${newFilters.category}`;
      } else {
        url.pathname = "/products";
      }
      if (newFilters.search) url.searchParams.set("search", newFilters.search);
      if (newFilters.priceRange) url.searchParams.set("priceRange", newFilters.priceRange);
      url.searchParams.set("page", "1");
      window.location.href = url.toString();
    } else {
      const updatedFilters = { ...newFilters, category: currentCategory };
      setFilters(updatedFilters);
      setCurrentPage(1);
      updateURL(updatedFilters, 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb className="mb-6 text-gray-700">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {filters.category === "all" ? "All Products" : filters.category}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </aside>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-gray-700">
              <p>
                <span className="font-medium">{total}</span> products found
              </p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Sort by: Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-gray-300 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-600">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No products found.</div>
            ) : (
              <div
                className={`grid gap-6 mb-8 ${
                  viewMode === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                }`}
              >
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product["product-url"] || index} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                    className={`${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
                {totalPages > 5 && <span className="px-2 text-gray-700">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
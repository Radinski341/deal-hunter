// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Tag, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    }
    fetchCategories();

    const url = new URL(window.location.href);
    const pathParts = url.pathname.split('/');
    const categoryFromPath = pathParts[2] || "all";
    setCurrentCategory(categoryFromPath);
    const search = url.searchParams.get("search") || "";
    setSearchQuery(search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.origin + "/products");
    if (searchQuery.trim()) {
      url.searchParams.set("search", searchQuery.trim());
    }
    window.location.href = url.toString();
  };

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === "all") {
      window.location.href = "/products";
    } else {
      window.location.href = `/products/${categorySlug}`;
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold flex items-center">
                <TrendingDown className="w-8 h-8 mr-2" />
                Deal<span className="text-yellow-300">Hunter</span>
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search for amazing deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/70 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-yellow-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-yellow-300 text-orange-800 font-semibold">
              <Tag className="w-3 h-3 mr-1" />
              Hot Deals
            </Badge>
            <Button className="bg-white text-orange-600 hover:bg-yellow-100">
              Best Offers
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-3 overflow-x-auto">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`whitespace-nowrap text-sm font-medium ${
                currentCategory === "all"
                  ? "text-yellow-300 border-b-2 border-yellow-300"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={`whitespace-nowrap text-sm font-medium ${
                  currentCategory === category.slug
                    ? "text-yellow-300 border-b-2 border-yellow-300"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/productData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const priceRange = searchParams.get("priceRange") || "";

  const filters = { category, search, priceRange };
  const { products, total } = await getAllProducts(page, limit, filters);

  return NextResponse.json({ products, total });
}
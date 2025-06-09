import { NextResponse } from "next/server";
import predefinedCategories from '@/data/predefined-categories.json';

export async function GET() {
  try {
    const categories = predefinedCategories.map(cat => ({
      slug: cat.displayName.toLowerCase().replace(/\s+/g, "-"),
      name: cat.displayName
    }));
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
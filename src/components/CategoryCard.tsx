// src/components/CategoryCard.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products/${category.slug}`}>
      <Card className="bg-white hover:shadow-lg transition-shadow duration-300 group border-2 hover:border-primary/20">
        <CardContent className="p-6 flex items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
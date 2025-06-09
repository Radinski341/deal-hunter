"use client"
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/shared/schema";
import { redirectToAmazon } from "@/lib/affiliateLinks";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleGetDeal = () => {
    redirectToAmazon(product["product-url"], 0, product.title, product["new-price"]);
  };

  const calculateSavings = () => {
    const oldPrice = parseFloat(product["old-price"].replace('$', ''));
    const newPrice = parseFloat(product["new-price"].replace('$', ''));
    return (oldPrice - newPrice).toFixed(2);
  };

  const calculateSavingsPercentage = () => {
    const oldPrice = parseFloat(product["old-price"].replace('$', ''));
    const newPrice = parseFloat(product["new-price"].replace('$', ''));
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  const renderStars = (rating?: string) => {
    if (!rating) return null;
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i}>★</span>
        ))}
        {hasHalfStar && <span>☆</span>}
      </div>
    );
  };

  const getRandomCallToAction = () => {
    const actions = ["Get Deal", "Buy Now", "Catch Deal", "Grab Now", "Shop Deal"];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  return (
    <Card 
      className="bg-white hover:shadow-lg transition-shadow duration-300 group border-2 hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${encodeURIComponent(product.title)}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product["img-url"] || "https://via.placeholder.com/400"}
            alt={product["img-alt"] || `Image of ${product.title}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product["discount-percent"] > 0 && (
            <Badge variant="destructive" className="absolute top-3 left-3 text-xs font-semibold animate-pulse">
              {product["discount-percent"]}% OFF
            </Badge>
          )}
          {product.badge && (
            <Badge variant="secondary" className="absolute top-3 right-3 text-xs font-semibold">
              {product.badge}
            </Badge>
          )}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Limited Time
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/product/${encodeURIComponent(product.title)}`}>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        {product.rating && product["review-count"] && (
          <div className="flex items-center mb-2">
            {renderStars(product.rating)}
            <span className="text-gray-600 text-sm ml-2">
              {product.rating} ({product["review-count"]?.toLocaleString() || '0'} reviews)
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">{product["new-price"]}</span>
            <span className="text-sm text-gray-500 line-through">{product["old-price"]}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-green-600 font-medium flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              Save ${calculateSavings()}
            </span>
            <span className="text-xs text-green-500 font-bold">
              {calculateSavingsPercentage()}% OFF
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleGetDeal}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 transform hover:scale-105 transition-all duration-200"
            size="lg"
          >
            {getRandomCallToAction()}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Deal ends soon • Free shipping available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
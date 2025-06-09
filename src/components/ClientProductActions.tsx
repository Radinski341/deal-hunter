"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirectToAmazon } from "@/lib/affiliateLinks";

interface ClientProductActionsProps {
  productUrl: string;
  title: string;
  newPrice: string;
  isFinalCta?: boolean;
  savings?: string;
}

export default function ClientProductActions({
  productUrl,
  title,
  newPrice,
  isFinalCta = false,
  savings,
}: ClientProductActionsProps) {
  const handleGetDeal = () => {
    redirectToAmazon(productUrl, 0, title, newPrice);
  };

  const getRandomCallToAction = () => {
    const actions = ["Get This Deal", "Claim Discount", "Buy Now", "Grab This Offer", "Shop Deal"];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  if (isFinalCta) {
    return (
      <Button
        onClick={handleGetDeal}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-3 text-lg"
        size="lg"
      >
        Claim Deal Now - Save ${savings}!
      </Button>
    );
  }

  return (
    <Button
      onClick={handleGetDeal}
      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg transform hover:scale-105 transition-all duration-200"
      size="lg"
    >
      {getRandomCallToAction()}
      <ExternalLink className="w-5 h-5 ml-2" />
    </Button>
  );
}
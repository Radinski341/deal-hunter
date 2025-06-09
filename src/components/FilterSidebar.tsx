import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductFilters } from "@/shared/schema";

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handlePriceRangeChange = (value: string) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleRatingChange = (value: string, checked: boolean) => {
    onFiltersChange({ ...filters, rating: checked ? value : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({ category: filters.category });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filter Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <RadioGroup 
            value={filters.priceRange || ""} 
            onValueChange={handlePriceRangeChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under-100" id="under-100" />
              <Label htmlFor="under-100" className="text-sm">Under $100</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100-300" id="100-300" />
              <Label htmlFor="100-300" className="text-sm">$100 - $300</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="300-500" id="300-500" />
              <Label htmlFor="300-500" className="text-sm">$300 - $500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="over-500" id="over-500" />
              <Label htmlFor="over-500" className="text-sm">Over $500</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Customer Rating */}
        <div>
          <h4 className="font-medium mb-3">Customer Rating</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rating-4"
                checked={filters.rating === "4-plus"}
                onCheckedChange={(checked) => handleRatingChange("4-plus", checked as boolean)}
              />
              <Label htmlFor="rating-4" className="text-sm flex items-center">
                <span className="flex text-yellow-400">★★★★</span>
                <span className="ml-1 text-gray-600">& up</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rating-3"
                checked={filters.rating === "3-plus"}
                onCheckedChange={(checked) => handleRatingChange("3-plus", checked as boolean)}
              />
              <Label htmlFor="rating-3" className="text-sm flex items-center">
                <span className="flex text-yellow-400">★★★</span>
                <span className="ml-1 text-gray-600">& up</span>
              </Label>
            </div>
          </div>
        </div>


        <Button 
          onClick={clearFilters}
          variant="outline" 
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}

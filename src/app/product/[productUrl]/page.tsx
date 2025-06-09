import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, TrendingDown, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import ClientProductActions from "@/components/ClientProductActions";
import { getProductByTitle } from "@/lib/productData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productUrl: string }>;
}): Promise<Metadata> {
  const { productUrl } = await params;
  const decodedUrl = decodeURIComponent(productUrl);
  const product = await getProductByTitle(decodedUrl);

  if (!product || !product.title) {
    return {
      title: "Product Not Found - Tech Deals",
      description: "The product you are looking for is not available.",
    };
  }

  return {
    title: `${product.title.trim()} - Tech Deals`,
    description: product["meta-description"] || `Get the best deal on ${product.title.trim()} at Tech Deals. Save big with discounts up to ${product["discount-percent"]}% off!`,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ productUrl: string }>;
}) {
  const { productUrl } = await params;
  const decodedUrl = decodeURIComponent(productUrl);
  const product = await getProductByTitle(decodedUrl);
  console.log("Product Detail Page - Product:", product);
  if (!product) {
    notFound();
  }

  const calculateSavings = () => {
    const oldPrice = parseFloat(product["old-price"].replace("$", ""));
    const newPrice = parseFloat(product["new-price"].replace("$", ""));
    return (oldPrice - newPrice).toFixed(2);
  };

  if (!product || !product.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800">Product Not Found</h1>
      </div>
    );
  }

  const cleanTitle = product.title.trim();
  const category = product.categories.split("|")[0] || "Deals";

  const extractFeatures = (description: string) => {
    const cleanedDescription = description
      .replace(/Show more/g, '')
      .replace(/See more product details/g, '')
      .trim();

    const sentenceRegex = /([A-Z][^.!?]*\.)/g;
    const bulletPoints = [];

    let match;
    while ((match = sentenceRegex.exec(cleanedDescription)) !== null) {
      const sentence = match[1].trim();
      if (sentence.length > 0 && !sentence.includes('About this item')) {
        bulletPoints.push(sentence);
      }
    }

    return bulletPoints.slice(0, 6);
  };

  const features = extractFeatures(product["description-html"]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-700">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/?category=${category.toLowerCase()}`}
                className="text-slate-700"
              >
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-slate-700">{cleanTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-700">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Deals
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="relative overflow-hidden rounded-lg bg-white p-4">
                <img
                  src={product["img-url"] || "https://via.placeholder.com/400"}
                  alt={product["img-alt"] || `Image of ${product.title}`}
                  className="w-full h-96 object-contain"
                />
                {product["discount-percent"] > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-6 left-6 text-lg font-bold px-3 py-2 animate-pulse"
                  >
                    {product["discount-percent"]}% OFF
                  </Badge>
                )}
                <div className="absolute bottom-6 right-6 bg-black/70 text-white px-3 py-2 rounded-full text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Limited Time Deal
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{cleanTitle}</h1>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold text-primary">
                      {product["new-price"]}
                    </span>
                    <span className="text-xl text-orange-900 line-through">
                      {product["old-price"]}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-600 font-semibold text-lg">
                      <TrendingDown className="w-5 h-5 mr-1" />
                      Save ${calculateSavings()}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {product["discount-percent"]}% OFF
                    </div>
                  </div>
                </div>

                <ClientProductActions
                  productUrl={product["product-url"]}
                  title={product.title}
                  newPrice={product["new-price"]}
                />
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <Card style={{
                background: 'linear-gradient(135deg, #ffffff, #f9fafb)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                marginBottom: '1.5rem',
              }}>
                <CardContent style={{
                  padding: '2rem',
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #f97316',
                    letterSpacing: '0.025em',
                  }}>
                    Key Features
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                  }}>
                    {features.map((feature, index) => (
                      <li key={index} style={{
                        fontSize: '1rem',
                        color: '#334155',
                        marginBottom: '0.75rem',
                        paddingLeft: '1.5rem',
                        position: 'relative',
                        transition: 'color 0.2s ease',
                      }}
                      >
                        <span style={{
                          content: '""',
                          position: 'absolute',
                          left: '0',
                          top: '0.5rem',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#f97316',
                          borderRadius: '50%',
                        }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Product Description */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg text-neutral-800 mb-4">Product Details</h3>
                <div
                  className="prose max-w-none text-neutral-800"
                  dangerouslySetInnerHTML={{
                    __html: product["description-html"]
                      .replace(/About this item/g, "")
                      .replace(/See more product details/g, "")
                      .replace(/Show more/g, ""),
                  }}
                />
              </CardContent>
            </Card>

            {/* Deal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-neutral-900">Deal Protection</h4>
                  </div>
                  <ul className="text-sm text-neutral-800 space-y-1">
                    <li>• Secure Amazon checkout</li>
                    <li>• Amazon return policy applies</li>
                    <li>• Buyer protection guaranteed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-3">
                    <Truck className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-neutral-900">Shipping Info</h4>
                  </div>
                  <ul className="text-sm text-neutral-800 space-y-1">
                    <li>• FREE shipping available</li>
                    <li>• Prime eligible</li>
                    <li>• Fast delivery options</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-orange-800 mb-2">
                  🔥 Don’t Miss This Amazing Deal!
                </h3>
                <p className="text-orange-800 mb-4">
                  Limited time offer - grab this {product["discount-percent"]}% discount before it’s gone!
                </p>
                <ClientProductActions
                  productUrl={product["product-url"]}
                  title={product.title}
                  newPrice={product["new-price"]}
                  isFinalCta
                  savings={calculateSavings()}
                />
                <p className="text-xs text-orange-700 mt-2">
                  Clicking will redirect you to Amazon to complete your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
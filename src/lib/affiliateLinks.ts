
// Amazon affiliate link utilities
export const AFFILIATE_TAG = "a03d1843-20";

export function generateAffiliateLink(productUrl: string): string {
  // Extract ASIN from Amazon URL
  const asinMatch = productUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|\?|$)/);
  if (!asinMatch) {
    return productUrl;
  }

  const asin = asinMatch[1];

  return `https://www.amazon.com/dp/${asin}?th=1&linkCode=ll1&tag=${AFFILIATE_TAG}&language=en_US&ref_=as_li_ss_tl`;
}

export function trackAffiliateClick(productId: number, productTitle: string, price: string) {
  // Analytics tracking for affiliate clicks
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      product_id: productId,
      product_title: productTitle,
      price: price,
      currency: 'USD'
    });
  }

  console.log(`Affiliate click tracked: ${productTitle} - ${price}`);
}

export function redirectToAmazon(amazonUrl: string, productId: number, productTitle: string, price: string) {
  trackAffiliateClick(productId, productTitle, price);
  window.open(generateAffiliateLink(amazonUrl), '_blank');
}
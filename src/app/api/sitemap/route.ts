import { getAllProductUrls } from "@/lib/productData";

export async function GET() {
  const productUrls = await getAllProductUrls();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${productUrls.map(url => `
        <url>
          <loc>https://your-site.com/product/${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
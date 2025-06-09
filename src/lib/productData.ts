// src/lib/productData.ts
import fs from 'fs';
import path from 'path';
import predefinedCategories from '@/data/predefined-categories.json';

const dataDir = path.join(process.cwd(), 'src/data');
const cache = new Map<string, any>();

export async function getProductByTitle(title: string) {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('amazon_') && file.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const cacheKey = `${file}:${title}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileContent);

    const product = products.find((p: any) => p.title !== null && p.title.trim() === title.trim());
    if (product) {
      cache.set(cacheKey, product);
      return product;
    }
  }

  return null;
}

export async function getAllProducts(
  page = 1,
  limit = 50,
  filters: { category?: string; search?: string; priceRange?: string } = {},
  maxProducts?: number
) {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('amazon_') && file.endsWith('.json'));
  let products: any[] = [];
  const start = (page - 1) * limit;
  let totalCount = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let fileProducts = JSON.parse(fileContent).filter((p: any) => p.title !== null);

    // Apply category filter using predefined categories
    if (filters.category && filters.category !== 'all') {
      const categoryMapping = predefinedCategories.find(
        cat => cat.displayName.toLowerCase() === (filters.category || '').toLowerCase()
      );
      if (categoryMapping) {
        fileProducts = fileProducts.filter((p: any) =>
          p.categories.split('|').some((cat: string) =>
            categoryMapping.similarCategories.includes(cat.trim().toLowerCase())
          )
        );
      }
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      fileProducts = fileProducts.filter((p: any) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.categories.toLowerCase().includes(searchTerm) ||
        p['description-html'].toLowerCase().includes(searchTerm)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      fileProducts = fileProducts.filter((p: any) => {
        const price = parseFloat(p['new-price'].replace('$', ''));
        switch (filters.priceRange) {
          case 'under-100': return price < 100;
          case '100-300': return price >= 100 && price <= 300;
          case '300-500': return price >= 300 && price <= 500;
          case 'over-500': return price > 500;
          default: return true;
        }
      });
    }

    totalCount += fileProducts.length;
    products = products.concat(fileProducts);
  }

  if (maxProducts) {
    totalCount = Math.min(totalCount, maxProducts);
    products = products.slice(0, maxProducts);
  }

  const paginatedProducts = products.slice(start, start + limit);
  return { products: paginatedProducts, total: totalCount };
}

export async function getAllProductUrls() {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('amazon_') && file.endsWith('.json'));
  const urls: string[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileContent);

    for (const product of products) {
      if (product.title) {
        urls.push(encodeURIComponent(product.title.trim()));
      }
    }
  }

  return urls;
}

export async function getFeaturedProducts() {
  const featuredPath = path.join(dataDir, 'featured.json');
  const fileContent = fs.readFileSync(featuredPath, 'utf-8');
  return JSON.parse(fileContent);
}
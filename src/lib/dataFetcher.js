/**
 * Server-side data fetchers — called once in layout.js (Server Component)
 * Direct DB access — no API round-trip
 */
import { getCategoriesTree } from '@/controllers/categoryController';
import { getB2BProducts, getAllB2BProducts } from '@/controllers/b2b/productController';
import { getRetailProducts, getAllRetailProducts } from '@/controllers/retail/productController';

export async function getB2BLayoutData() {
  try {
    const [categories, allProducts, newArrivals, featured] = await Promise.all([
      getCategoriesTree('b2b'),
      getAllB2BProducts(),
      getB2BProducts({ newArrival: true }),
      getB2BProducts({ featured: true }),
    ]);
    return {
      categories:  JSON.parse(JSON.stringify(categories)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      featured:    JSON.parse(JSON.stringify(featured)),
    };
  } catch (e) {
    console.error('[dataFetcher] B2B layout fetch failed:', e.message);
    return { categories: [], allProducts: [], newArrivals: [], featured: [] };
  }
}

export async function getRetailLayoutData() {
  try {
    const [categories, allProducts, newArrivals, featured] = await Promise.all([
      getCategoriesTree('retail'),
      getAllRetailProducts(),
      getRetailProducts({ newArrival: true }),
      getRetailProducts({ featured: true }),
    ]);
    return {
      categories:  JSON.parse(JSON.stringify(categories)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      featured:    JSON.parse(JSON.stringify(featured)),
    };
  } catch (e) {
    console.error('[dataFetcher] Retail layout fetch failed:', e.message);
    return { categories: [], allProducts: [], newArrivals: [], featured: [] };
  }
}

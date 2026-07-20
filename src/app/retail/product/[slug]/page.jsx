import { notFound } from 'next/navigation';
import { getRetailProductBySlug, getRetailProducts } from '@/controllers/retail/productController';
import RetailProductClient from './RetailProductClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product  = await getRetailProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title:       `${product.name} — Ivara`,
    description: product.description?.slice(0, 160),
  };
}

export default async function RetailProductPage({ params }) {
  const { slug } = await params;
  const product  = await getRetailProductBySlug(slug);
  if (!product) notFound();

  // Similar products: same category, exclude current
  let similar = [];
  try {
    const allInCat = await getRetailProducts({ category: String(product.category?._id || product.category) });
    similar = allInCat.filter((p) => String(p._id) !== String(product._id)).slice(0, 4);
  } catch (_) {}

  return (
    <RetailProductClient
      product={JSON.parse(JSON.stringify(product))}
      similar={JSON.parse(JSON.stringify(similar))}
    />
  );
}

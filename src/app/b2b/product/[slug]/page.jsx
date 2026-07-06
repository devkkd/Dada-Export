import { notFound } from 'next/navigation';
import { getB2BProductBySlug, getB2BProducts } from '@/controllers/b2b/productController';
import B2BProductDetail from '@/components/b2b/B2BProductDetail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product  = await getB2BProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title:       `${product.name} — Dada Exports B2B`,
    description: product.description?.slice(0, 160),
  };
}

export default async function B2BProductPage({ params }) {
  const { slug }   = await params;
  const product    = await getB2BProductBySlug(slug);
  if (!product) notFound();

  // Similar products: same category, exclude current
  const allInCat = await getB2BProducts({
    category: product.category?._id || product.category,
  });
  const similar = allInCat
    .filter((p) => String(p._id) !== String(product._id))
    .slice(0, 4);

  return <B2BProductDetail product={product} similar={similar} />;
}

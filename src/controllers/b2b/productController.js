import { connectDB } from '@/lib/db';
import B2BProduct from '@/models/b2b/B2BProduct';
// Must import Category so Mongoose registers the schema before populate() runs
import '@/models/Category';

async function fetchProducts(query, { bySlug = false } = {}) {
  try {
    await connectDB();
  } catch (error) {
    console.error('B2B products DB connection failed:', error.message);
    return bySlug ? null : [];
  }

  try {
    if (bySlug) {
      return await B2BProduct.findOne(query).lean();
    }

    return await B2BProduct.find(query).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('B2B products query failed:', error.message);
    return bySlug ? null : [];
  }
}

export async function getB2BProducts({ category, subcategory, featured, newArrival } = {}) {
  const query = { isActive: true };
  if (category)    query.category     = category;
  if (subcategory) query.subcategory  = subcategory;
  if (featured)    query.isFeatured   = true;
  if (newArrival)  query.isNewArrival = true;

  return fetchProducts(query);
}

export async function getB2BProductBySlug(slug) {
  return fetchProducts({ slug, isActive: true }, { bySlug: true });
}

export async function getAllB2BProducts() {
  return fetchProducts({});
}

export async function createB2BProduct(data) {
  await connectDB();
  return B2BProduct.create(data);
}

export async function updateB2BProduct(id, data) {
  await connectDB();
  return B2BProduct.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteB2BProduct(id) {
  await connectDB();
  return B2BProduct.findByIdAndDelete(id);
}

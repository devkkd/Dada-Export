import { connectDB } from '@/lib/db';
import RetailProduct from '@/models/retail/RetailProduct';
import '@/models/Category';

async function fetchProducts(query, { bySlug = false } = {}) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Retail products DB connection failed:', err.message);
    return bySlug ? null : [];
  }
  try {
    if (bySlug) return await RetailProduct.findOne(query).lean();
    return await RetailProduct.find(query).sort({ createdAt: -1 }).lean();
  } catch (err) {
    console.error('Retail products query failed:', err.message);
    return bySlug ? null : [];
  }
}

export async function getRetailProducts({ category, subcategory, featured, newArrival } = {}) {
  const query = { isActive: true };
  if (category)    query.category     = category;
  if (subcategory) query.subcategory  = subcategory;
  if (featured)    query.isFeatured   = true;
  if (newArrival)  query.isNewArrival = true;
  return fetchProducts(query);
}

export async function getRetailProductBySlug(slug) {
  return fetchProducts({ slug, isActive: true }, { bySlug: true });
}

export async function getAllRetailProducts() {
  return fetchProducts({});
}

export async function createRetailProduct(data) {
  await connectDB();
  return RetailProduct.create(data);
}

export async function updateRetailProduct(id, data) {
  await connectDB();
  return RetailProduct.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteRetailProduct(id) {
  await connectDB();
  return RetailProduct.findByIdAndDelete(id);
}

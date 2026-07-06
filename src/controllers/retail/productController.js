import { connectDB } from '@/lib/db';
import RetailProduct from '@/models/retail/RetailProduct';

export async function getRetailProducts({ category, featured } = {}) {
  await connectDB();
  const query = { isActive: true };
  if (category && category !== 'All') query.category = category;
  if (featured) query.isFeatured = true;
  return RetailProduct.find(query).sort({ createdAt: -1 }).lean();
}

export async function getRetailProductBySlug(slug) {
  await connectDB();
  return RetailProduct.findOne({ slug, isActive: true }).lean();
}

export async function getAllRetailProducts() {
  await connectDB();
  return RetailProduct.find({}).sort({ createdAt: -1 }).lean();
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

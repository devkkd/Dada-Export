import { connectDB } from '@/lib/db';
import B2BProduct from '@/models/b2b/B2BProduct';
// Must import Category so Mongoose registers the schema before populate() runs
import '@/models/Category';

export async function getB2BProducts({ category, subcategory, featured, newArrival } = {}) {
  await connectDB();
  const query = { isActive: true };
  if (category)    query.category     = category;
  if (subcategory) query.subcategory  = subcategory;
  if (featured)    query.isFeatured   = true;
  if (newArrival)  query.isNewArrival = true;
  return B2BProduct.find(query)
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
}

export async function getB2BProductBySlug(slug) {
  await connectDB();
  return B2BProduct.findOne({ slug, isActive: true })
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean();
}

export async function getAllB2BProducts() {
  await connectDB();
  return B2BProduct.find({})
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
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

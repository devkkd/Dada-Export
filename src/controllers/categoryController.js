import Category from '@/models/Category';
import { connectDB } from '@/lib/db';

/**
 * Get all categories for a site, nested (categories with their subcategories)
 * @param {'b2b'|'retail'|'both'} site
 * @returns Array of top-level categories, each with a `subcategories` array
 */
export async function getCategoriesTree(site) {
  await connectDB();

  // fetch all active categories for this site (includes 'both')
  const all = await Category.find({
    isActive: true,
    site:     site ? { $in: [site, 'both'] } : undefined,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  // separate top-level and children
  const topLevel = all.filter((c) => !c.parentId);
  const children  = all.filter((c) => c.parentId);

  // attach subcategories to their parent
  return topLevel.map((parent) => ({
    ...parent,
    subcategories: children.filter(
      (child) => String(child.parentId) === String(parent._id)
    ),
  }));
}

/**
 * Get flat list of all categories (for admin listing)
 */
export async function getAllCategories() {
  await connectDB();
  return Category.find({})
    .sort({ site: 1, order: 1, createdAt: 1 })
    .populate('parentId', 'name slug')
    .lean();
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id) {
  await connectDB();
  return Category.findById(id).populate('parentId', 'name slug').lean();
}

/**
 * Create a new category
 */
export async function createCategory(data) {
  await connectDB();
  const category = await Category.create(data);
  return category.toObject();
}

/**
 * Update an existing category
 */
export async function updateCategory(id, data) {
  await connectDB();
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

/**
 * Delete a category (also deletes its subcategories)
 */
export async function deleteCategory(id) {
  await connectDB();
  // delete subcategories first
  await Category.deleteMany({ parentId: id });
  return Category.findByIdAndDelete(id).lean();
}

/**
 * Get all top-level categories (no parent) for a site — used in dropdowns
 */
export async function getTopLevelCategories(site) {
  await connectDB();
  const query = { parentId: null, isActive: true };
  if (site) query.site = { $in: [site, 'both'] };
  return Category.find(query).sort({ order: 1 }).lean();
}

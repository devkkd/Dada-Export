import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Category name is required'],
      trim:     true,
    },
    slug: {
      type:      String,
      required:  [true, 'Slug is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    // Cloudflare R2 public URL for the category image
    image: {
      type:    String,
      default: null,
    },
    // which site this category belongs to
    site: {
      type:     String,
      enum:     ['b2b', 'retail', 'both'],
      required: [true, 'Site is required'],
      default:  'both',
    },
    // null = top-level category, ObjectId = subcategory under a parent
    parentId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Category',
      default: null,
    },
    // display sort order
    order: {
      type:    Number,
      default: 0,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// auto-generate slug from name if not provided
CategorySchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// index for fast lookups
CategorySchema.index({ site: 1, parentId: 1, isActive: 1 });

export default mongoose.models.Category ||
  mongoose.model('Category', CategorySchema);

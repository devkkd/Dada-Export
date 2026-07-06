import mongoose from 'mongoose';

const RetailProductSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Product name is required'],
      trim:     true,
    },
    slug: {
      type:      String,
      required:  [true, 'Slug is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    images: {
      type:    [String],
      default: [],
    },
    // Dynamic category reference (replaces hardcoded enum)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
    },
    // Subcategory reference (optional)
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
      default: null,
    },
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      0,
    },
    mrp: {
      type: Number, // original price before discount
      min:  0,
    },
    // color options
    colors: [
      {
        name: String, // e.g. "Rose"
        hex:  String, // e.g. "#E11D48"
      },
    ],
    // each size has its own stock count
    variants: [
      {
        size:  { type: String, required: true }, // 'XS','S','M','L','XL','XXL'
        stock: { type: Number, default: 0 },
      },
    ],
    fabric:     String,
    isActive:   { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags:       [String],
  },
  { timestamps: true }
);

// auto-generate slug from name if not provided
RetailProductSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// virtual: total stock across all variants
RetailProductSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
});

export default mongoose.models.RetailProduct ||
  mongoose.model('RetailProduct', RetailProductSchema);

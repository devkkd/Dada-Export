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
    // Short label shown below title e.g. "Tie-Up Drawstring Flowy A-Line Summer Dress"
    breadcrumbLabel: {
      type:    String,
      default: '',
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    // Cloudflare R2 image URLs
    images: {
      type:    [String],
      default: [],
    },
    // Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
    },
    subcategory: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Category',
      default: null,
    },
    // Selling price
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      0,
    },
    // MRP (before discount)
    mrp: {
      type:    Number,
      default: 0,
    },
    // Available sizes with stock
    variants: [
      {
        size:  { type: String, required: true }, // 'XS','S','M','L','XL','2XL'
        stock: { type: Number, default: 0 },
      },
    ],
    // Print / pattern options e.g. Floral, Paisley, Block Print
    prints: {
      type:    [String],
      default: [],
    },
    // Color options
    colors: [
      {
        name: { type: String, trim: true },
        hex:  { type: String, trim: true },
      },
    ],
    fabric: {
      type:    String,
      default: '',
    },
    // Product Highlights table — [{label, value}]
    highlights: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    // Key Features bullet list
    keyFeatures: {
      type:    [String],
      default: [],
    },
    // Care Instructions bullet list
    careInstructions: {
      type:    [String],
      default: [],
    },
    isActive:     { type: Boolean, default: true  },
    isFeatured:   { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    tags:         { type: [String], default: []   },
  },
  { timestamps: true }
);

// Auto-generate slug
RetailProductSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Total stock virtual
RetailProductSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
});

RetailProductSchema.index({ category: 1, isActive: 1 });
RetailProductSchema.index({ isFeatured: 1, isActive: 1 });
RetailProductSchema.index({ isNewArrival: 1, isActive: 1 });

export default mongoose.models.RetailProduct ||
  mongoose.model('RetailProduct', RetailProductSchema);

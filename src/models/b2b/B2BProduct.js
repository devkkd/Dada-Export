import mongoose from 'mongoose';

const B2BProductSchema = new mongoose.Schema(
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
    // Short breadcrumb label shown above title (e.g. "Tie-Up Drawstring Peony A-Line Summer Dress")
    breadcrumbLabel: {
      type:    String,
      default: '',
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    // Cloudflare R2 URLs
    images: {
      type:    [String],
      default: [],
    },
    // Dynamic category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
    },
    subcategory: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Category',
      default: null,
    },
    // Price in paise or whole rupees — shown as ₹X,XX,XXX
    price: {
      type:    Number,
      default: 0,
    },
    // Color options
    colors: [
      {
        name: { type: String, trim: true }, // e.g. "Olive Green"
        hex:  { type: String, trim: true }, // e.g. "#4A7043"
      },
    ],
    // Available sizes
    sizes: {
      type:    [String],
      default: ['Free Size', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    },
    // Minimum order quantity
    moq: {
      type:    Number,
      default: 50,
    },
    // Fabric type
    fabric: {
      type:    String,
      default: '',
    },
    // Product Highlights — key-value pairs shown in the table
    // e.g. [{ label: 'Color', value: 'Olive Green' }, { label: 'Occasion', value: 'Casual' }]
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
    // Fabric Care Instructions bullet list
    careInstructions: {
      type:    [String],
      default: [],
    },
    isActive:    { type: Boolean, default: true  },
    isFeatured:  { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }, // show in New Arrivals section
    tags:        { type: [String], default: []   },
  },
  { timestamps: true }
);

// Auto-generate slug from name
B2BProductSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

B2BProductSchema.index({ category: 1, isActive: 1 });
B2BProductSchema.index({ isFeatured: 1, isActive: 1 });

export default mongoose.models.B2BProduct ||
  mongoose.model('B2BProduct', B2BProductSchema);

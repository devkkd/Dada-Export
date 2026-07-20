import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    // ── Buyer Details ─────────────────────────────────
    name:         { type: String, required: [true, 'Name is required'], trim: true },
    designation:  { type: String, trim: true }, // Owner, Buyer, Manager
    email:        { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone:        { type: String, required: [true, 'Phone is required'], trim: true },

    // ── Business Details ──────────────────────────────
    company:      { type: String, trim: true },
    businessType: { type: String, trim: true }, // Retailer, Wholesaler, Boutique, etc.
    country:      { type: String, trim: true },
    city:         { type: String, trim: true },

    // ── Order Requirements ────────────────────────────
    quantity:     { type: String, trim: true }, // e.g. "50 pieces per style"
    message:      { type: String },

    // ── Products ─────────────────────────────────────
    // Single enquiry: 1 product | Cart enquiry: multiple products
    products: [
      {
        productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'B2BProduct' },
        productSlug: { type: String },
        name:        { type: String },
        image:       { type: String },
        size:        { type: String },
        color:       { type: String },
        quantity:    { type: Number, default: 1 },
        moq:         { type: Number },
      },
    ],

    // ── Type ──────────────────────────────────────────
    type: {
      type:    String,
      enum:    ['single', 'cart'],
      default: 'single',
    },

    // ── Admin ─────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model('Inquiry', InquirySchema);

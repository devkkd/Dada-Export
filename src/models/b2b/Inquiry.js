import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, 'Name is required'],  trim: true },
    email:   { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone:   { type: String, required: [true, 'Phone is required'], trim: true },
    company: { type: String, trim: true },
    country: { type: String, trim: true },
    message: { type: String },

    // which products they are interested in
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:  'B2BProduct',
        },
        name:     String,
        quantity: Number,
      },
    ],

    // admin tracks inquiry lifecycle
    status: {
      type:    String,
      enum:    ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },

    // admin notes
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model('Inquiry', InquirySchema);

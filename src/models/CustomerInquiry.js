import mongoose from 'mongoose';

const CustomerInquirySchema = new mongoose.Schema(
  {
    name:         { type: String, required: [true, 'Name is required'], trim: true },
    businessType: { type: String, trim: true }, // Wholesale Buyer, Retailer, Boutique, Exporter
    designation:  { type: String, trim: true }, // e.g. Owner, Buyer, Manager
    city:         { type: String, trim: true }, // e.g. Mumbai, Maharashtra
    email:        { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone:        { type: String, required: [true, 'Phone is required'], trim: true },
    message:      { type: String, required: [true, 'Message is required'] },
    source:       { type: String, required: true, enum: ['b2b', 'retail'] },
    status: {
      type:    String,
      enum:    ['new', 'contacted', 'resolved', 'closed'],
      default: 'new',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.CustomerInquiry ||
  mongoose.model('CustomerInquiry', CustomerInquirySchema);

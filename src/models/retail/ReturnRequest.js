import mongoose from 'mongoose';

const ReturnItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailProduct' },
  name:      String,
  image:     String,
  price:     Number,
  size:      String,
  color:     String,
  quantity:  { type: Number, default: 1 },
});

const ReturnRequestSchema = new mongoose.Schema(
  {
    // References
    orderId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Order',
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'RetailUser',
      required: true,
    },

    // Type
    type: {
      type: String,
      enum: ['return', 'exchange'],
      required: true,
    },

    // Items being returned/exchanged
    items: [ReturnItemSchema],

    // Reason
    reason: {
      type:     String,
      required: true,
      // e.g. "Size too small", "Wrong item received", "Damaged product", etc.
    },
    reasonDetail: String, // additional notes from customer

    // For exchange — what size/item they want instead
    exchangeFor: String,

    // Admin workflow
    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected', 'picked_up', 'refunded', 'exchanged'],
      default: 'pending',
    },
    adminNote:   String,
    resolvedAt:  Date,

    // Refund details (set when refund is issued)
    refundAmount:   Number,
    refundId:       String, // Razorpay refund ID
    refundInitiatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.ReturnRequest ||
  mongoose.model('ReturnRequest', ReturnRequestSchema);

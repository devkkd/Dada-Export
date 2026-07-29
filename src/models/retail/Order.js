import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailProduct' },
  name:      String,
  image:     String,
  price:     Number,
  size:      String,
  color:     String,
  quantity:  Number,
  isCustomized: { type: Boolean, default: false },
  customizationFields: { type: Map, of: String },
  customizationPrice: { type: Number, default: 0 },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'RetailUser',
      required: true,
    },
    items:       [OrderItemSchema],
    totalAmount: { type: Number, required: true },

    shippingAddress: {
      name:    String,
      phone:   String,
      street:  String,
      city:    String,
      state:   String,
      pincode: String,
      country: String,
    },

    paymentStatus: {
      type:    String,
      enum:    ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: String, // Razorpay payment ID
    razorpayOrderId: String, // Razorpay order ID

    orderStatus: {
      type:    String,
      enum:    ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },

    // admin notes / tracking
    trackingId: String,
    adminNote:  String,

    couponCode:     String,
    discountAmount: { type: Number, default: 0 },

    shiprocketOrderId:    String,
    shiprocketShipmentId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model('Order', OrderSchema);

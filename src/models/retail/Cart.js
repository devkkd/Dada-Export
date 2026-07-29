import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailProduct', required: true },
  name:      String,
  image:     String,
  price:     Number,
  size:      String,
  color:     String,
  quantity:  { type: Number, default: 1, min: 1 },
  isCustomized: { type: Boolean, default: false },
  customizationFields: { type: Map, of: String },
  customizationPrice: { type: Number, default: 0 },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

// virtual: total cart value
CartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + (item.price + (item.customizationPrice || 0)) * item.quantity, 0);
});

export default mongoose.models.Cart ||
  mongoose.model('Cart', CartSchema);

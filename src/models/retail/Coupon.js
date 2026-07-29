import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type:      String,
      required:  [true, 'Coupon code is required'],
      unique:    true,
      uppercase: true,
      trim:      true,
    },
    discountType: {
      type:    String,
      enum:    ['percentage', 'flat'],
      default: 'percentage',
    },
    discountValue: {
      type:     Number,
      required: [true, 'Discount value is required'],
      min:      [0, 'Discount value cannot be negative'],
    },
    minOrderAmount: {
      type:    Number,
      default: 0,
      min:     [0, 'Minimum order amount cannot be negative'],
    },
    usageCriteria: {
      type:    String,
      enum:    ['all', 'new_users_only', 'first_order_only'],
      default: 'all',
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    expiryDate: {
      type:    Date,
      default: null,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'RetailUser',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

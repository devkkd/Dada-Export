import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  label:     { type: String, default: 'Home' },
  name:      { type: String, default: '' },
  phone:     { type: String, default: '' },
  street:    { type: String, default: '' },
  city:      { type: String, default: '' },
  state:     { type: String, default: '' },
  pincode:   { type: String, default: '' },
  country:   { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    // Core identity — email is primary key for Google + Magic Link
    name:      { type: String, trim: true, default: '' },
    email:     { type: String, required: true, unique: true, trim: true, lowercase: true },

    // Optional — user can fill after registration
    // sparse: true means only non-null/non-empty values are indexed (no duplicate "" issue)
    phone:     { type: String, trim: true, default: null, sparse: true },

    // Auth providers this user has connected
    // e.g. ['google', 'email']
    providers: [{ type: String }],

    // Profile image from Google OAuth
    image:     { type: String, default: '' },

    addresses: [AddressSchema],
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.RetailUser ||
  mongoose.model('RetailUser', UserSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AddressSchema = new mongoose.Schema({
  label:     { type: String, default: 'Home' },
  name:      String,
  phone:     String,
  street:    String,
  city:      String,
  state:     String,
  pincode:   String,
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    name:      { type: String, required: [true, 'Name is required'],  trim: true },
    email:     { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, unique: true },
    password:  { type: String, required: [true, 'Password is required'], minlength: 6 },
    phone:     { type: String, trim: true },
    addresses: [AddressSchema],
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

// hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password helper
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.models.User ||
  mongoose.model('User', UserSchema);

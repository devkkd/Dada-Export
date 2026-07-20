import mongoose from 'mongoose';

// Temporary email OTP storage — auto-deleted after 10 minutes via TTL index
const EmailOTPSchema = new mongoose.Schema({
  email:     { type: String, required: true, index: true, lowercase: true, trim: true },
  otp:       { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min TTL
});

export default mongoose.models.EmailOTP ||
  mongoose.model('EmailOTP', EmailOTPSchema);

import mongoose from 'mongoose';

// Temporary OTP storage — expires in 10 minutes
const OTPSchema = new mongoose.Schema({
  phone:     { type: String, required: true, index: true },
  otp:       { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-delete after 10 min
});

export default mongoose.models.OTP ||
  mongoose.model('OTP', OTPSchema);

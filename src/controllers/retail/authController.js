import { connectDB } from '@/lib/db';
import User from '@/models/retail/User';

export async function registerUser({ name, email, password, phone }) {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ name, email, password, phone });

  // don't return password
  const { password: _pw, ...safeUser } = user.toObject();
  return safeUser;
}

export async function loginUser(email, password) {
  await connectDB();

  const user = await User.findOne({ email, isActive: true });
  if (!user) return null;

  const valid = await user.comparePassword(password);
  if (!valid) return null;

  return {
    id:    user._id.toString(),
    name:  user.name,
    email: user.email,
    phone: user.phone,
  };
}

export async function getUserById(id) {
  await connectDB();
  return User.findById(id).select('-password').lean();
}

import { connectDB } from '@/lib/db';
import Inquiry from '@/models/b2b/Inquiry';

export async function submitInquiry(data) {
  await connectDB();
  const inquiry = await Inquiry.create(data);
  return inquiry;
}

export async function getAllInquiries({ status } = {}) {
  await connectDB();
  const query = {};
  if (status) query.status = status;
  return Inquiry.find(query)
    .sort({ createdAt: -1 })
    .populate('products.productId', 'name images')
    .lean();
}

export async function getInquiryById(id) {
  await connectDB();
  return Inquiry.findById(id)
    .populate('products.productId', 'name images category')
    .lean();
}

export async function updateInquiryStatus(id, { status, adminNote }) {
  await connectDB();
  const update = {};
  if (status)    update.status    = status;
  if (adminNote) update.adminNote = adminNote;
  return Inquiry.findByIdAndUpdate(id, update, { new: true });
}

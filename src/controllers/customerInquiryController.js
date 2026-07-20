import { connectDB } from '@/lib/db';
import CustomerInquiry from '@/models/CustomerInquiry';

export async function submitCustomerInquiry(data) {
  await connectDB();
  const inquiry = await CustomerInquiry.create(data);
  return inquiry;
}

export async function getAllCustomerInquiries({ status, source } = {}) {
  await connectDB();
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (source && source !== 'all') query.source = source;
  return CustomerInquiry.find(query)
    .sort({ createdAt: -1 })
    .lean();
}

export async function getCustomerInquiryById(id) {
  await connectDB();
  return CustomerInquiry.findById(id).lean();
}

export async function updateCustomerInquiryStatus(id, { status, adminNote }) {
  await connectDB();
  const update = {};
  if (status    !== undefined) update.status    = status;
  if (adminNote !== undefined) update.adminNote = adminNote;
  return CustomerInquiry.findByIdAndUpdate(id, update, { new: true }).lean();
}

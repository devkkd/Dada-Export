import { connectDB } from '@/lib/db';
import Order from '@/models/retail/Order';
import RetailUser from '@/models/retail/User';
import { clearCart } from './cartController';

export async function placeOrder(userId, { items, totalAmount, shippingAddress, paymentId, razorpayOrderId, couponCode, discountAmount }) {
  await connectDB();
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No items in order');
  }
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
    throw new Error('Incomplete shipping address');
  }

  const order = await Order.create({
    userId,
    items,
    totalAmount,
    shippingAddress,
    paymentStatus: paymentId ? 'paid' : 'pending',
    paymentId:     paymentId || null,
    razorpayOrderId: razorpayOrderId || null,
    orderStatus:   'placed',
    couponCode:    couponCode || null,
    discountAmount: Number(discountAmount || 0),
  });

  return order;
}

export async function getUserOrders(userId) {
  await connectDB();
  return Order.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getOrderById(id) {
  await connectDB();
  return Order.findById(id).lean();
}

// admin: get all orders
export async function getAllOrders({ status } = {}) {
  await connectDB();
  const query = {};
  if (status) query.orderStatus = status;
  return Order.find(query)
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();
}

// admin: update order status
export async function updateOrderStatus(id, { orderStatus, trackingId, adminNote, paymentStatus, paymentId }) {
  await connectDB();
  const update = {};
  if (orderStatus) update.orderStatus = orderStatus;
  if (trackingId)  update.trackingId  = trackingId;
  if (adminNote)   update.adminNote   = adminNote;
  if (paymentStatus) update.paymentStatus = paymentStatus;
  if (paymentId !== undefined) update.paymentId = paymentId;
  return Order.findByIdAndUpdate(id, update, { new: true });
}

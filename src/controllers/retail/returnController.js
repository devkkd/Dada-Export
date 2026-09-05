import { connectDB }    from '@/lib/db';
import ReturnRequest   from '@/models/retail/ReturnRequest';
import Order           from '@/models/retail/Order';

const RETURN_WINDOW_DAYS = 7;

// ── Customer ──────────────────────────────────────────────────────────────

export async function createReturnRequest(userId, { orderId, type, items, reason, reasonDetail, exchangeFor }) {
  await connectDB();

  // Validate order belongs to user and is delivered
  const order = await Order.findById(orderId).lean();
  if (!order)                                   throw new Error('Order not found');
  if (String(order.userId) !== String(userId))  throw new Error('Unauthorized');
  if (order.orderStatus !== 'delivered')         throw new Error('Only delivered orders can be returned or exchanged');

  // Enforce 7-day return window
  const deliveredAge = (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (deliveredAge > RETURN_WINDOW_DAYS) {
    throw new Error(`Return window of ${RETURN_WINDOW_DAYS} days has passed`);
  }

  // Prevent duplicate pending request for same order
  const existing = await ReturnRequest.findOne({ orderId, userId, status: { $in: ['pending', 'approved'] } }).lean();
  if (existing) throw new Error('A return/exchange request for this order is already in progress');

  const returnReq = await ReturnRequest.create({
    orderId,
    userId,
    type:         type || 'return',
    items:        items || order.items,
    reason,
    reasonDetail: reasonDetail || '',
    exchangeFor:  exchangeFor  || '',
    status:       'pending',
  });

  return returnReq;
}

export async function getUserReturnRequests(userId) {
  await connectDB();
  return ReturnRequest.find({ userId })
    .sort({ createdAt: -1 })
    .populate('orderId', '_id totalAmount createdAt')
    .lean();
}

// ── Admin ─────────────────────────────────────────────────────────────────

export async function getAllReturnRequests({ status } = {}) {
  await connectDB();
  const query = {};
  if (status && status !== 'all') query.status = status;
  return ReturnRequest.find(query)
    .sort({ createdAt: -1 })
    .populate('userId',  'name email phone')
    .populate('orderId', '_id totalAmount paymentId createdAt')
    .lean();
}

export async function getReturnRequestById(id) {
  await connectDB();
  return ReturnRequest.findById(id)
    .populate('userId',  'name email phone')
    .populate('orderId', '_id totalAmount paymentId razorpayOrderId createdAt')
    .lean();
}

export async function updateReturnRequest(id, { status, adminNote, refundAmount, refundId }) {
  await connectDB();
  const update = {};
  if (status)                       update.status       = status;
  if (adminNote !== undefined)      update.adminNote    = adminNote;
  if (refundAmount !== undefined)   update.refundAmount = refundAmount;
  if (refundId)                     update.refundId     = refundId;
  if (['approved','rejected','refunded','exchanged','picked_up'].includes(status)) {
    update.resolvedAt = new Date();
  }
  if (status === 'refunded' && refundId) {
    update.refundInitiatedAt = new Date();
  }
  return ReturnRequest.findByIdAndUpdate(id, update, { new: true })
    .populate('userId',  'name email phone')
    .populate('orderId', '_id totalAmount paymentId createdAt')
    .lean();
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/retail/Order';
import { createShiprocketOrder } from '@/lib/shiprocket';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// POST /api/admin/retail/shiprocket
export async function POST(request) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, weight, length, breadth, height, pickupLocation } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();

    // Populate userId to fetch user profile details (email, phone)
    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.shiprocketOrderId) {
      return NextResponse.json({
        success: false,
        error: 'Order has already been synced to Shiprocket',
        data: {
          shiprocketOrderId: order.shiprocketOrderId,
          shiprocketShipmentId: order.shiprocketShipmentId,
        }
      }, { status: 400 });
    }

    const packageDetails = {
      weight: Number(weight || 0.5),
      length: Number(length || 10),
      breadth: Number(breadth || 10),
      height: Number(height || 10),
      pickupLocation: pickupLocation || process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    };

    // Call Shiprocket integration helper
    const result = await createShiprocketOrder(order, packageDetails);

    // Save Shiprocket IDs and set trackingId if AWB code returned
    order.shiprocketOrderId = result.orderId;
    order.shiprocketShipmentId = result.shipmentId;
    if (result.awbCode) {
      order.trackingId = result.awbCode;
    }
    
    // Also mark orderStatus to processing as it's entered the shipping pipeline!
    if (order.orderStatus === 'placed') {
      order.orderStatus = 'processing';
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order synced to Shiprocket successfully!',
      data: {
        shiprocketOrderId: order.shiprocketOrderId,
        shiprocketShipmentId: order.shiprocketShipmentId,
        trackingId: order.trackingId,
      }
    });
  } catch (err) {
    console.error('Shiprocket sync error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

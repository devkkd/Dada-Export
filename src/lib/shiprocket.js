let cachedToken = null;
let tokenExpiry = null;

export async function getShiprocketToken() {
  // Return cached token if valid (using 23-hour buffer since Shiprocket tokens last 24h)
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL?.trim().replace(/^['"]|['"]$/g, '');
  const password = process.env.SHIPROCKET_PASSWORD?.trim().replace(/^['"]|['"]$/g, '');

  if (!email || !password) {
    throw new Error('SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables are not configured');
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || 'Shiprocket authentication failed');
  }

  cachedToken = data.token;
  // Cache for 23 hours
  tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
  return cachedToken;
}

export async function createShiprocketOrder(order, packageDetails) {
  const token = await getShiprocketToken();

  const pickupLocation = packageDetails.pickupLocation || process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';
  
  // Format order date to YYYY-MM-DD HH:MM
  const orderDate = new Date(order.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16);

  const shippingAddress = order.shippingAddress || {};
  
  // Parse name into first and last name (Shiprocket requires first name, last name is optional but good practice)
  const nameParts = (shippingAddress.name || 'Customer').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Name';

  const orderItems = (order.items || []).map((item) => ({
    name:          item.name || 'Product',
    sku:           item.productId ? `SKU-${item.productId.toString().slice(-6)}` : 'SKU-GENERIC',
    units:         item.quantity || 1,
    selling_price: String((item.price || 0) + (item.customizationPrice || 0)),
  }));

  const payload = {
    order_id:              order._id.toString(),
    order_date:            orderDate,
    pickup_location:       pickupLocation,
    
    billing_customer_name: firstName,
    billing_last_name:     lastName,
    billing_address:       shippingAddress.street || 'Address Line',
    billing_address_2:     '',
    billing_city:          shippingAddress.city || 'City',
    billing_pincode:       String(shippingAddress.pincode || '000000'),
    billing_state:         shippingAddress.state || 'State',
    billing_country:       shippingAddress.country || 'India',
    billing_email:         order.userId?.email || 'customer@example.com',
    billing_phone:         String(shippingAddress.phone || order.userId?.phone || '0000000000'),
    
    shipping_is_billing:   true,
    
    shipping_customer_name: firstName,
    shipping_last_name:     lastName,
    shipping_address:       shippingAddress.street || 'Address Line',
    shipping_address_2:     '',
    shipping_city:          shippingAddress.city || 'City',
    shipping_pincode:       String(shippingAddress.pincode || '000000'),
    shipping_state:         shippingAddress.state || 'State',
    shipping_country:       shippingAddress.country || 'India',
    shipping_email:         order.userId?.email || 'customer@example.com',
    shipping_phone:         String(shippingAddress.phone || order.userId?.phone || '0000000000'),
    
    order_items:           orderItems,
    payment_method:        order.paymentStatus === 'paid' ? 'Prepaid' : 'COD',
    sub_total:             Number(order.totalAmount || 0),
    length:                Number(packageDetails.length || 10),
    breadth:               Number(packageDetails.breadth || 10),
    height:                Number(packageDetails.height || 10),
    weight:                Number(packageDetails.weight || 0.5),
  };

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message || 'Failed to create order on Shiprocket');
  }

  const inner = resData.data || {};
  const orderId = inner.order_id || resData.order_id;
  const shipmentId = inner.shipment_id || resData.shipment_id;
  const awbCode = inner.awb_code || resData.awb_code;

  return {
    orderId: orderId ? String(orderId) : undefined,
    shipmentId: shipmentId ? String(shipmentId) : undefined,
    awbCode: awbCode ? String(awbCode) : null,
  };
}

// Track a shipment by AWB code
// Returns courier activity events + current status
export async function trackShipment(awbCode) {
  const token = await getShiprocketToken();

  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awbCode)}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Shiprocket tracking failed');

  // Normalise response — Shiprocket returns tracking_data.shipment_track_activities[]
  const trackData      = data.tracking_data || {};
  const shipmentTrack  = trackData.track_url || null;
  const shipmentData   = trackData.shipment_track?.[0] || {};
  const activities     = trackData.shipment_track_activities || [];

  return {
    currentStatus:   shipmentData.current_status || 'In Transit',
    etd:             shipmentData.etd || null,            // estimated delivery date
    courierName:     shipmentData.courier_name || null,
    trackUrl:        shipmentTrack,
    activities: activities.map((a) => ({
      date:        a.date || '',
      activity:    a.activity || '',
      location:    a.location || '',
      description: a['sr-status-label'] || a.activity || '',
    })),
  };
}

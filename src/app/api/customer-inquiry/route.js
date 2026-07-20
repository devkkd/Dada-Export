import { NextResponse } from 'next/server';
import { submitCustomerInquiry, getAllCustomerInquiries } from '@/controllers/customerInquiryController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendCustomerInquiryNotification } from '@/lib/mailer';

// POST /api/customer-inquiry — public (anyone can submit)
export async function POST(request) {
  try {
    const body    = await request.json();
    const inquiry = await submitCustomerInquiry(body);

    // Send email notification — non-blocking
    sendCustomerInquiryNotification(inquiry.toObject ? inquiry.toObject() : inquiry)
      .catch((err) => console.error('[mailer] customer inquiry notification failed:', err.message));

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// GET /api/customer-inquiry — admin only (handles filters via query params)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const inquiries = await getAllCustomerInquiries({ status, source });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

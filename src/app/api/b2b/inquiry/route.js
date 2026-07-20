import { NextResponse } from 'next/server';
import { submitInquiry, getAllInquiries } from '@/controllers/b2b/inquiryController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendInquiryNotification } from '@/lib/mailer';

// POST /api/b2b/inquiry  — public (anyone can submit)
export async function POST(request) {
  try {
    const body    = await request.json();
    const inquiry = await submitInquiry(body);

    // Send email notification — non-blocking, don't fail the request if email fails
    sendInquiryNotification(inquiry.toObject ? inquiry.toObject() : inquiry)
      .catch((err) => console.error('[mailer] inquiry notification failed:', err.message));

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// GET /api/b2b/inquiry?status=new  — admin only
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status    = searchParams.get('status');
    const inquiries = await getAllInquiries({ status });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

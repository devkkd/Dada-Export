import { NextResponse } from 'next/server';
import { getCustomerInquiryById, updateCustomerInquiryStatus } from '@/controllers/customerInquiryController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// GET /api/customer-inquiry/:id
export async function GET(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const inquiry = await getCustomerInquiryById(id);
    return NextResponse.json({ success: true, data: inquiry });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/customer-inquiry/:id — update status / admin note
export async function PATCH(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id }  = await params;
    const body    = await request.json();
    const inquiry = await updateCustomerInquiryStatus(id, body);
    return NextResponse.json({ success: true, data: inquiry });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

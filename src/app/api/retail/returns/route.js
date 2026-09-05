import { NextResponse }                    from 'next/server';
import { cookies }                        from 'next/headers';
import { getToken }                       from 'next-auth/jwt';
import { connectDB }                      from '@/lib/db';
import RetailUser                         from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';
import {
  createReturnRequest,
  getUserReturnRequests,
} from '@/controllers/retail/returnController';

// ── Shared auth helper (same pattern as all retail order routes) ──────────
async function getUserId(req) {
  const cookieStore = await cookies();
  const customToken = cookieStore.get(COOKIE_NAME)?.value;
  if (customToken) {
    const payload = await verifyRetailToken(customToken);
    if (payload?.sub) return payload.sub;
  }
  const nextAuthToken = await getToken({
    req,
    secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });
  if (nextAuthToken?.uid) return nextAuthToken.uid;
  if (nextAuthToken?.email) {
    await connectDB();
    const user = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
    return user?._id?.toString() || null;
  }
  return null;
}

// GET /api/retail/returns  — list current user's return requests
export async function GET(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const requests = await getUserReturnRequests(userId);
    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/returns  — submit new return / exchange request
export async function POST(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ success: false, error: 'Please login to submit a request' }, { status: 401 });

    const body    = await req.json();
    const request = await createReturnRequest(userId, body);
    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

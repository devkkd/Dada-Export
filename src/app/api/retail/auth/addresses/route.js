import { NextResponse }                    from 'next/server';
import { cookies }                         from 'next/headers';
import { getToken }                        from 'next-auth/jwt';
import { connectDB }                       from '@/lib/db';
import RetailUser                          from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME }  from '@/lib/retailAuth';

// ── Resolve the logged-in user ID from either auth method ────────────────────
async function getUserId(req) {
  // 1. Custom JWT cookie (email-OTP / phone-OTP flow)
  const cookieStore = await cookies();
  const customToken = cookieStore.get(COOKIE_NAME)?.value;
  if (customToken) {
    const payload = await verifyRetailToken(customToken);
    if (payload?.sub) return payload.sub;
  }

  // 2. NextAuth JWT (Google OAuth flow)
  const nextAuthToken = await getToken({
    req,
    secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });
  if (nextAuthToken?.uid) return nextAuthToken.uid;
  if (nextAuthToken?.email) {
    await connectDB();
    const u = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
    if (u) return u._id.toString();
  }

  return null;
}

// GET — list addresses
export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const user = await RetailUser.findById(userId).select('addresses').lean();
  return NextResponse.json({ success: true, addresses: user?.addresses || [] });
}

// POST — add address
export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const address = await req.json();
  if (!address.street?.trim() || !address.city?.trim() || !address.pincode?.trim()) {
    return NextResponse.json({ success: false, message: 'Street, city and pincode required' }, { status: 400 });
  }

  await connectDB();

  // If new address is default, unset others first
  if (address.isDefault) {
    await RetailUser.updateOne(
      { _id: userId },
      { $set: { 'addresses.$[].isDefault': false } }
    );
  }

  const user = await RetailUser.findByIdAndUpdate(
    userId,
    { $push: { addresses: address } },
    { new: true }
  ).lean();

  return NextResponse.json({ success: true, addresses: user.addresses });
}

// DELETE — remove address ?id=<addressId>
export async function DELETE(req) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const addressId = searchParams.get('id');
  if (!addressId) return NextResponse.json({ success: false, message: 'Address id required' }, { status: 400 });

  await connectDB();
  const user = await RetailUser.findByIdAndUpdate(
    userId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  ).lean();

  return NextResponse.json({ success: true, addresses: user?.addresses || [] });
}

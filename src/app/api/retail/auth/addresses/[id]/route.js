import { NextResponse }                    from 'next/server';
import { cookies }                         from 'next/headers';
import { getToken }                        from 'next-auth/jwt';
import { connectDB }                       from '@/lib/db';
import RetailUser                          from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME }  from '@/lib/retailAuth';

// ── Resolve user ID from either auth method ───────────────────────────────────
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
    const u = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
    if (u) return u._id.toString();
  }

  return null;
}

// PUT — update a specific address by id
export async function PUT(req, { params }) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, message: 'Address id required' }, { status: 400 });

  const update = await req.json();
  if (!update.street?.trim() || !update.city?.trim() || !update.pincode?.trim()) {
    return NextResponse.json({ success: false, message: 'Street, city and pincode required' }, { status: 400 });
  }

  await connectDB();

  // If this address is being set as default, unset all others first
  if (update.isDefault) {
    await RetailUser.updateOne(
      { _id: userId },
      { $set: { 'addresses.$[].isDefault': false } }
    );
  }

  const user = await RetailUser.findOneAndUpdate(
    { _id: userId, 'addresses._id': id },
    {
      $set: {
        'addresses.$.label':     update.label     ?? 'Home',
        'addresses.$.name':      update.name      ?? '',
        'addresses.$.phone':     update.phone     ?? '',
        'addresses.$.street':    update.street,
        'addresses.$.city':      update.city,
        'addresses.$.state':     update.state     ?? '',
        'addresses.$.pincode':   update.pincode,
        'addresses.$.isDefault': update.isDefault ?? false,
      },
    },
    { new: true }
  ).lean();

  if (!user) return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 });

  return NextResponse.json({ success: true, addresses: user.addresses });
}

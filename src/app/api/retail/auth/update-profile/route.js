import { NextResponse }        from 'next/server';
import { getToken }            from 'next-auth/jwt';
import { connectDB }           from '@/lib/db';
import RetailUser              from '@/models/retail/User';

// Reads the retail NextAuth JWT (custom cookie name)
async function getRetailUser(req) {
  return getToken({
    req,
    secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });
}

export async function PUT(req) {
  const token = await getRetailUser(req);
  if (!token?.uid) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { name, phone } = await req.json();

  // Validate phone if provided
  if (phone && !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ success: false, message: 'Phone must be 10 digits' }, { status: 400 });
  }

  await connectDB();
  const user = await RetailUser.findByIdAndUpdate(
    token.uid,
    { $set: { name: name?.trim() || '', ...(phone ? { phone } : {}) } },
    { new: true, select: '-__v' }
  ).lean();

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone },
  });
}

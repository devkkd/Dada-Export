import { NextResponse }                 from 'next/server';
import { connectDB }                    from '@/lib/db';
import OTP                              from '@/models/retail/OTP';
import RetailUser                       from '@/models/retail/User';
import { signRetailToken, getTokenCookie } from '@/lib/retailAuth';

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    // Basic validation
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Valid 10-digit phone number required' },
        { status: 400 }
      );
    }
    if (!otp || otp.length < 4) {
      return NextResponse.json(
        { success: false, message: 'OTP is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find OTP record
    const record = await OTP.findOne({ phone });
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (record.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: 'Incorrect OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP valid — delete it (one-time use)
    await OTP.deleteOne({ _id: record._id });

    // Upsert user (create if first time, find if returning)
    const user = await RetailUser.findOneAndUpdate(
      { phone },
      { $setOnInsert: { phone } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sign JWT
    const token = await signRetailToken({
      sub:   user._id.toString(),
      phone: user.phone,
      role:  'retail_user',
    });

    // Set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id:    user._id.toString(),
        name:  user.name  || '',
        phone: user.phone,
        email: user.email || '',
      },
    });
    response.headers.set('Set-Cookie', getTokenCookie(token));
    return response;
  } catch (err) {
    console.error('[verify-otp]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

import { NextResponse }                       from 'next/server';
import { connectDB }                          from '@/lib/db';
import EmailOTP                               from '@/models/retail/EmailOTP';
import RetailUser                             from '@/models/retail/User';
import { signRetailToken, getTokenCookie }    from '@/lib/retailAuth';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // Validate inputs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Valid email address required' },
        { status: 400 }
      );
    }
    if (!otp || !/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json(
        { success: false, message: '6-digit OTP required' },
        { status: 400 }
      );
    }

    const normalised = email.trim().toLowerCase();

    await connectDB();

    // Find OTP record
    const record = await EmailOTP.findOne({ email: normalised });
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Code expired or not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (record.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: 'Incorrect code. Please try again.' },
        { status: 400 }
      );
    }

    // OTP valid — delete it (single use)
    await EmailOTP.deleteOne({ _id: record._id });

    // Upsert user — create on first login, find on returning
    const user = await RetailUser.findOneAndUpdate(
      { email: normalised },
      {
        $setOnInsert: { email: normalised, providers: ['email-otp'] },
        $addToSet:    { providers: 'email-otp' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sign JWT
    const token = await signRetailToken({
      sub:   user._id.toString(),
      email: user.email,
      name:  user.name  || '',
      role:  'retail_user',
    });

    // Return user + set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id:    user._id.toString(),
        name:  user.name  || '',
        email: user.email,
        phone: user.phone || '',
      },
    });
    response.headers.set('Set-Cookie', getTokenCookie(token));
    return response;
  } catch (err) {
    console.error('[verify-email-otp]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

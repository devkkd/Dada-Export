import { NextResponse } from 'next/server';
import { connectDB }   from '@/lib/db';
import OTP             from '@/models/retail/OTP';

// ── Dummy mode ────────────────────────────────────────────────────────────────
// In production replace this with MSG91 / Twilio / Firebase etc.
// Set OTP_PROVIDER=msg91 in .env.local and add your API key.
async function sendOtpViaSMS(phone, otp) {
  const provider = process.env.OTP_PROVIDER;

  if (!provider || provider === 'dummy') {
    // Development: just log it — OTP is always 1234
    console.log(`[OTP] Dummy mode — phone: ${phone}, otp: ${otp}`);
    return true;
  }

  // ── MSG91 ──────────────────────────────────────────────────────────────────
  if (provider === 'msg91') {
    const res = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: process.env.MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile:      `91${phone}`,
        otp,
      }),
    });
    const data = await res.json();
    return data.type === 'success';
  }

  // ── Twilio ────────────────────────────────────────────────────────────────
  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const from       = process.env.TWILIO_PHONE;
    const body       = `Your Dada Exports OTP is: ${otp}. Valid for 10 minutes.`;

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: `+91${phone}`, From: from, Body: body }),
      }
    );
    const data = await res.json();
    return !!data.sid;
  }

  return false;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { phone } = await req.json();

    // Validate phone
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Valid 10-digit phone number required' },
        { status: 400 }
      );
    }

    // Rate limit: max 1 OTP per minute per phone
    await connectDB();
    const recentOTP = await OTP.findOne({
      phone,
      createdAt: { $gte: new Date(Date.now() - 60_000) },
    });
    if (recentOTP) {
      return NextResponse.json(
        { success: false, message: 'Please wait 1 minute before requesting another OTP' },
        { status: 429 }
      );
    }

    // Generate OTP
    const isDummy = !process.env.OTP_PROVIDER || process.env.OTP_PROVIDER === 'dummy';
    const otp     = isDummy ? '1234' : Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTPs for this phone, save new one
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp });

    // Send via SMS
    const sent = await sendOtpViaSMS(phone, otp);
    if (!sent && !isDummy) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isDummy
        ? 'OTP sent (dummy mode — use 1234)'
        : 'OTP sent to your mobile number',
      // Only expose in dev for easy testing
      ...(isDummy && process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    });
  } catch (err) {
    console.error('[send-otp]', err);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

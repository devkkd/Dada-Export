import { NextResponse } from 'next/server';
import nodemailer       from 'nodemailer';
import { connectDB }    from '@/lib/db';
import EmailOTP         from '@/models/retail/EmailOTP';

// ── Mailer ────────────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOtpEmail(email, otp) {
  const transporter = createTransporter();
  const brandColor  = '#281000';

  await transporter.sendMail({
    from:    `"ivara by Dada Exports" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `${otp} is your ivara sign-in code`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

    <!-- Header -->
    <div style="background:${brandColor};padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:400;letter-spacing:2px;">ivara</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:12px;letter-spacing:1px;text-transform:uppercase;">by Dada Exports</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 40px 32px;">
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#1a1a1a;">Your sign-in code</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
        Use the code below to sign in to your ivara account. It expires in <strong>10 minutes</strong> and is single-use.
      </p>

      <!-- OTP box -->
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:#F7F4F1;border:2px solid #e8e0d8;border-radius:16px;padding:20px 40px;">
          <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:${brandColor};font-family:monospace;">${otp}</span>
        </div>
      </div>

      <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
        If you didn't request this code, you can safely ignore this email. Your account remains secure.
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:#f0ebe5;margin:0 40px;"></div>

    <!-- Footer -->
    <div style="padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#bbb;">
        © ${new Date().getFullYear()} Dada Exports · ivara · This is an automated message
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `Your ivara sign-in code is: ${otp}\n\nThis code expires in 10 minutes and is single-use.\n\nIf you didn't request this, ignore this email.`,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Valid email address required' },
        { status: 400 }
      );
    }

    const normalised = email.trim().toLowerCase();

    await connectDB();

    // Rate limit: 1 OTP per minute per email
    const recent = await EmailOTP.findOne({
      email:     normalised,
      createdAt: { $gte: new Date(Date.now() - 60_000) },
    });
    if (recent) {
      return NextResponse.json(
        { success: false, message: 'Please wait a minute before requesting another code' },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email, save the new one
    await EmailOTP.deleteMany({ email: normalised });
    await EmailOTP.create({ email: normalised, otp });

    // Send email
    await sendOtpEmail(normalised, otp);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // Expose in dev only for easy testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    });
  } catch (err) {
    console.error('[send-email-otp]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to send code. Please try again.' },
      { status: 500 }
    );
  }
}

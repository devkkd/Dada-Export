import nodemailer from 'nodemailer';

/** Reusable SMTP transporter — credentials from .env.local */
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

/**
 * Send B2B inquiry confirmation email to client
 * Called after inquiry is saved to DB
 */
export async function sendInquiryConfirmation(inquiry) {
  if (!inquiry.email || !process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') {
    console.warn('[mailer] SMTP not configured — skipping client confirmation email');
    return;
  }

  const products = inquiry.products || [];
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#95565E;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">Inquiry Received ✓</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Thank you for your interest in Dada Exports</p>
    </div>

    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:#1a1a1a;">Hi ${inquiry.name},</p>
      <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.6;">Thank you for submitting your B2B inquiry to Dada Exports. We have received your request and our team will review it shortly.</p>

      <!-- Inquiry Summary -->
      <div style="background:#F9F4E1;border-radius:10px;padding:16px;margin:20px 0;">
        <h3 style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1a1a1a;">Your Inquiry Summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#555;line-height:1.8;">
          ${products.length > 0 ? `<tr><td style="padding:4px 0;"><strong>Products:</strong></td></tr>${products.map((p) => `<tr><td style="padding:4px 0 4px 16px;">→ ${p.name} (Qty: ${p.quantity || 1})</td></tr>`).join('')}` : ''}
          ${inquiry.quantity ? `<tr><td style="padding:4px 0;"><strong>Est. Quantity:</strong> ${inquiry.quantity}</td></tr>` : ''}
          ${inquiry.company ? `<tr><td style="padding:4px 0;"><strong>Company:</strong> ${inquiry.company}</td></tr>` : ''}
        </table>
      </div>

      <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.6;">Our team will contact you within 24-48 hours at <strong>${inquiry.phone}</strong> to discuss your requirements and provide the best quotation.</p>
      <div style="text-align:center;padding:16px 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/b2b" style="display:inline-block;background:#95565E;color:#fff;text-decoration:none;padding:13px 28px;border-radius:50px;font-size:14px;font-weight:600;">Continue Shopping →</a>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#999;">Best regards,<br><strong>Dada Exports</strong></p>
    </div>

    <div style="background:#F7F4F1;padding:18px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#999;">This is an automated confirmation email.</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"Dada Exports" <${process.env.SMTP_USER}>`,
    to:      inquiry.email,
    subject: `Inquiry Received ✓ — Dada Exports B2B`,
    html,
  });
}

/**
 * Send B2B inquiry notification to admin
 * Called after inquiry is saved to DB
 */
export async function sendInquiryNotification(inquiry) {
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!to || !process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') {
    console.warn('[mailer] SMTP not configured — skipping email');
    return;
  }

  const products = inquiry.products || [];
  const productRows = products.map((p, i) =>
    `<tr style="background:${i%2===0?'#FDF8F2':'#fff'}">
      <td style="padding:10px 14px;font-size:13px;color:#1a1a1a;">${p.name || '—'}</td>
      <td style="padding:10px 14px;font-size:13px;color:#555;">${p.size || '—'}</td>
      <td style="padding:10px 14px;font-size:13px;color:#555;">${p.color || '—'}</td>
      <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#95565E;">${p.quantity || 1}</td>
    </tr>`
  ).join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#95565E;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">
        New B2B Inquiry — Dada Exports
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
        ${inquiry.type === 'cart' ? `Cart Inquiry · ${products.length} product${products.length!==1?'s':''}` : 'Single Product Inquiry'} · ${new Date(inquiry.createdAt).toLocaleString('en-IN')}
      </p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Buyer -->
      <h2 style="margin:0 0 14px;font-size:15px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #f0ebe5;padding-bottom:10px;">Buyer Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding:4px 0;font-size:13px;color:#888;width:140px;">Name</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;font-weight:500;">${inquiry.name}</td></tr>
        ${inquiry.designation ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Designation</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.designation}</td></tr>` : ''}
        <tr><td style="padding:4px 0;font-size:13px;color:#888;">Email</td><td style="padding:4px 0;font-size:13px;color:#95565E;"><a href="mailto:${inquiry.email}" style="color:#95565E;">${inquiry.email}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#888;">Phone / WhatsApp</td><td style="padding:4px 0;font-size:13px;color:#95565E;"><a href="https://wa.me/${inquiry.phone?.replace(/[^0-9]/g,'')}" style="color:#95565E;">${inquiry.phone}</a></td></tr>
        ${inquiry.company ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Company</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.company}</td></tr>` : ''}
        ${inquiry.businessType ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Business Type</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.businessType}</td></tr>` : ''}
        ${inquiry.country ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Location</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${[inquiry.city, inquiry.country].filter(Boolean).join(', ')}</td></tr>` : ''}
      </table>

      <!-- Order requirements -->
      ${inquiry.quantity || inquiry.message ? `
      <h2 style="margin:0 0 14px;font-size:15px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #f0ebe5;padding-bottom:10px;">Order Requirements</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${inquiry.quantity ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;width:140px;">Est. Quantity</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;font-weight:500;">${inquiry.quantity}</td></tr>` : ''}
        ${inquiry.message ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;vertical-align:top;">Message</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;white-space:pre-wrap;">${inquiry.message}</td></tr>` : ''}
      </table>` : ''}

      <!-- Products -->
      ${products.length > 0 ? `
      <h2 style="margin:0 0 14px;font-size:15px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #f0ebe5;padding-bottom:10px;">
        Products (${products.length})
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #f0ebe5;margin-bottom:24px;">
        <thead>
          <tr style="background:#F9F4E1;">
            <th style="padding:10px 14px;font-size:12px;color:#888;text-align:left;font-weight:600;">Product</th>
            <th style="padding:10px 14px;font-size:12px;color:#888;text-align:left;font-weight:600;">Size</th>
            <th style="padding:10px 14px;font-size:12px;color:#888;text-align:left;font-weight:600;">Color</th>
            <th style="padding:10px 14px;font-size:12px;color:#888;text-align:left;font-weight:600;">Qty</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>` : ''}

      <!-- CTA -->
      <div style="text-align:center;padding:8px 0 4px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/b2b/inquiries"
          style="display:inline-block;background:#95565E;color:#fff;text-decoration:none;padding:13px 28px;border-radius:50px;font-size:14px;font-weight:600;">
          View in Admin Panel →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#F7F4F1;padding:18px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#999;">Dada Exports · This is an automated notification</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"Dada Exports" <${process.env.SMTP_USER}>`,
    to,
    subject: `New B2B Inquiry from ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''} — ${products.length} product${products.length!==1?'s':''}`,
    html,
  });
}

/**
 * Send customer inquiry confirmation email to client
 */
export async function sendCustomerInquiryConfirmation(inquiry) {
  if (!inquiry.email || !process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') {
    console.warn('[mailer] SMTP not configured — skipping customer confirmation email');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#95565E;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">Message Received ✓</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Thank you for contacting Dada Exports</p>
    </div>

    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:#1a1a1a;">Hi ${inquiry.name},</p>
      <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.6;">Thank you for reaching out to Dada Exports. We have received your message and will get back to you shortly.</p>

      <!-- Details Summary -->
      <div style="background:#F9F4E1;border-radius:10px;padding:16px;margin:20px 0;">
        <h3 style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1a1a1a;">Your Message</h3>
        <p style="margin:0;font-size:12px;color:#555;white-space:pre-wrap;line-height:1.6;">${inquiry.message || '(No message provided)'}</p>
      </div>

      <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.6;">Our team will respond to your inquiry within 24 hours at <strong>${inquiry.email}</strong> or <strong>${inquiry.phone || 'not provided'}</strong>.</p>
      
      <div style="text-align:center;padding:16px 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display:inline-block;background:#95565E;color:#fff;text-decoration:none;padding:13px 28px;border-radius:50px;font-size:14px;font-weight:600;">Back to Website →</a>
      </div>

      <p style="margin:20px 0 0;font-size:12px;color:#999;">Best regards,<br><strong>Dada Exports Team</strong></p>
    </div>

    <div style="background:#F7F4F1;padding:18px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#999;">This is an automated confirmation email.</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"Dada Exports" <${process.env.SMTP_USER}>`,
    to:      inquiry.email,
    subject: `Message Received ✓ — Dada Exports`,
    html,
  });
}

/**
 * Send general Customer Inquiry notification to admin
 * Called after contact us inquiry is saved to DB
 */
export async function sendCustomerInquiryNotification(inquiry) {
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!to || !process.env.SMTP_USER || process.env.SMTP_USER === 'your@gmail.com') {
    console.warn('[mailer] SMTP not configured — skipping email');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#95565E;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">
        New Customer Inquiry (${inquiry.source?.toUpperCase()}) — Dada Exports
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
        Contact Us Form Submission · ${new Date(inquiry.createdAt || Date.now()).toLocaleString('en-IN')}
      </p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Inquiry Details -->
      <h2 style="margin:0 0 14px;font-size:15px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #f0ebe5;padding-bottom:10px;">Inquiry Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding:4px 0;font-size:13px;color:#888;width:140px;">Name</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;font-weight:500;">${inquiry.name}</td></tr>
        ${inquiry.businessType ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Business Type</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.businessType}</td></tr>` : ''}
        ${inquiry.designation ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Designation</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.designation}</td></tr>` : ''}
        ${inquiry.city ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">City / State</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${inquiry.city}</td></tr>` : ''}
        <tr><td style="padding:4px 0;font-size:13px;color:#888;">Email</td><td style="padding:4px 0;font-size:13px;color:#95565E;"><a href="mailto:${inquiry.email}" style="color:#95565E;">${inquiry.email}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#888;">Phone / WhatsApp</td><td style="padding:4px 0;font-size:13px;color:#95565E;"><a href="https://wa.me/${inquiry.phone?.replace(/[^0-9]/g,'')}" style="color:#95565E;">${inquiry.phone}</a></td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#888;vertical-align:top;">Message</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;white-space:pre-wrap;">${inquiry.message}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#888;">Source Site</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;text-transform:uppercase;font-weight:600;">${inquiry.source}</td></tr>
      </table>

      <!-- CTA -->
      <div style="text-align:center;padding:8px 0 4px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/customer-requests"
          style="display:inline-block;background:#95565E;color:#fff;text-decoration:none;padding:13px 28px;border-radius:50px;font-size:14px;font-weight:600;">
          View in Admin Panel →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#F7F4F1;padding:18px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#999;">Dada Exports · This is an automated notification</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"Dada Exports" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Customer Inquiry (${inquiry.source?.toUpperCase()}) from ${inquiry.name}`,
    html,
  });
}

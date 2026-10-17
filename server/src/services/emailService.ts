import nodemailer from 'nodemailer';

/**
 * All outgoing email lives here: account emails (verify, reset, password changed),
 * order emails (customer confirmation + admin alert) and the bus dispatch slip.
 *
 * Set EMAIL_DRY_RUN=true in .env to print emails to the console instead of sending them.
 */

const FARM_EMAIL = process.env.FARM_EMAIL || 'hazarideviduckfarm@gmail.com';
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || FARM_EMAIL;
const DISPATCH_CC_EMAIL = process.env.RAD_EMAIL || '';
const DRY_RUN = process.env.EMAIL_DRY_RUN === 'true';
const PRIMARY_PHONE = '9807760832';
const SECONDARY_PHONE = '9805980832';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FARM_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD || '' // 16-character Google App Password
  }
});

/** Checks the SMTP login at startup without sending anything. */
export const verifyEmailTransport = async (): Promise<boolean> => {
  if (DRY_RUN) {
    console.log('📧 EMAIL_DRY_RUN is on: emails will be printed here, not sent.');
    return true;
  }
  try {
    await transporter.verify();
    console.log(`📧 Email service ready (sending as ${FARM_EMAIL})`);
    return true;
  } catch (err) {
    console.error('📧 Email login FAILED - check FARM_EMAIL / EMAIL_APP_PASSWORD in .env:', (err as Error).message);
    return false;
  }
};

/** Escape anything a user typed before putting it into HTML. */
export const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const send = async (options: { to: string; subject: string; html: string; cc?: string; replyTo?: string }) => {
  if (DRY_RUN) {
    const links = [...options.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((l) => !l.startsWith('https://wa.me'));
    console.log(`\n📧 [DRY RUN] To: ${options.to}${options.cc ? ` (cc ${options.cc})` : ''}\n   Subject: ${options.subject}${links.length ? `\n   Links: ${links.join(' , ')}` : ''}\n`);
    return;
  }
  await transporter.sendMail({
    from: `"हजारीदेवी डक फार्म (Hazaridevi Duck Farm)" <${FARM_EMAIL}>`,
    ...options
  });
};

/** Shared branded wrapper so every email looks the same. `body` must already be escaped. */
const layout = (heading: string, body: string) => `
<!DOCTYPE html>
<html lang="ne">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background:#f4f4f5;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #1a3a2a;border-radius:6px;overflow:hidden;">
    <div style="background:#1a3a2a;padding:22px;text-align:center;border-bottom:3px solid #fbbf24;">
      <div style="color:#ffffff;font-size:19px;font-weight:bold;">हजारीदेवी बहुउद्देश्यीय कृषि फार्म</div>
      <div style="color:#fbbf24;font-size:11px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Hazaridevi Duck Farm &amp; Hatchery</div>
    </div>
    <div style="padding:26px 28px;color:#18181b;font-size:14px;line-height:1.6;">
      <h2 style="margin:0 0 14px;font-size:19px;color:#1a3a2a;">${heading}</h2>
      ${body}
    </div>
    <div style="background:#12271c;color:#a1a1aa;padding:14px 20px;text-align:center;font-size:11.5px;">
      <div style="color:#d4d4d8;">लहान, सिरहा, मधेश प्रदेश, नेपाल</div>
      <div style="margin-top:4px;">+977 ${PRIMARY_PHONE} / +977 ${SECONDARY_PHONE} • ${escapeHtml(FARM_EMAIL)}</div>
    </div>
  </div>
</body>
</html>`;

const button = (href: string, label: string) => `
  <div style="text-align:center;margin:26px 0;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:#fbbf24;color:#18181b;text-decoration:none;font-weight:bold;font-size:14px;padding:13px 28px;border-radius:4px;">${label}</a>
  </div>
  <p style="font-size:12px;color:#71717a;">बटन काम नगरे यो लिंक ब्राउजरमा खोल्नुहोस् / If the button doesn't work, open this link:<br>
    <a href="${escapeHtml(href)}" style="color:#047857;word-break:break-all;">${escapeHtml(href)}</a></p>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 12px;border:1px solid #e4e4e7;color:#52525b;font-weight:600;width:40%;">${label}</td>
    <td style="padding:8px 12px;border:1px solid #e4e4e7;font-weight:bold;">${value}</td>
  </tr>`;

/* ======================= ACCOUNT EMAILS ======================= */

export const sendVerificationEmail = (to: string, name: string, link: string) =>
  send({
    to,
    subject: '✅ इमेल प्रमाणित गर्नुहोस् (Verify your email) - Hazaridevi Duck Farm',
    html: layout(
      'तपाईंको इमेल प्रमाणित गर्नुहोस्',
      `<p>नमस्ते <strong>${escapeHtml(name)}</strong> जी,</p>
       <p>हजारीदेवी डक फार्ममा खाता खोल्नुभएकोमा धन्यवाद! खाता सक्रिय गर्न तलको बटन थिच्नुहोस्।<br>
       <span style="color:#52525b;">Thanks for registering! Click the button below to verify your email and activate your account.</span></p>
       ${button(link, 'इमेल प्रमाणित गर्नुहोस् / Verify Email')}
       <p style="font-size:12px;color:#71717a;">यो लिंक २४ घण्टासम्म मात्र मान्य छ। तपाईंले खाता नखोल्नुभएको भए यो इमेल बेवास्ता गर्नुहोस्।<br>
       This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>`
    )
  });

export const sendPasswordResetEmail = (to: string, name: string, link: string) =>
  send({
    to,
    subject: '🔑 पासवर्ड रिसेट (Reset your password) - Hazaridevi Duck Farm',
    html: layout(
      'पासवर्ड रिसेट अनुरोध',
      `<p>नमस्ते <strong>${escapeHtml(name)}</strong> जी,</p>
       <p>तपाईंको खाताको पासवर्ड रिसेट गर्न अनुरोध प्राप्त भयो। नयाँ पासवर्ड राख्न तलको बटन थिच्नुहोस्।<br>
       <span style="color:#52525b;">We received a request to reset your password. Click below to choose a new one.</span></p>
       ${button(link, 'नयाँ पासवर्ड राख्नुहोस् / Reset Password')}
       <p style="font-size:12px;color:#71717a;">यो लिंक १ घण्टासम्म मात्र मान्य छ र एक पटक मात्र प्रयोग गर्न मिल्छ। तपाईंले अनुरोध नगर्नुभएको भए यो इमेल बेवास्ता गर्नुहोस् — तपाईंको पासवर्ड परिवर्तन हुने छैन।<br>
       This link expires in 1 hour and works once. If you didn't ask for this, ignore this email — your password won't change.</p>`
    )
  });

export const sendPasswordChangedEmail = (to: string, name: string) =>
  send({
    to,
    subject: '🔒 पासवर्ड परिवर्तन भयो (Your password was changed) - Hazaridevi Duck Farm',
    html: layout(
      'तपाईंको पासवर्ड परिवर्तन भयो',
      `<p>नमस्ते <strong>${escapeHtml(name)}</strong> जी,</p>
       <p>तपाईंको हजारीदेवी डक फार्म खाताको पासवर्ड <strong>${escapeHtml(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu' }))}</strong> (नेपाल समय) मा परिवर्तन गरियो। सुरक्षाका लागि अन्य सबै डिभाइसबाट लगआउट गरिएको छ।<br>
       <span style="color:#52525b;">Your account password was just changed. For your security, all other devices have been signed out.</span></p>
       <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;margin-top:16px;font-size:13px;color:#78350f;">
         <strong>तपाईंले परिवर्तन गर्नुभएन?</strong> तुरुन्त "Forgot password" बाट पासवर्ड रिसेट गर्नुहोस् र हामीलाई +977 ${PRIMARY_PHONE} मा सम्पर्क गर्नुहोस्।<br>
         <strong>Wasn't you?</strong> Reset your password immediately with "Forgot password" and call us.
       </div>`
    )
  });

/* ======================= ORDER EMAILS ======================= */

export interface OrderEmailItem {
  productName: string;
  quantity: number;
  lineTotal: number;
}

export interface OrderEmailPayload {
  orderRef: string;
  customerName: string;
  customerEmail?: string | null;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  transactionId: string;
  items: OrderEmailItem[];
  totalAmount: number;
}

const itemsTable = (items: OrderEmailItem[], total: number) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
    <thead>
      <tr style="background:#1a3a2a;color:#ffffff;">
        <th style="padding:8px 12px;text-align:left;">उत्पादन / Product</th>
        <th style="padding:8px 12px;text-align:center;">संख्या / Qty</th>
        <th style="padding:8px 12px;text-align:right;">रकम / Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((i) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e4e4e7;">${escapeHtml(i.productName)}</td>
        <td style="padding:8px 12px;border:1px solid #e4e4e7;text-align:center;font-family:monospace;">${escapeHtml(i.quantity)}</td>
        <td style="padding:8px 12px;border:1px solid #e4e4e7;text-align:right;font-family:monospace;">Rs. ${escapeHtml(i.lineTotal.toLocaleString('en-IN'))}</td>
      </tr>`).join('')}
      <tr style="background:#fafafa;font-weight:bold;">
        <td colspan="2" style="padding:10px 12px;text-align:right;border:1px solid #e4e4e7;">जम्मा / Total</td>
        <td style="padding:10px 12px;text-align:right;border:1px solid #e4e4e7;color:#b45309;font-size:15px;">Rs. ${escapeHtml(total.toLocaleString('en-IN'))}</td>
      </tr>
    </tbody>
  </table>`;

export const sendOrderConfirmationEmail = (o: OrderEmailPayload) => {
  if (!o.customerEmail) return Promise.resolve();
  return send({
    to: o.customerEmail,
    replyTo: FARM_EMAIL,
    subject: `📋 अर्डर प्राप्त भयो (Order received) #${o.orderRef} - Hazaridevi Duck Farm`,
    html: layout(
      'तपाईंको अर्डर प्राप्त भयो',
      `<p>नमस्ते <strong>${escapeHtml(o.customerName)}</strong> जी,</p>
       <p>तपाईंको अर्डर सफलतापूर्वक दर्ता भयो। भुक्तानी प्रमाणित भएपछि हामी सामान प्याक गरी बसमा पठाउनेछौं र बस नम्बर तथा बिल्टी इमेल गर्नेछौं।<br>
       <span style="color:#52525b;">We've received your order. Once payment is verified we'll pack and dispatch it, then email you the bus number and bilty.</span></p>
       ${itemsTable(o.items, o.totalAmount)}
       <table style="width:100%;border-collapse:collapse;font-size:13px;">
         ${row('अर्डर नम्बर / Order Ref', `#${escapeHtml(o.orderRef)}`)}
         ${row('डेलिभरी ठेगाना / Delivery', escapeHtml(o.deliveryAddress))}
         ${row('भुक्तानी / Payment', `${escapeHtml(o.paymentMethod.toUpperCase())} • ${escapeHtml(o.transactionId)}`)}
         ${row('फोन / Phone', escapeHtml(o.phone))}
       </table>
       <p style="font-size:12px;color:#71717a;margin-top:18px;">कुनै प्रश्न भए यो इमेलको जवाफ दिनुहोस् वा +977 ${PRIMARY_PHONE} मा फोन गर्नुहोस्।</p>`
    )
  });
};

export const sendNewOrderAdminEmail = (o: OrderEmailPayload) =>
  send({
    to: ADMIN_NOTIFY_EMAIL,
    replyTo: o.customerEmail || undefined,
    subject: `🛒 नयाँ अर्डर #${o.orderRef} - ${o.customerName} - Rs. ${o.totalAmount.toLocaleString('en-IN')}`,
    html: layout(
      `नयाँ अर्डर आयो #${escapeHtml(o.orderRef)}`,
      `<p>वेबसाइटबाट नयाँ अर्डर प्राप्त भयो। भुक्तानी प्रमाणित गरी Admin Dashboard मा स्थिति अपडेट गर्नुहोस्।</p>
       ${itemsTable(o.items, o.totalAmount)}
       <table style="width:100%;border-collapse:collapse;font-size:13px;">
         ${row('ग्राहक / Customer', escapeHtml(o.customerName))}
         ${row('फोन / Phone', escapeHtml(o.phone))}
         ${row('इमेल / Email', escapeHtml(o.customerEmail || '—'))}
         ${row('डेलिभरी / Delivery', escapeHtml(o.deliveryAddress))}
         ${row('भुक्तानी / Payment', `${escapeHtml(o.paymentMethod.toUpperCase())} • ${escapeHtml(o.transactionId)}`)}
       </table>`
    )
  });

/* ======================= CONTACT FORM ======================= */

export interface ContactEmailPayload {
  ref: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

/** Message body with line breaks preserved, escaped */
const messageBlock = (message: string) => `
  <div style="background:#f4fbf7;border:1px solid #a7f3d0;border-radius:4px;padding:14px 16px;margin:16px 0;white-space:pre-wrap;font-size:14px;color:#18181b;">${escapeHtml(message)}</div>`;

/** To the farm: full message, Reply goes straight to the customer */
export const sendContactAdminEmail = (c: ContactEmailPayload) =>
  send({
    to: ADMIN_NOTIFY_EMAIL,
    replyTo: c.email,
    subject: `✉️ वेबसाइट सम्पर्क [${c.ref}]: ${c.subject} - ${c.fullName}`,
    html: layout(
      'वेबसाइटबाट नयाँ सन्देश',
      `<table style="width:100%;border-collapse:collapse;font-size:13px;">
         ${row('नाम / Name', escapeHtml(c.fullName))}
         ${row('इमेल / Email', `<a href="mailto:${escapeHtml(c.email)}" style="color:#047857;">${escapeHtml(c.email)}</a>`)}
         ${row('फोन / Phone', c.phone ? `<a href="tel:${escapeHtml(c.phone)}" style="color:#047857;">${escapeHtml(c.phone)}</a>` : '—')}
         ${row('विषय / Subject', escapeHtml(c.subject))}
         ${row('सन्दर्भ / Ref', escapeHtml(c.ref))}
       </table>
       ${messageBlock(c.message)}
       <p style="font-size:12px;color:#71717a;">यो इमेलमा "Reply" थिच्दा सिधै ग्राहकलाई जवाफ जान्छ। / Hit "Reply" to answer the customer directly.</p>`
    )
  });

/** To the customer: confirmation with a copy of what they sent */
export const sendContactAckEmail = (c: ContactEmailPayload) =>
  send({
    to: c.email,
    replyTo: FARM_EMAIL,
    subject: `✅ तपाईंको सन्देश प्राप्त भयो (We got your message) [${c.ref}] - Hazaridevi Duck Farm`,
    html: layout(
      'तपाईंको सन्देश प्राप्त भयो',
      `<p>नमस्ते <strong>${escapeHtml(c.fullName)}</strong> जी,</p>
       <p>हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद! तपाईंको सन्देश हाम्रो टिमसम्म पुगेको छ, हामी छिट्टै जवाफ दिनेछौं।<br>
       <span style="color:#52525b;">Thanks for contacting us! Your message has reached our team and we'll get back to you soon.</span></p>
       <p style="font-size:13px;color:#52525b;margin-bottom:4px;"><strong>विषय / Subject:</strong> ${escapeHtml(c.subject)} &nbsp;•&nbsp; <strong>Ref:</strong> ${escapeHtml(c.ref)}</p>
       ${messageBlock(c.message)}
       <p style="font-size:13px;">जरुरी भए सिधै फोन गर्नुहोस्: <strong>+977 ${PRIMARY_PHONE}</strong> / <strong>+977 ${SECONDARY_PHONE}</strong><br>
       <span style="color:#52525b;">For anything urgent, call us directly.</span></p>`
    )
  });

/* ======================= DISPATCH SLIP ======================= */

export interface DispatchEmailPayload {
  customerEmail: string;
  customerName: string;
  orderId: string;
  productName: string;
  quantity: number | string;
  busNumber: string;
  driverPhone: string;
  biltyNumber: string;
  counterName: string;
  estimatedArrival: string;
}

export const sendDispatchSlipEmail = (d: DispatchEmailPayload) =>
  send({
    to: d.customerEmail,
    cc: DISPATCH_CC_EMAIL || undefined,
    subject: `🚌 डेलिभरी तथा बस ट्र्याकिङ स्लिप [${d.orderId}] - Hazaridevi Duck Farm`,
    html: layout(
      'तपाईंको अर्डर बसमा पठाइयो 🚌',
      `<p>नमस्ते <strong>${escapeHtml(d.customerName)}</strong> जी,</p>
       <p>हजारीदेवी डक फार्मबाट तपाईंको अर्डर डिलक्स बसमार्फत पठाइएको छ। विवरण तल छ:</p>
       <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0;">
         ${row('अर्डर कोड / Order ID', escapeHtml(d.orderId))}
         ${row('सामग्री / Product', `${escapeHtml(d.productName)} (${escapeHtml(d.quantity)} units)`)}
         ${row('🚌 बस नम्बर / Bus No', escapeHtml(d.busNumber || 'अपडेट गरिएको'))}
         ${row('📞 चालक फोन / Driver', escapeHtml(d.driverPhone || 'काउन्टरमा सम्पर्क गर्नुहोला'))}
         ${row('🧾 बिल्टी / Bilty', escapeHtml(d.biltyNumber || 'काउन्टर रसिद'))}
         ${row('📍 काउन्टर / Counter', escapeHtml(d.counterName || 'बसपार्क काउन्टर'))}
         ${row('⏰ अनुमानित समय / ETA', escapeHtml(d.estimatedArrival || 'तोकिएको समय'))}
       </table>
       <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;font-size:13px;color:#78350f;">
         बस आइपुग्नासाथ काउन्टरमा बिल्टी नम्बर देखाई सामान तुरुन्त बुझ्नुहोला। चल्लालाई न्यानो ठाउँमा राखी ग्लुकोज पानी खुवाउनुहोला।
       </div>`
    )
  });

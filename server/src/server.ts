import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config'; // must load before modules that read process.env at import time
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createAuthRouter, getCustomerFromRequest, requireAdmin } from './routes/auth';
import {
  sendDispatchSlipEmail,
  sendOrderConfirmationEmail,
  sendNewOrderAdminEmail,
  verifyEmailTransport,
  sendContactAdminEmail,
  sendContactAckEmail
} from './services/emailService';
import { sendAdminSms, smsConfigured } from './services/smsService';


const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- JWT SECRET: never fall back to a guessable default ---
const JWT_SECRET = process.env.JWT_SECRET || '';
if (JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET is missing or shorter than 32 characters. Set a long random value in server/.env');
  process.exit(1);
}

// Behind a reverse proxy (Nginx, Render, Railway...) set TRUST_PROXY=1 so rate limits see real client IPs
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
}

// --- SECURITY HEADERS (Helmet) ---
// This server only returns JSON, so the strictest CSP is fine. Cross-origin resource
// policy is relaxed because the React app on another port/domain must read responses.
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// --- CORS: only our own frontends may call the API from a browser ---
const allowedOrigins = new Set([
  'https://hazarideviduckfarm.com',
  'https://www.hazarideviduckfarm.com',
  ...(process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean),
  ...(IS_PRODUCTION ? [] : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ])
]);
// In development also allow phones/laptops on the home Wi-Fi (e.g. http://192.168.1.5:5173)
const LAN_ORIGIN = /^http:\/\/(192\.168|10)\.\d{1,3}\.\d{1,3}(\.\d{1,3})?:\d{2,5}$/;

app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header (curl, server-to-server, same-origin) are not browser CORS requests
    if (!origin || allowedOrigins.has(origin) || (!IS_PRODUCTION && LAN_ORIGIN.test(origin))) {
      return callback(null, true);
    }
    console.warn(`🚫 CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));

// --- RATE LIMITING ---
const tooManyRequests = { success: false, message: 'Too many requests. Please wait a few minutes and try again.' };
// General ceiling for every API route
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests
}));
// Public forms & payment initiation: stop spam/bot submissions
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests
});
// Order tracking lookups: stop scraping customer orders
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests
});

// Body size limit: big enough for a base64 receipt/product photo, small enough to block abuse
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// --- 1. ZOD VALIDATION SCHEMAS ---
const orderItemSchema = z.object({
  productName: z.string().trim().min(1).max(200),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100000),
  totalPrice: z.number().positive().max(100_000_000)
});

// One checkout = one or more cart items. The older single-item shape is still accepted.
const orderValidationSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().trim().regex(/^[0-9+]{10,14}$/, 'Valid phone number required (10-14 digits)'),
  customerEmail: z.string().trim().toLowerCase().email('Valid email required').max(254).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  municipality: z.string().max(150).optional().nullable(),
  busCounter: z.string().max(200).optional().nullable(),
  addressText: z.string().trim().min(3, 'Clear address required').max(500),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  items: z.array(orderItemSchema).min(1, 'Cart is empty').max(30).optional(),
  productName: z.string().min(1).max(200).optional(),
  quantity: z.number().int().min(1).optional(),
  totalPrice: z.number().positive().optional(),
  paymentMethod: z.enum(['esewa', 'khalti', 'bank']).optional().default('esewa'),
  transactionId: z.string().trim().max(100).optional().nullable(),
  receiptScreenshotUrl: z.string().max(20_000_000).optional().nullable()
}).refine((d) => d.items?.length || (d.productName && d.quantity && d.totalPrice), {
  message: 'Order must contain at least one product'
});

const visitValidationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+]{10,14}$/, 'Valid phone number required'),
  visitDate: z.string().min(4, 'Visit date required'),
  visitorCount: z.number().min(1).default(1),
  purpose: z.string().optional().nullable()
});

const productValidationSchema = z.object({
  title: z.string().min(1, 'Product title required'),
  category: z.string().default('ducklings'),
  badge: z.string().optional().nullable(),
  description: z.string().min(1, 'Description required'),
  minOrder: z.string().default('1 unit'),
  price: z.number().positive('Price must be greater than zero'),
  unit: z.string().default('/duckling'),
  imageUrl: z.string().optional().default(''),
  inStock: z.boolean().default(true)
});

// --- 2. AUTHENTICATION MIDDLEWARE ---
// Admin = a logged-in, verified account whose email is listed in ADMIN_EMAILS (see routes/auth.ts)
const verifyAdminToken = requireAdmin(prisma, JWT_SECRET);

// --- 3. PAYMENT GATEWAY INTEGRATIONS ---
// Payment redirects always go back to our own site, never to a caller-supplied Origin
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

app.post('/api/payment/khalti/initiate', publicWriteLimiter, async (req: Request, res: Response) => {
  try {
    const { amount, transactionUuid, purchaseOrderName, customerInfo } = req.body;
    const origin = FRONTEND_URL;
    const amountInPaisa = Math.round(Number(amount) * 100);

    const payload = {
      return_url: `${origin}/order?status=success&gateway=khalti`,
      website_url: origin,
      amount: amountInPaisa,
      purchase_order_id: transactionUuid || `hz-${Date.now()}`,
      purchase_order_name: purchaseOrderName || 'Hazaridevi Duck Farm Requisition',
      customer_info: {
        name: customerInfo?.name || 'Customer',
        email: customerInfo?.email || 'customer@gmail.com',
        phone: customerInfo?.phone || '9800000001'
      }
    };

    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      payload,
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.json({ 
      success: true, 
      payment_url: response.data.payment_url, 
      pidx: response.data.pidx 
    });
  } catch (error: any) {
    const errorDetails = error?.response?.data || error.message;
    console.error('Khalti Initiation Failed:', errorDetails);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate Khalti payment',
      details: errorDetails 
    });
  }
});

app.post('/api/payment/esewa/initiate', publicWriteLimiter, (req: Request, res: Response) => {
  try {
    const { amount, transactionUuid } = req.body;
    const origin = FRONTEND_URL;

    const cleanAmount = String(Math.round(Number(amount)));
    const txnId = transactionUuid || `hz-${Date.now()}`;
    // Defaults are eSewa's public sandbox credentials; set real ones in .env to go live
    const productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
    const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

    const hashString = `total_amount=${cleanAmount},transaction_uuid=${txnId},product_code=${productCode}`;
    const signature = crypto.createHmac('sha256', secretKey).update(hashString).digest('base64');

    return res.json({
      success: true,
      action_url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      amount: cleanAmount,
      tax_amount: '0',
      total_amount: cleanAmount,
      transaction_uuid: txnId,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${origin}/order?status=success&gateway=esewa`,
      failure_url: `${origin}/order?status=failed&gateway=esewa`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/payment/bank/initiate', publicWriteLimiter, async (req: Request, res: Response) => {
  try {
    const { amount, transactionUuid } = req.body;
    return res.json({
      success: true,
      bankDetails: {
        bankName: 'Rastriya Banijya Bank (RBB)',
        accountName: 'Hazaridevi Duck Farm',
        accountNumber: '1340100028491001',
        branch: 'Lahan Branch, Siraha (Branch Code: 134)',
        amount: Number(amount) || 0,
        referenceId: transactionUuid || `RBB-${Date.now()}`
      },
      instructions: 'Deposit via Mobile Banking / ConnectIPS / Counter and enter reference code'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// --- 4. PUBLIC ORDER & TRACKING ROUTES ---
app.get('/api/orders/track', trackingLimiter, async (req: Request, res: Response) => {
  try {
    const rawSearch = String(req.query.phone || req.query.query || '').trim().slice(0, 64);
    if (!rawSearch) {
      return res.status(400).json({ success: false, message: 'Phone number or Order ID is required' });
    }

    // Exact matches only: partial/name searches let strangers browse other customers' orders
    const whereConditions: any[] = [{ transactionId: rawSearch }];

    const orderCode = rawSearch.toUpperCase().match(/^HDF-REC-0*(\d+)$/);
    if (orderCode) {
      whereConditions.push({ id: Number(orderCode[1]) });
    }

    const digits = rawSearch.replace(/[^0-9]/g, '');
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      whereConditions.push({ phone: last10 }, { phone: `977${last10}` }, { phone: `+977${last10}` });
    }

    const matchedOrders = await prisma.order.findMany({
      where: { OR: whereConditions },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return res.json({
      success: true,
      count: matchedOrders.length,
      orders: matchedOrders.map((o) => ({
        id: o.id,
        _id: o.id.toString(),
        orderId: `HDF-REC-${o.id.toString().padStart(6, '0')}`,
        customerName: o.customerName,
        phone: o.phone,
        productName: o.productName,
        quantity: o.quantity,
        totalPrice: o.totalPrice,
        paymentMethod: (o as any).paymentMethod || 'esewa',
        status: o.status || 'confirmed',
        busCounter: (o as any).busCounter || '',
        busNumber: (o as any).busNumber || '',
        driverPhone: (o as any).driverPhone || '',
        biltyNumber: (o as any).biltyNumber || '',
        estimatedArrival: (o as any).estimatedArrival || '',
        createdAt: o.createdAt.toISOString()
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/orders', publicWriteLimiter, async (req: Request, res: Response) => {
  try {
    const data = orderValidationSchema.parse(req.body);
    const mapUrl = data.latitude && data.longitude
      ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
      : null;

    // Logged-in customers get the order linked to their account (guests can still check out)
    const customer = await getCustomerFromRequest(req, prisma, JWT_SECRET);
    const customerEmail = data.customerEmail || customer?.email || null;
    const transactionId = data.transactionId || `WEB-${Date.now()}`;

    const items = data.items?.length
      ? data.items
      : [{ productName: data.productName!, quantity: data.quantity!, totalPrice: data.totalPrice! }];

    // Each cart line is stored as its own Order row (what the admin dashboard expects),
    // all sharing the same transaction ID. Created together so a checkout is all-or-nothing.
    const created = await prisma.$transaction(
      items.map((item) =>
        prisma.order.create({
          data: {
            customerName: data.customerName,
            phone: data.phone,
            customerEmail,
            province: data.province || null,
            district: data.district || null,
            municipality: data.municipality || null,
            busCounter: data.busCounter || null,
            addressText: data.addressText,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            mapUrl,
            productName: item.productName,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            paymentMethod: data.paymentMethod,
            transactionId,
            receiptScreenshotUrl: data.receiptScreenshotUrl || '',
            customerId: customer?.id ?? null
          }
        })
      )
    );

    const orderRef = `HDF-REC-${String(created[0].id).padStart(6, '0')}`;
    const emailPayload = {
      orderRef,
      customerName: data.customerName,
      customerEmail,
      phone: data.phone,
      deliveryAddress: data.addressText,
      paymentMethod: data.paymentMethod,
      transactionId,
      items: created.map((o) => ({ productName: o.productName, quantity: o.quantity, lineTotal: o.totalPrice })),
      totalAmount: created.reduce((sum, o) => sum + o.totalPrice, 0)
    };

    // Emails go out in the background so a slow mail server never blocks the checkout
    Promise.allSettled([sendOrderConfirmationEmail(emailPayload), sendNewOrderAdminEmail(emailPayload)])
      .then((results) => results.forEach((r) => {
        if (r.status === 'rejected') console.error(`Order ${orderRef} email failed:`, r.reason?.message || r.reason);
      }));

    return res.status(201).json({
      success: true,
      orderRef,
      transactionId,
      orderIds: created.map((o) => o.id),
      totalAmount: emailPayload.totalAmount
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.issues?.[0]?.message });
    }
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Farm Visit Booking
app.post('/api/visits', publicWriteLimiter, async (req: Request, res: Response) => {
  try {
    const data = visitValidationSchema.parse({
      ...req.body,
      visitorCount: Number(req.body.visitorCount) || 1
    });

    const newVisit = await (prisma as any).farmVisit.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        visitDate: data.visitDate,
        visitorCount: data.visitorCount,
        purpose: data.purpose || 'General Tour'
      }
    });

    return res.status(201).json({ success: true, visit: newVisit });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.issues?.[0]?.message });
    }
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- CONTACT PAGE FORM ---
// Admin: email + SMS. Customer: confirmation email only.
const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(254),
  phone: z.string().trim().regex(/^[0-9+]{10,14}$/, 'Phone must be 10-14 digits').optional().or(z.literal('')),
  subject: z.string().trim().min(2, 'Please choose a subject').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
  // Honeypot: hidden on the page, so only bots fill it in
  website: z.string().optional()
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again in an hour, or call us directly.' }
});

app.post('/api/contact', contactLimiter, async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid input' });
  }
  const { website, ...data } = parsed.data;

  // Bot filled the hidden field: pretend it worked, store nothing, send nothing
  if (website) {
    return res.status(201).json({ success: true, ref: 'HDF-MSG-000000' });
  }

  try {
    const saved = await prisma.contactMessage.create({
      data: { ...data, phone: data.phone || null }
    });
    const ref = `HDF-MSG-${String(saved.id).padStart(6, '0')}`;
    const payload = { ref, ...data };

    // Notifications run in the background; the message is already safely saved
    const sms = `Hazaridevi website msg ${ref}\nFrom: ${data.fullName}${data.phone ? ` (${data.phone})` : ''}\nEmail: ${data.email}\nRe: ${data.subject}\n${data.message.replace(/\s+/g, ' ').slice(0, 140)}`;
    Promise.allSettled([sendContactAdminEmail(payload), sendAdminSms(sms), sendContactAckEmail(payload)])
      .then(([adminMail, , ackMail]) => {
        if (adminMail.status === 'rejected') console.error(`Contact ${ref}: admin email failed:`, adminMail.reason?.message);
        if (ackMail.status === 'rejected') console.error(`Contact ${ref}: customer email failed:`, ackMail.reason?.message);
      });

    return res.status(201).json({ success: true, ref });
  } catch (error) {
    console.error('Contact form failed:', error);
    return res.status(500).json({ success: false, message: 'Could not send your message. Please call us instead.' });
  }
});

// Public Products Listing
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await (prisma as any).product.findMany({
      orderBy: { id: 'asc' }
    });
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- 5a. CUSTOMER ACCOUNTS (register / verify email / login / password reset & change) ---
app.use('/api/auth', createAuthRouter({
  prisma,
  jwtSecret: JWT_SECRET,
  frontendUrl: FRONTEND_URL,
  // Separate counter from the admin login so one can't lock out the other
  loginLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many failed login attempts. Try again in 15 minutes.' }
  }),
  // Anything that sends an email: stops people using us to spam someone's inbox
  emailLimiter: rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many email requests. Please try again in an hour.' }
  })
}));

// --- 6. PROTECTED ADMIN ROUTES: ORDERS & EMAIL DISPATCH ---
app.get('/api/admin/orders', verifyAdminToken, async (_req: Request, res: Response) => {
  try {
    const rawOrders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    const orders = rawOrders.map((o) => ({
      _id: o.id.toString(),
      id: o.id.toString(),
      customerName: o.customerName,
      phone: o.phone,
      customerEmail: (o as any).customerEmail || '',
      province: (o as any).province || '',
      district: (o as any).district || '',
      municipality: (o as any).municipality || '',
      busCounter: (o as any).busCounter || '',
      addressText: o.addressText,
      location: { latitude: o.latitude, longitude: o.longitude, mapUrl: o.mapUrl },
      productName: o.productName,
      quantity: o.quantity,
      totalPrice: o.totalPrice,
      paymentMethod: (o as any).paymentMethod || 'esewa',
      paymentDetails: { transactionId: o.transactionId, receiptScreenshotUrl: o.receiptScreenshotUrl },
      status: o.status,
      busNumber: (o as any).busNumber || '',
      driverPhone: (o as any).driverPhone || '',
      biltyNumber: (o as any).biltyNumber || '',
      estimatedArrival: (o as any).estimatedArrival || '',
      createdAt: o.createdAt.toISOString()
    }));
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DIRECT EMAIL DISPATCH SLIP ROUTE (Admin UI se trigger hota hai)
app.post('/api/admin/orders/:id/send-email', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      customerEmail, customerName, productName, 
      quantity, busNumber, driverPhone, 
      biltyNumber, counterName, estimatedArrival 
    } = req.body;

    if (!customerEmail || !customerEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const parsedId = isNaN(Number(id)) ? id : Number(id);

    try {
      await prisma.order.update({
        where: { id: parsedId as any },
        data: { customerEmail } as any
      });
    } catch {
      // Ignored if schema doesn't have field yet
    }

    // Email dispatch trigger (Customer + Rad CC)
    await sendDispatchSlipEmail({
      customerEmail,
      customerName: customerName || 'Valued Customer',
      orderId: `HDF-DISPATCH-${String(id).slice(-4).toUpperCase()}`,
      productName: productName || 'Ducklings / Eggs',
      quantity: quantity || 1,
      busNumber: busNumber || 'Confirmed Deluxe Bus',
      driverPhone: driverPhone || 'Counter Contact Available',
      biltyNumber: biltyNumber || 'Available at Counter',
      counterName: counterName || 'Designated Bus Counter',
      estimatedArrival: estimatedArrival || 'Expected Tomorrow Morning'
    });

    console.log(`📧 Dispatch slip email sent successfully to ${customerEmail} ( CC: Rad )`);
    return res.json({ success: true, message: `Email sent to ${customerEmail}` });
  } catch (error: any) {
    console.error('Email Dispatch Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});

// Status & Dispatch Update Handler
const handleStatusUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, busNumber, driverPhone, biltyNumber, counterName, estimatedArrival, customerEmail } = req.body;
    const parsedId = isNaN(Number(id)) ? id : Number(id);

    const updatePayload: any = { status };
    if (busNumber !== undefined) updatePayload.busNumber = busNumber;
    if (driverPhone !== undefined) updatePayload.driverPhone = driverPhone;
    if (biltyNumber !== undefined) updatePayload.biltyNumber = biltyNumber;
    if (counterName !== undefined) updatePayload.busCounter = counterName;
    if (estimatedArrival !== undefined) updatePayload.estimatedArrival = estimatedArrival;
    if (customerEmail !== undefined) updatePayload.customerEmail = customerEmail;

    const updatedOrder = await prisma.order.update({
      where: { id: parsedId as any },
      data: updatePayload
    });

    // Auto-trigger email if email & bus number are present
    const targetEmail = customerEmail || (updatedOrder as any).customerEmail;
    if (targetEmail && targetEmail.includes('@') && busNumber) {
      sendDispatchSlipEmail({
        customerEmail: targetEmail,
        customerName: updatedOrder.customerName,
        orderId: `HDF-${String(updatedOrder.id).slice(-4).toUpperCase()}`,
        productName: updatedOrder.productName,
        quantity: updatedOrder.quantity,
        busNumber,
        driverPhone: driverPhone || '',
        biltyNumber: biltyNumber || '',
        counterName: counterName || (updatedOrder as any).busCounter || '',
        estimatedArrival: estimatedArrival || ''
      }).catch(err => console.error('Auto Email Warning:', err.message));
    }

    return res.json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

app.patch('/api/admin/orders/:id/status', verifyAdminToken, handleStatusUpdate);
app.put('/api/admin/orders/:id/status', verifyAdminToken, handleStatusUpdate);

app.delete('/api/admin/orders/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    await prisma.order.delete({ where: { id: parsedId as any } });
    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- 7. PROTECTED ADMIN ROUTES: VISITS ---
app.get('/api/admin/visits', verifyAdminToken, async (_req: Request, res: Response) => {
  try {
    const visits = await (prisma as any).farmVisit.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, count: visits.length, visits });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.delete('/api/admin/visits/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await (prisma as any).farmVisit.delete({ where: { id: Number(id) } });
    return res.json({ success: true, message: 'Visit record deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- 8. PROTECTED ADMIN ROUTES: PRODUCTS ---
app.post('/api/admin/products', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const parsed = productValidationSchema.parse({
      ...req.body,
      price: Number(req.body.price)
    });

    const newProduct = await (prisma as any).product.create({
      data: {
        title: parsed.title,
        category: parsed.category,
        badge: parsed.badge || '',
        description: parsed.description,
        minOrder: parsed.minOrder,
        price: parsed.price,
        unit: parsed.unit,
        imageUrl: parsed.imageUrl || '',
        inStock: parsed.inStock
      }
    });

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.issues?.[0]?.message });
    }
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.put('/api/admin/products/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);

    const dataToUpdate: any = {};
    if (req.body.title !== undefined) dataToUpdate.title = req.body.title;
    if (req.body.category !== undefined) dataToUpdate.category = req.body.category;
    if (req.body.badge !== undefined) dataToUpdate.badge = req.body.badge || '';
    if (req.body.description !== undefined) dataToUpdate.description = req.body.description;
    if (req.body.minOrder !== undefined) dataToUpdate.minOrder = req.body.minOrder;
    if (req.body.price !== undefined) dataToUpdate.price = Number(req.body.price);
    if (req.body.unit !== undefined) dataToUpdate.unit = req.body.unit;
    if (req.body.imageUrl !== undefined) dataToUpdate.imageUrl = req.body.imageUrl;
    if (req.body.inStock !== undefined) dataToUpdate.inStock = Boolean(req.body.inStock);

    const updatedProduct = await (prisma as any).product.update({
      where: { id: parsedId },
      data: dataToUpdate
    });

    return res.json({ success: true, product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.delete('/api/admin/products/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await (prisma as any).product.delete({
      where: { id: Number(id) }
    });
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// --- 9. INITIAL BOOTSTRAP ---
const seedInitialProducts = async () => {
  try {
    const count = await (prisma as any).product.count();
    if (count === 0) {
      const initialItems = [
        {
          title: "Khaki Campbell Ducklings (Day-Old)",
          category: "ducklings",
          badge: "Best Seller",
          description: "Active, high-vigor day-old ducklings from certified high-yield breeder parent flock.",
          minOrder: "25 ducklings",
          price: 130,
          unit: "/duckling",
          imageUrl: "https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&w=600&q=80",
          inStock: true
        },
        {
          title: "Khaki Campbell Ducklings (2-Week Brooded)",
          category: "ducklings",
          badge: "Low Mortality",
          description: "Pre-brooded for 14 days under heat lamps, feeding enthusiastically on starter mash. Weather-hardened.",
          minOrder: "15 ducklings",
          price: 240,
          unit: "/duckling",
          imageUrl: "https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&w=600&q=80",
          inStock: true
        },
        {
          title: "Table & Fertile Duck Eggs",
          category: "eggs",
          badge: "Fresh Daily",
          description: "Organic pasture-raised duck eggs. High nutrition, rich yolk, perfect for both table consumption and incubation.",
          minOrder: "30 eggs (1 crate)",
          price: 22,
          unit: "/egg",
          imageUrl: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
          inStock: true
        }
      ];

      for (const item of initialItems) {
        await (prisma as any).product.create({ data: item });
      }
      console.log("🦆 Initial Products Seeded");
    }
  } catch (err) {
    console.error("Product seeding check failed:", err);
  }
};

// --- 10. FALLBACK HANDLERS ---
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Catch-all error handler: log details on the server, never leak stack traces to clients
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Upload too large (max 25 MB).' });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`🚀 SQL Server running on http://localhost:${PORT}`);
  await seedInitialProducts();
  await verifyEmailTransport();
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean);
  console.log(adminEmails.length
    ? `🔑 Admin access for: ${adminEmails.join(', ')} (log in on the normal Login page)`
    : '🔑 No ADMIN_EMAILS set in .env - nobody can open the admin dashboard');
  console.log(smsConfigured()
    ? '📱 SMS alerts ready (Sparrow SMS)'
    : '📱 SMS alerts off - add SPARROW_SMS_TOKEN / SPARROW_SMS_FROM to .env to enable');
  console.log('✅ PostgreSQL Database Connected');
});
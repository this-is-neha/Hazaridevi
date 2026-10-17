import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient, Customer } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
} from '../services/emailService';

/**
 * Customer accounts:
 *   register -> verification email -> click link -> verified -> login
 *   forgot password -> reset email -> set new password -> "password changed" email
 *   logged-in change password -> "password changed" email
 */

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TTL_MS = 60 * 60 * 1000;       // 1 hour
const CUSTOMER_JWT_TTL = '7d';

export interface CustomerRequest extends Request {
  customer?: Customer;
}

interface CustomerJwt {
  cid: number;
  role: 'customer';
  iat: number;
}

// --- validation ---
const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(254);
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email,
  phone: z.string().trim().regex(/^[0-9+]{10,14}$/, 'Valid phone number required (10-14 digits)').optional().or(z.literal('')),
  password
});
const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
const emailOnlySchema = z.object({ email });
const tokenSchema = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/, 'Invalid or expired link') });
const resetSchema = z.object({ token: tokenSchema.shape.token, password });
const changeSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: password });

const firstIssue = (err: z.ZodError) => err.issues[0]?.message || 'Invalid input';
const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const publicCustomer = (c: Customer) => ({
  id: c.id,
  fullName: c.fullName,
  email: c.email,
  phone: c.phone,
  emailVerified: c.emailVerified,
  createdAt: c.createdAt
});

export function createAuthRouter(opts: {
  prisma: PrismaClient;
  jwtSecret: string;
  frontendUrl: string;
  loginLimiter: RequestHandler;
  emailLimiter: RequestHandler;
}) {
  const { prisma, jwtSecret, frontendUrl, loginLimiter, emailLimiter } = opts;
  const router = Router();
  // Compared against for unknown emails so response timing doesn't reveal which emails exist
  const dummyHash = bcrypt.hashSync('timing-equaliser', 10);

  /** Creates a one-time token, stores only its hash, returns the raw token for the email link. */
  const issueToken = async (customerId: number, type: 'VERIFY_EMAIL' | 'RESET_PASSWORD', ttlMs: number) => {
    // Old unused links of the same kind stop working once a new one is sent
    await prisma.authToken.deleteMany({ where: { customerId, type, usedAt: null } });
    const raw = crypto.randomBytes(32).toString('hex');
    await prisma.authToken.create({
      data: { customerId, type, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + ttlMs) }
    });
    return raw;
  };

  /** Finds a valid, unused, unexpired token of the given type. */
  const findToken = (raw: string, type: string) =>
    prisma.authToken.findFirst({
      where: { tokenHash: sha256(raw), type, usedAt: null, expiresAt: { gt: new Date() } },
      include: { customer: true }
    });

  const sendVerification = async (c: Customer) => {
    const token = await issueToken(c.id, 'VERIFY_EMAIL', VERIFY_TTL_MS);
    await sendVerificationEmail(c.email, c.fullName, `${frontendUrl}/verify-email?token=${token}`);
  };

  const signCustomerToken = (c: Customer) =>
    jwt.sign({ cid: c.id, role: 'customer' }, jwtSecret, { expiresIn: CUSTOMER_JWT_TTL });

  // ---------------- REGISTER ----------------
  router.post('/register', emailLimiter, async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: firstIssue(parsed.error) });
    const { fullName, email: addr, phone, password: pw } = parsed.data;

    try {
      const existing = await prisma.customer.findUnique({ where: { email: addr } });
      if (existing?.emailVerified) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists. Please log in.' });
      }

      const passwordHash = await bcrypt.hash(pw, 12);
      // An unverified account can be re-registered (e.g. typo in name, lost the email)
      const customer = existing
        ? await prisma.customer.update({ where: { id: existing.id }, data: { fullName, phone: phone || null, passwordHash } })
        : await prisma.customer.create({ data: { fullName, email: addr, phone: phone || null, passwordHash } });

      await sendVerification(customer);
      return res.status(201).json({
        success: true,
        message: 'Account created. Check your email and click the verification link to activate it.'
      });
    } catch (err) {
      console.error('Register failed:', err);
      return res.status(500).json({ success: false, message: 'Could not create account. Please try again.' });
    }
  });

  // ---------------- VERIFY EMAIL ----------------
  router.post('/verify-email', async (req: Request, res: Response) => {
    const parsed = tokenSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid or expired link' });

    const record = await findToken(parsed.data.token, 'VERIFY_EMAIL');
    if (!record) {
      return res.status(400).json({ success: false, message: 'This link is invalid or has expired. Request a new one.' });
    }

    await prisma.$transaction([
      prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.customer.update({
        where: { id: record.customerId },
        data: { emailVerified: true, emailVerifiedAt: new Date() }
      })
    ]);
    return res.json({ success: true, message: 'Email verified! You can now log in.' });
  });

  // ---------------- RESEND VERIFICATION ----------------
  router.post('/resend-verification', emailLimiter, async (req: Request, res: Response) => {
    const parsed = emailOnlySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: firstIssue(parsed.error) });

    const customer = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
    if (customer && !customer.emailVerified) {
      await sendVerification(customer).catch((e) => console.error('Resend verification failed:', e));
    }
    // Same answer either way so this can't be used to discover registered emails
    return res.json({ success: true, message: 'If that account needs verifying, a new link has been sent.' });
  });

  // ---------------- LOGIN ----------------
  router.post('/login', loginLimiter, async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const { email: addr, password: pw } = parsed.data;

    const customer = await prisma.customer.findUnique({ where: { email: addr } });
    const ok = await bcrypt.compare(pw, customer?.passwordHash || dummyHash);
    if (!customer || !ok) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!customer.emailVerified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email first. Check your inbox for the link.'
      });
    }

    return res.json({ success: true, token: signCustomerToken(customer), customer: publicCustomer(customer) });
  });

  // ---------------- FORGOT PASSWORD ----------------
  router.post('/forgot-password', emailLimiter, async (req: Request, res: Response) => {
    const parsed = emailOnlySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: firstIssue(parsed.error) });

    const customer = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
    if (customer) {
      try {
        const token = await issueToken(customer.id, 'RESET_PASSWORD', RESET_TTL_MS);
        await sendPasswordResetEmail(customer.email, customer.fullName, `${frontendUrl}/reset-password?token=${token}`);
      } catch (e) {
        console.error('Password reset email failed:', e);
      }
    }
    // Same answer either way so this can't be used to discover registered emails
    return res.json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' });
  });

  // ---------------- RESET PASSWORD (from email link) ----------------
  router.post('/reset-password', async (req: Request, res: Response) => {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: firstIssue(parsed.error) });

    const record = await findToken(parsed.data.token, 'RESET_PASSWORD');
    if (!record) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired. Request a new one.' });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.$transaction([
      prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.customer.update({
        where: { id: record.customerId },
        // Clicking the emailed link proves they own the address, so this also verifies it
        data: { passwordHash, passwordChangedAt: new Date(), emailVerified: true, emailVerifiedAt: record.customer.emailVerifiedAt ?? new Date() }
      })
    ]);

    sendPasswordChangedEmail(record.customer.email, record.customer.fullName)
      .catch((e) => console.error('Password-changed email failed:', e));
    return res.json({ success: true, message: 'Password updated. You can now log in with your new password.' });
  });

  // ---------------- LOGGED-IN ROUTES ----------------
  router.get('/me', requireCustomer(prisma, jwtSecret), (req: CustomerRequest, res: Response) => {
    return res.json({ success: true, customer: publicCustomer(req.customer!) });
  });

  router.post('/change-password', requireCustomer(prisma, jwtSecret), async (req: CustomerRequest, res: Response) => {
    const parsed = changeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: firstIssue(parsed.error) });
    const customer = req.customer!;

    if (!(await bcrypt.compare(parsed.data.currentPassword, customer.passwordHash))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the current one' });
    }

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12), passwordChangedAt: new Date() }
    });

    sendPasswordChangedEmail(updated.email, updated.fullName)
      .catch((e) => console.error('Password-changed email failed:', e));
    // Old tokens are now invalid, so hand back a fresh one to keep this device logged in
    return res.json({ success: true, message: 'Password changed successfully.', token: signCustomerToken(updated) });
  });

  router.get('/my-orders', requireCustomer(prisma, jwtSecret), async (req: CustomerRequest, res: Response) => {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customer!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, productName: true, quantity: true, totalPrice: true, paymentMethod: true,
        transactionId: true, status: true, busCounter: true, busNumber: true, biltyNumber: true,
        estimatedArrival: true, createdAt: true
      }
    });
    return res.json({ success: true, orders });
  });

  return router;
}

/** Reads a customer JWT if present. Returns null for missing/invalid/revoked tokens. */
export async function getCustomerFromRequest(req: Request, prisma: PrismaClient, jwtSecret: string) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(header.slice(7), jwtSecret) as unknown as CustomerJwt;
    if (payload.role !== 'customer' || typeof payload.cid !== 'number') return null;
    const customer = await prisma.customer.findUnique({ where: { id: payload.cid } });
    if (!customer || !customer.emailVerified) return null;
    // Tokens issued before the last password change are revoked (1s grace for clock rounding)
    if (customer.passwordChangedAt && payload.iat * 1000 < customer.passwordChangedAt.getTime() - 1000) return null;
    return customer;
  } catch {
    return null;
  }
}

/** Middleware: request must carry a valid customer token. */
export function requireCustomer(prisma: PrismaClient, jwtSecret: string) {
  return async (req: CustomerRequest, res: Response, next: NextFunction) => {
    const customer = await getCustomerFromRequest(req, prisma, jwtSecret);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Please log in again.' });
    }
    req.customer = customer;
    next();
  };
}

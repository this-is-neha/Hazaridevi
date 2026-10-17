import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle,
  LogOut, KeyRound, Package, ShieldCheck, MailCheck, Check, X
} from 'lucide-react';
import { useLang } from './LanguageContext';
import { useAuth, apiRequest } from './AuthContext';
import { PageSkeleton } from './PageSkeleton';

/* ------------------------------------------------------------------ */
/* Shared building blocks                                               */
/* ------------------------------------------------------------------ */

const useT = () => {
  const { lang } = useLang();
  return (en: string, ne: string) => (lang === 'ne' ? ne : en);
};

const AuthCard: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  title, subtitle, icon, children
}) => (
  <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md bg-white border border-zinc-200 shadow-xl rounded-xs overflow-hidden animate-fetch-in">
      <div className="bg-[#1a3a2a] px-7 py-6 border-b-2 border-amber-500 text-left">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#12271c] border border-emerald-700 text-amber-300 flex items-center justify-center shrink-0">
            {icon || <ShieldCheck size={20} />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-zinc-200 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-7 text-left">{children}</div>
    </div>
  </div>
);

const inputClass =
  'w-full pl-10 pr-4 py-3 text-sm sm:text-base text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition';

const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <label className="block space-y-1.5">
    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-800">{label}</span>
    <span className="relative block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">{icon}</span>
      {children}
    </span>
  </label>
);

const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder?: string;
}> = ({ value, onChange, autoComplete, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <input
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={128}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 cursor-pointer"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </>
  );
};

/** Live checklist matching the server's password rules */
const PasswordRules: React.FC<{ password: string }> = ({ password }) => {
  const t = useT();
  const rules = [
    { ok: password.length >= 8, label: t('At least 8 characters', 'कम्तिमा ८ अक्षर') },
    { ok: /[A-Za-z]/.test(password), label: t('Contains a letter', 'एउटा अक्षर (a-z) समावेश') },
    { ok: /[0-9]/.test(password), label: t('Contains a number', 'एउटा अंक (0-9) समावेश') }
  ];
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] font-semibold">
      {rules.map((r) => (
        <li key={r.label} className={`flex items-center gap-1 ${r.ok ? 'text-emerald-700' : 'text-zinc-500'}`}>
          {r.ok ? <Check size={12} /> : <X size={12} />} {r.label}
        </li>
      ))}
    </ul>
  );
};
const passwordValid = (p: string) => p.length >= 8 && /[A-Za-z]/.test(p) && /[0-9]/.test(p);

const Alert: React.FC<{ kind: 'error' | 'success' | 'info'; children: React.ReactNode }> = ({ kind, children }) => {
  const styles = {
    error: 'bg-red-50 border-red-300 text-red-800',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    info: 'bg-amber-50 border-amber-300 text-amber-900'
  }[kind];
  const Icon = kind === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 border px-3 py-2.5 text-sm font-medium rounded-xs ${styles}`}>
      <Icon size={17} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};

const SubmitButton: React.FC<{ busy: boolean; children: React.ReactNode; disabled?: boolean }> = ({ busy, children, disabled }) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
  >
    {busy && <Loader2 size={17} className="animate-spin" />}
    {children}
  </button>
);

/** "Resend verification email" with its own feedback state */
const ResendVerification: React.FC<{ email: string }> = ({ email }) => {
  const t = useT();
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const resend = async () => {
    if (!email) return;
    setState('sending');
    await apiRequest('/api/auth/resend-verification', { body: { email } });
    setState('sent');
  };
  if (state === 'sent') {
    return <p className="text-sm font-semibold text-emerald-700">{t('A new link has been sent - check your inbox and spam folder.', 'नयाँ लिंक पठाइयो — इनबक्स र स्प्याम फोल्डर हेर्नुहोस्।')}</p>;
  }
  return (
    <button
      type="button"
      onClick={resend}
      disabled={state === 'sending' || !email}
      className="text-sm font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4 cursor-pointer disabled:opacity-60"
    >
      {state === 'sending' ? t('Sending…', 'पठाउँदै…') : t('Resend verification email', 'प्रमाणीकरण इमेल फेरि पठाउनुहोस्')}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* LOGIN                                                               */
/* ------------------------------------------------------------------ */
export const LoginPage: React.FC = () => {
  const t = useT();
  const { login, customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);

  if (customer) return <Navigate to={customer.isAdmin ? '/admin' : from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNeedsVerify(false);
    const res = await login(email.trim(), password);
    setBusy(false);
    if (res.ok) {
      // Same login page for everyone: admin emails go straight to the dashboard
      navigate(res.data.customer?.isAdmin ? '/admin' : from, { replace: true });
    } else {
      setNeedsVerify(res.data.code === 'EMAIL_NOT_VERIFIED');
      setError(res.data.message || t('Login failed', 'लगइन असफल भयो'));
    }
  };

  return (
    <AuthCard
      title={t('Log In', 'लगइन गर्नुहोस्')}
      subtitle={t('Welcome back to Hazaridevi Duck Farm', 'हजारीदेवी डक फार्ममा फेरि स्वागत छ')}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <Alert kind={needsVerify ? 'info' : 'error'}>
            <p>{error}</p>
            {needsVerify && <div className="mt-2"><ResendVerification email={email.trim()} /></div>}
          </Alert>
        )}
        <Field label={t('Email', 'इमेल')} icon={<Mail size={16} />}>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" className={inputClass} />
        </Field>
        <Field label={t('Password', 'पासवर्ड')} icon={<Lock size={16} />}>
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4">
            {t('Forgot password?', 'पासवर्ड बिर्सनुभयो?')}
          </Link>
        </div>
        <SubmitButton busy={busy}>{t('Log In', 'लगइन')}</SubmitButton>
      </form>
      <p className="text-sm text-zinc-700 text-center mt-6">
        {t("Don't have an account?", 'खाता छैन?')}{' '}
        <Link to="/register" className="font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4">
          {t('Create one', 'नयाँ खाता खोल्नुहोस्')}
        </Link>
      </p>
    </AuthCard>
  );
};

/* ------------------------------------------------------------------ */
/* REGISTER                                                            */
/* ------------------------------------------------------------------ */
export const RegisterPage: React.FC = () => {
  const t = useT();
  const { customer } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (customer) return <Navigate to="/account" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordValid(password)) return setError(t('Password does not meet the rules below.', 'पासवर्ड तलका नियम अनुसार छैन।'));
    if (password !== confirm) return setError(t('Passwords do not match.', 'दुवै पासवर्ड मेल खाएनन्।'));
    setBusy(true);
    const res = await apiRequest('/api/auth/register', {
      body: { fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password }
    });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.data.message || t('Registration failed', 'दर्ता असफल भयो'));
  };

  if (done) {
    return (
      <AuthCard title={t('Check Your Email', 'इमेल जाँच गर्नुहोस्')} icon={<MailCheck size={20} />}>
        <div className="space-y-4 text-sm text-zinc-800 leading-relaxed">
          <p>
            {t('We sent a verification link to', 'हामीले प्रमाणीकरण लिंक पठाएका छौं:')}{' '}
            <strong className="text-zinc-950 break-all">{email.trim()}</strong>
          </p>
          <p>
            {t(
              'Open the email and click "Verify Email" to activate your account, then log in. The link works for 24 hours.',
              'इमेल खोलेर "Verify Email" बटन थिच्नुहोस्, त्यसपछि लगइन गर्नुहोस्। लिंक २४ घण्टासम्म मान्य छ।'
            )}
          </p>
          <p className="text-zinc-600">{t("Can't find it? Check your spam folder.", 'भेटिएन? स्प्याम फोल्डर हेर्नुहोस्।')}</p>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <ResendVerification email={email.trim()} />
            <Link to="/login" className="text-sm font-bold text-emerald-800 hover:text-amber-700">
              {t('Go to login →', 'लगइनमा जानुहोस् →')}
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('Create Account', 'नयाँ खाता खोल्नुहोस्')}
      subtitle={t('Track your orders and check out faster', 'अर्डर ट्र्याक गर्नुहोस् र छिटो चेकआउट गर्नुहोस्')}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <Field label={t('Full Name', 'पूरा नाम')} icon={<User size={16} />}>
          <input required minLength={2} maxLength={100} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('e.g. Ram Bahadur Shrestha', 'उदा. राम बहादुर श्रेष्ठ')} className={inputClass} />
        </Field>
        <Field label={t('Email', 'इमेल')} icon={<Mail size={16} />}>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" className={inputClass} />
        </Field>
        <Field label={t('Phone (optional)', 'फोन (ऐच्छिक)')} icon={<Phone size={16} />}>
          <input type="tel" inputMode="numeric" pattern="[0-9+]{10,14}" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" className={inputClass} />
        </Field>
        <Field label={t('Password', 'पासवर्ड')} icon={<Lock size={16} />}>
          <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
        </Field>
        <PasswordRules password={password} />
        <Field label={t('Confirm Password', 'पासवर्ड पुष्टि')} icon={<Lock size={16} />}>
          <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
        </Field>
        <SubmitButton busy={busy}>{t('Create Account', 'खाता खोल्नुहोस्')}</SubmitButton>
      </form>
      <p className="text-sm text-zinc-700 text-center mt-6">
        {t('Already registered?', 'पहिले नै खाता छ?')}{' '}
        <Link to="/login" className="font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4">
          {t('Log in', 'लगइन गर्नुहोस्')}
        </Link>
      </p>
    </AuthCard>
  );
};

/* ------------------------------------------------------------------ */
/* VERIFY EMAIL (link from email)                                      */
/* ------------------------------------------------------------------ */
export const VerifyEmailPage: React.FC = () => {
  const t = useT();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [state, setState] = useState<'checking' | 'ok' | 'failed'>('checking');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  // Links are single-use: guard against React StrictMode running the effect twice
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) {
      setState('failed');
      setMessage(t('This link is incomplete.', 'यो लिंक अपूर्ण छ।'));
      return;
    }
    apiRequest('/api/auth/verify-email', { body: { token } }).then((res) => {
      setState(res.ok ? 'ok' : 'failed');
      setMessage(res.data.message || '');
    });
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthCard title={t('Email Verification', 'इमेल प्रमाणीकरण')} icon={<MailCheck size={20} />}>
      {state === 'checking' && (
        <div className="flex items-center gap-3 text-zinc-700 py-4">
          <Loader2 className="animate-spin text-emerald-700" /> {t('Verifying your email…', 'इमेल प्रमाणित गर्दै…')}
        </div>
      )}
      {state === 'ok' && (
        <div className="space-y-5">
          <Alert kind="success">{t('Your email is verified! Your account is now active.', 'तपाईंको इमेल प्रमाणित भयो! खाता सक्रिय भयो।')}</Alert>
          <Link to="/login" className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center">
            {t('Log In Now', 'अहिले लगइन गर्नुहोस्')}
          </Link>
        </div>
      )}
      {state === 'failed' && (
        <div className="space-y-4">
          <Alert kind="error">{message || t('This link is invalid or has expired.', 'यो लिंक अमान्य वा म्याद सकिएको छ।')}</Alert>
          <p className="text-sm text-zinc-700">{t('Enter your email to get a new link:', 'नयाँ लिंकका लागि इमेल लेख्नुहोस्:')}</p>
          <Field label={t('Email', 'इमेल')} icon={<Mail size={16} />}>
            <input type="email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} placeholder="you@gmail.com" className={inputClass} />
          </Field>
          <ResendVerification email={resendEmail.trim()} />
        </div>
      )}
    </AuthCard>
  );
};

/* ------------------------------------------------------------------ */
/* FORGOT PASSWORD                                                     */
/* ------------------------------------------------------------------ */
export const ForgotPasswordPage: React.FC = () => {
  const t = useT();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await apiRequest('/api/auth/forgot-password', { body: { email: email.trim() } });
    setBusy(false);
    if (res.ok) setSent(true);
    else setError(res.data.message || t('Something went wrong', 'केही समस्या भयो'));
  };

  return (
    <AuthCard
      title={t('Forgot Password', 'पासवर्ड बिर्सनुभयो?')}
      subtitle={t("We'll email you a link to set a new one", 'नयाँ पासवर्ड राख्ने लिंक इमेलमा पठाउनेछौं')}
      icon={<KeyRound size={20} />}
    >
      {sent ? (
        <div className="space-y-4">
          <Alert kind="success">
            {t(
              'If an account exists for that email, a reset link is on its way. It works for 1 hour.',
              'उक्त इमेलमा खाता भएमा रिसेट लिंक पठाइएको छ। लिंक १ घण्टासम्म मान्य छ।'
            )}
          </Alert>
          <p className="text-sm text-zinc-600">{t("Can't find it? Check your spam folder.", 'भेटिएन? स्प्याम फोल्डर हेर्नुहोस्।')}</p>
          <Link to="/login" className="inline-block text-sm font-bold text-emerald-800 hover:text-amber-700">← {t('Back to login', 'लगइनमा फर्कनुहोस्')}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert kind="error">{error}</Alert>}
          <Field label={t('Email', 'इमेल')} icon={<Mail size={16} />}>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" className={inputClass} />
          </Field>
          <SubmitButton busy={busy}>{t('Send Reset Link', 'रिसेट लिंक पठाउनुहोस्')}</SubmitButton>
          <Link to="/login" className="block text-center text-sm font-bold text-emerald-800 hover:text-amber-700">← {t('Back to login', 'लगइनमा फर्कनुहोस्')}</Link>
        </form>
      )}
    </AuthCard>
  );
};

/* ------------------------------------------------------------------ */
/* RESET PASSWORD (link from email)                                    */
/* ------------------------------------------------------------------ */
export const ResetPasswordPage: React.FC = () => {
  const t = useT();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordValid(password)) return setError(t('Password does not meet the rules below.', 'पासवर्ड तलका नियम अनुसार छैन।'));
    if (password !== confirm) return setError(t('Passwords do not match.', 'दुवै पासवर्ड मेल खाएनन्।'));
    setBusy(true);
    const res = await apiRequest('/api/auth/reset-password', { body: { token, password } });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.data.message || t('Reset failed', 'रिसेट असफल भयो'));
  };

  return (
    <AuthCard title={t('Set New Password', 'नयाँ पासवर्ड राख्नुहोस्')} icon={<KeyRound size={20} />}>
      {!token ? (
        <div className="space-y-4">
          <Alert kind="error">{t('This reset link is incomplete.', 'यो रिसेट लिंक अपूर्ण छ।')}</Alert>
          <Link to="/forgot-password" className="text-sm font-bold text-emerald-800 hover:text-amber-700">{t('Request a new link →', 'नयाँ लिंक माग्नुहोस् →')}</Link>
        </div>
      ) : done ? (
        <div className="space-y-5">
          <Alert kind="success">
            {t(
              'Password updated! We also emailed you a confirmation. Log in with your new password.',
              'पासवर्ड परिवर्तन भयो! पुष्टि इमेल पनि पठाइयो। नयाँ पासवर्डले लगइन गर्नुहोस्।'
            )}
          </Alert>
          <Link to="/login" className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center">
            {t('Log In', 'लगइन')}
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <Alert kind="error">
              <p>{error}</p>
              <Link to="/forgot-password" className="block mt-1 font-bold underline">{t('Request a new link', 'नयाँ लिंक माग्नुहोस्')}</Link>
            </Alert>
          )}
          <Field label={t('New Password', 'नयाँ पासवर्ड')} icon={<Lock size={16} />}>
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
          </Field>
          <PasswordRules password={password} />
          <Field label={t('Confirm New Password', 'नयाँ पासवर्ड पुष्टि')} icon={<Lock size={16} />}>
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
          </Field>
          <SubmitButton busy={busy}>{t('Update Password', 'पासवर्ड परिवर्तन गर्नुहोस्')}</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
};

/* ------------------------------------------------------------------ */
/* MY ACCOUNT (profile, change password, my orders)                     */
/* ------------------------------------------------------------------ */
interface MyOrder {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  busCounter: string | null;
  busNumber: string | null;
  biltyNumber: string | null;
  estimatedArrival: string | null;
  createdAt: string;
}

const statusStyle = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'DELIVERED') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (s === 'IN_TRANSIT' || s === 'ARRIVED' || s === 'PACKED') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (s === 'TERMINATED' || s === 'CANCELLED' || s === 'LOST_IN_TRANSIT') return 'bg-red-50 text-red-800 border-red-300';
  return 'bg-zinc-100 text-zinc-700 border-zinc-300';
};

/**
 * Password changes are only possible through an emailed link (no "current password" form),
 * so someone using an unlocked, logged-in device can't change the password on their own.
 */
const RequestPasswordChange: React.FC<{ email: string }> = ({ email }) => {
  const t = useT();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const send = async () => {
    setState('sending');
    setError('');
    const res = await apiRequest('/api/auth/forgot-password', { body: { email } });
    if (res.ok) setState('sent');
    else {
      setState('error');
      setError(res.data.message || t('Could not send the email. Please try again.', 'इमेल पठाउन सकिएन। फेरि प्रयास गर्नुहोस्।'));
    }
  };

  if (state === 'sent') {
    return (
      <div className="space-y-3">
        <Alert kind="success">
          {t('We emailed a password change link to ', 'पासवर्ड परिवर्तन गर्ने लिंक यो इमेलमा पठाइयो: ')}
          <strong className="break-all">{email}</strong>
          {t('. Open it within 1 hour to set your new password.', '। नयाँ पासवर्ड राख्न १ घण्टाभित्र लिंक खोल्नुहोस्।')}
        </Alert>
        <p className="text-xs text-zinc-600">
          {t(
            "Can't find it? Check your spam folder. After the change you'll be logged out everywhere and can log in with the new password.",
            'भेटिएन? स्प्याम फोल्डर हेर्नुहोस्। परिवर्तनपछि सबै डिभाइसबाट लगआउट हुनेछ, नयाँ पासवर्डले लगइन गर्नुहोस्।'
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state === 'error' && <Alert kind="error">{error}</Alert>}
      <p className="text-sm text-zinc-700 leading-relaxed">
        {t(
          'For your security, passwords can only be changed through a link sent to your email address:',
          'सुरक्षाका लागि पासवर्ड तपाईंको इमेलमा पठाइएको लिंकबाट मात्र परिवर्तन गर्न सकिन्छ:'
        )}
      </p>
      <p className="text-sm font-bold text-zinc-950 break-all flex items-center gap-2">
        <Mail size={15} className="text-emerald-800 shrink-0" /> {email}
      </p>
      <button
        type="button"
        onClick={send}
        disabled={state === 'sending'}
        className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-wait active:scale-[0.99] text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
      >
        {state === 'sending' ? <Loader2 size={17} className="animate-spin" /> : <MailCheck size={17} />}
        {state === 'sending' ? t('Sending…', 'पठाउँदै…') : t('Email Me a Change Link', 'परिवर्तन लिंक इमेल गर्नुहोस्')}
      </button>
    </div>
  );
};

export const AccountPage: React.FC = () => {
  const t = useT();
  const { customer, token, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    if (!token || !customer) return;
    apiRequest<{ orders: MyOrder[] }>('/api/auth/my-orders', { token }).then((res) => {
      setOrders(res.ok ? res.data.orders : []);
    });
  }, [token, customer]);

  if (loading) return <PageSkeleton />;
  if (!customer) return <Navigate to="/login" replace state={{ from: '/account' }} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-left space-y-8">
      {/* Header */}
      <div className="bg-[#1a3a2a] text-white px-6 sm:px-8 py-7 border-b-2 border-amber-500 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fetch-in">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">{t('My Account', 'मेरो खाता')}</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-black mt-1">{t('Namaste', 'नमस्ते')}, {customer.fullName}</h1>
          <p className="text-sm text-zinc-200 mt-1 break-all">{customer.email}{customer.phone ? ` • ${customer.phone}` : ''}</p>
        </div>
        <button
          type="button"
          onClick={() => { logout(); navigate('/'); }}
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-black/30 border border-white/25 hover:border-amber-400 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs transition cursor-pointer"
        >
          <LogOut size={15} /> {t('Log Out', 'लगआउट')}
        </button>
      </div>

      {customer.isAdmin && (
        <Link
          to="/admin"
          className="flex items-center justify-between gap-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider px-6 py-4 rounded-xs shadow-md transition"
        >
          <span className="flex items-center gap-2"><ShieldCheck size={18} /> {t('Open Admin Dashboard', 'एडमिन ड्यासबोर्ड खोल्नुहोस्')}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Orders */}
        <section className="lg:col-span-3 bg-white border border-zinc-200 rounded-xs p-6 shadow-xs">
          <h2 className="flex items-center gap-2 text-lg font-serif font-black text-zinc-950 border-b border-zinc-200 pb-3 mb-4">
            <Package size={18} className="text-emerald-800" /> {t('My Orders', 'मेरा अर्डरहरू')}
          </h2>
          {orders === null ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => <div key={i} className="skeleton h-20 w-full" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-zinc-600">{t("You haven't placed any orders yet.", 'तपाईंले अहिलेसम्म कुनै अर्डर गर्नुभएको छैन।')}</p>
              <Link to="/products" className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xs">
                {t('Browse Products', 'उत्पादन हेर्नुहोस्')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o, i) => (
                <li
                  key={o.id}
                  className="border border-zinc-200 rounded-xs p-4 animate-fetch-in"
                  style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-950 truncate">{o.productName}</p>
                      <p className="text-xs text-zinc-600 mt-0.5 font-mono">
                        HDF-REC-{String(o.id).padStart(6, '0')} • {new Date(o.createdAt).toLocaleDateString()} • {o.quantity} {t('units', 'वटा')}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-mono font-bold uppercase px-2 py-1 border rounded-xs ${statusStyle(o.status)}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-sm">
                    <span className="font-mono font-black text-zinc-950">Rs. {o.totalPrice.toLocaleString()}</span>
                    {o.busNumber && (
                      <span className="text-xs text-zinc-700">
                        🚌 {o.busNumber}{o.biltyNumber ? ` • ${t('Bilty', 'बिल्टी')}: ${o.biltyNumber}` : ''}{o.estimatedArrival ? ` • ${o.estimatedArrival}` : ''}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Change password */}
        <section className="lg:col-span-2 bg-white border border-zinc-200 rounded-xs p-6 shadow-xs self-start">
          <h2 className="flex items-center gap-2 text-lg font-serif font-black text-zinc-950 border-b border-zinc-200 pb-3 mb-4">
            <KeyRound size={18} className="text-emerald-800" /> {t('Change Password', 'पासवर्ड परिवर्तन')}
          </h2>
          <RequestPasswordChange email={customer.email} />
        </section>
      </div>
    </div>
  );
};

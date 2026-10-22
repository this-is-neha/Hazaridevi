import React, { useEffect, useState } from 'react';
import { WHATSAPP_URL, WHATSAPP_NUMBER } from './config';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, MessageCircle, Send, User, Loader2, CheckCircle2,
  AlertCircle, ExternalLink, Tag
} from 'lucide-react';
import { useLang } from './LanguageContext';
import { useAuth, apiRequest } from './AuthContext';
import { LoginRequired } from './LoginRequired';
import { Reveal } from './Reveal';

const PRIMARY_PHONE = '9807760832';
const SECONDARY_PHONE = '9805980832';
const OFFICIAL_EMAIL = 'hazarideviduckfarm@gmail.com';
const MAPS_LOCATION_URL = 'https://share.google/95QFw9EsFJTicZMGW';
const MESSAGE_MAX = 3000;

const inputClass =
  'w-full px-4 py-3 text-sm sm:text-base text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition';

export const ContactPage: React.FC = () => {
  const { lang } = useLang();
  const t = (en: string, ne: string) => (lang === 'ne' ? ne : en);
  const { customer, token } = useAuth();

  const subjects = [
    { value: 'Order / product enquiry', label: t('Order / product enquiry', 'अर्डर / उत्पादन सोधपुछ') },
    { value: 'Delivery / bus dispatch', label: t('Delivery / bus dispatch', 'ढुवानी / बस चलानी') },
    { value: 'Bulk / wholesale order', label: t('Bulk / wholesale order', 'थोक अर्डर') },
    { value: 'Farm visit', label: t('Farm visit', 'फार्म भ्रमण') },
    { value: 'Training / technical advice', label: t('Training / technical advice', 'तालिम / प्राविधिक सल्लाह') },
    { value: 'Other', label: t('Other', 'अन्य') }
  ];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot - real people never see it
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentRef, setSentRef] = useState<string | null>(null);

  // Logged-in customers don't need to retype their details
  useEffect(() => {
    if (!customer) return;
    setFullName((v) => v || customer.fullName);
    setEmail((v) => v || customer.email);
    setPhone((v) => v || customer.phone || '');
  }, [customer]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (message.trim().length < 10) {
      setError(t('Please write a little more (at least 10 characters).', 'कृपया अलि विस्तारमा लेख्नुहोस् (कम्तिमा १० अक्षर)।'));
      return;
    }
    setBusy(true);
    const res = await apiRequest<{ ref: string }>('/api/contact', {
      token,
      body: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim(),
        website
      }
    });
    setBusy(false);
    if (res.ok) {
      setSentRef(res.data.ref);
      setMessage('');
    } else {
      setError(res.data.message || t('Could not send your message. Please call us instead.', 'सन्देश पठाउन सकिएन। कृपया फोन गर्नुहोस्।'));
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: t('Call Us', 'फोन गर्नुहोस्'),
      lines: [`+977 ${PRIMARY_PHONE}`, `+977 ${SECONDARY_PHONE}`],
      href: `tel:+977${PRIMARY_PHONE}`
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      lines: [`+977 ${WHATSAPP_NUMBER}`, t('Quickest for photos & order slips', 'फोटो र अर्डर स्लिपका लागि छिटो')],
      href: WHATSAPP_URL,
      external: true
    },
    {
      icon: Mail,
      title: t('Email', 'इमेल'),
      lines: [OFFICIAL_EMAIL],
      href: `mailto:${OFFICIAL_EMAIL}`
    },
    {
      icon: MapPin,
      title: t('Visit the Farm', 'फार्ममा आउनुहोस्'),
      lines: [t('Lahan, Siraha, Madhesh Province, Nepal', 'लहान, सिरहा, मधेश प्रदेश, नेपाल'), t('Open in Google Maps', 'गुगल म्यापमा हेर्नुहोस्')],
      href: MAPS_LOCATION_URL,
      external: true
    }
  ];

  return (
    <div className="font-sans text-left">
      {/* HEADER BAND */}
      <section className="relative overflow-hidden bg-amber-50 text-zinc-950 border-b-2 border-amber-500 px-4 sm:px-8 py-14 sm:py-16">
        <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative max-w-site mx-auto space-y-3">
          <div className="animate-hero flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 font-bold">
            <span className="w-6 h-px bg-amber-600"></span>
            <span>{t('Get in Touch', 'सम्पर्क')}</span>
          </div>
          <h1
            className="animate-hero text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight"
            style={{ '--hero-delay': '120ms' } as React.CSSProperties}
          >
            {t('Contact Hazaridevi Duck Farm', 'हजारीदेवी डक फार्मलाई सम्पर्क गर्नुहोस्')}
          </h1>
          <p
            className="animate-hero text-sm sm:text-base text-zinc-700 max-w-2xl leading-relaxed"
            style={{ '--hero-delay': '240ms' } as React.CSSProperties}
          >
            {t(
              'Questions about ducklings, eggs, delivery or bulk orders? Send us a message and our team will get back to you. You\'ll receive a copy by email.',
              'चल्ला, अण्डा, ढुवानी वा थोक अर्डरबारे प्रश्न छ? सन्देश पठाउनुहोस्, हाम्रो टिमले छिट्टै जवाफ दिनेछ। सन्देशको प्रति तपाईंको इमेलमा पनि आउनेछ।'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-site mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* CONTACT DETAILS */}
        <aside className="lg:col-span-2 space-y-4">
          {contactCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-start gap-4 bg-white border border-zinc-200 hover:border-amber-500/70 hover:shadow-lg p-5 rounded-xs transition-all duration-300"
              >
                <span className="w-11 h-11 rounded-full bg-[#1a3a2a] text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <c.icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-extrabold text-zinc-950">
                    {c.title}
                    {c.external && <ExternalLink size={13} className="text-zinc-500" />}
                  </span>
                  {c.lines.map((line) => (
                    <span key={line} className="block text-sm text-zinc-700 break-all">{line}</span>
                  ))}
                </span>
              </a>
            </Reveal>
          ))}
        </aside>

        {/* FORM */}
        <Reveal className="lg:col-span-3" delay={150}>
          <div className="bg-white border border-zinc-200 shadow-xl rounded-xs overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-zinc-200 flex items-center gap-2">
              <Send size={18} className="text-emerald-800" />
              <h2 className="text-lg sm:text-xl font-serif font-black text-zinc-950">{t('Send Us a Message', 'सन्देश पठाउनुहोस्')}</h2>
            </div>

            {sentRef ? (
              <div className="p-8 sm:p-10 text-center space-y-4 animate-fetch-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-serif font-black text-zinc-950">{t('Message Sent!', 'सन्देश पठाइयो!')}</h3>
                <p className="text-sm sm:text-base text-zinc-700 max-w-md mx-auto">
                  {t('Thank you, ', 'धन्यवाद, ')}<strong>{fullName}</strong>
                  {t(
                    '. Our team has been notified and will reply soon. A copy has been emailed to ',
                    '। हाम्रो टिमलाई जानकारी गराइएको छ, छिट्टै जवाफ आउनेछ। सन्देशको प्रति इमेल गरिएको छ: '
                  )}
                  <strong className="break-all">{email}</strong>.
                </p>
                <p className="text-xs font-mono text-zinc-500">{t('Reference', 'सन्दर्भ नम्बर')}: {sentRef}</p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setSentRef(null)}
                    className="px-6 py-3 border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs transition cursor-pointer"
                  >
                    {t('Send Another', 'अर्को सन्देश')}
                  </button>
                  <Link
                    to="/products"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xs transition"
                  >
                    {t('Browse Products', 'उत्पादन हेर्नुहोस्')}
                  </Link>
                </div>
              </div>
            ) : !customer ? (
              <LoginRequired actionEn="send us a message" actionNe="सन्देश पठाउन" />
            ) : (
              <form onSubmit={submit} className="p-6 sm:p-8 space-y-5" noValidate={false}>
                {error && (
                  <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-300 text-red-800 px-3 py-2.5 text-sm font-semibold rounded-xs">
                    <AlertCircle size={17} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
                      <User size={13} /> {t('Full Name *', 'पूरा नाम *')}
                    </span>
                    <input required minLength={2} maxLength={100} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('e.g. Ram Bahadur Shrestha', 'उदा. राम बहादुर श्रेष्ठ')} className={inputClass} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
                      <Mail size={13} /> {t('Email *', 'इमेल *')}
                    </span>
                    <input type="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" className={inputClass} />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
                      <Phone size={13} /> {t('Phone (optional)', 'फोन (ऐच्छिक)')}
                    </span>
                    <input type="tel" inputMode="numeric" pattern="[0-9+]{10,14}" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" className={inputClass} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800">
                      <Tag size={13} /> {t('Subject *', 'विषय *')}
                    </span>
                    <select required value={subject} onChange={(e) => setSubject(e.target.value)} className={`${inputClass} cursor-pointer`}>
                      <option value="">{t('-- Choose a subject --', '-- विषय छान्नुहोस् --')}</option>
                      {subjects.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-800">
                    <span>{t('Message *', 'सन्देश *')}</span>
                    <span className={`font-mono normal-case tracking-normal ${message.length > MESSAGE_MAX - 200 ? 'text-amber-700' : 'text-zinc-500'}`}>
                      {message.length}/{MESSAGE_MAX}
                    </span>
                  </span>
                  <textarea
                    required
                    minLength={10}
                    maxLength={MESSAGE_MAX}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('How can we help? e.g. I need 100 day-old Khaki Campbell ducklings delivered to Pokhara.', 'हामी कसरी सहयोग गर्न सक्छौं? उदा. पोखरामा १०० वटा १ दिने खाकी क्याम्पबेल चल्ला चाहियो।')}
                    className={`${inputClass} resize-y min-h-[140px]`}
                  />
                </label>

                {/* Honeypot: off-screen and skipped by keyboard/screen readers; bots fill it, people don't */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Website
                    <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-wait active:scale-[0.99] text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {busy ? t('Sending…', 'पठाउँदै…') : t('Send Message', 'सन्देश पठाउनुहोस्')}
                </button>
                <p className="text-xs text-zinc-500 text-center">
                  {t('We only use your details to reply to this message.', 'तपाईंको विवरण यो सन्देशको जवाफ दिन मात्र प्रयोग गरिन्छ।')}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};

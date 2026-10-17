import React, { useState } from 'react';
import { WHATSAPP_URL } from './config';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Syringe, Truck, PhoneCall, ShoppingCart, CreditCard,
  PackageCheck, MapPin, ChevronDown, ArrowRight, CalendarDays, MessageCircle
} from 'lucide-react';
import { useLang } from './LanguageContext';
import { Reveal } from './Reveal';


/** Small eyebrow label + serif heading used by every home section */
const SectionHeading: React.FC<{ eyebrow: string; title: string; subtitle?: string; center?: boolean }> = ({
  eyebrow, title, subtitle, center = true
}) => (
  <Reveal className={`max-w-3xl ${center ? 'mx-auto text-center' : 'text-left'} mb-12 space-y-3`}>
    <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 font-bold ${center ? 'justify-center' : ''}`}>
      <span className="w-6 h-px bg-amber-600"></span>
      <span>{eyebrow}</span>
      <span className="w-6 h-px bg-amber-600"></span>
    </div>
    <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-zinc-950 leading-tight">{title}</h2>
    {subtitle && <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">{subtitle}</p>}
  </Reveal>
);

/* ------------------------------------------------------------------ */
/* WHY CHOOSE US                                                       */
/* ------------------------------------------------------------------ */
export const WhyChooseUs: React.FC = () => {
  const { lang } = useLang();
  const ne = lang === 'ne';

  const features = [
    {
      icon: ShieldCheck,
      title: ne ? 'शुद्ध जातको प्यारेन्ट बथान' : 'Pure-Breed Parent Flock',
      text: ne
        ? 'हाम्रै फार्मको छानिएको खाकी क्याम्पबेल प्यारेन्ट बथानबाट उत्पादित चल्ला — मिसावट वा अज्ञात जात होइन।'
        : 'Ducklings come from our own selected Khaki Campbell parent flock — no mixed or unknown breeds.'
    },
    {
      icon: Syringe,
      title: ne ? 'भ्याक्सिन र स्वास्थ्य परीक्षण' : 'Vaccinated & Health-Checked',
      text: ne
        ? 'हरेक ब्याच ह्याचरीबाट निस्कनुअघि भ्याक्सिन लगाई स्वास्थ्य जाँच गरिन्छ।'
        : 'Every batch is vaccinated and checked before it leaves the hatchery.'
    },
    {
      icon: Truck,
      title: ne ? '७ वटै प्रदेशमा रात्रि बस ढुवानी' : 'Night-Bus Delivery, All 7 Provinces',
      text: ne
        ? 'हावा छिर्ने बाकसमा प्याक गरी रात्रि बसबाट पठाइन्छ, बस नम्बर र बिल्टी तपाईंलाई पठाइन्छ।'
        : 'Packed in ventilated boxes and sent by night bus — you get the bus number and bilty.'
    },
    {
      icon: PhoneCall,
      title: ne ? 'खरिदपछि पनि प्राविधिक सहयोग' : 'Support After You Buy',
      text: ne
        ? 'ब्रुडिङ, दाना र स्वास्थ्यसम्बन्धी सल्लाहका लागि फोन वा ह्वाट्सएपमा सम्पर्क गर्नुहोस्।'
        : 'Call or WhatsApp us for brooding, feeding and health advice whenever you need it.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-site mx-auto">
        <SectionHeading
          eyebrow={ne ? 'किन हामी?' : 'Why Hazaridevi'}
          title={ne ? 'किसानहरूले हामीलाई किन रोज्छन्' : 'Why Farmers Choose Us'}
          subtitle={
            ne
              ? 'स्वस्थ चल्लादेखि सुरक्षित ढुवानी र पछिको सल्लाहसम्म — एउटै फार्मबाट।'
              : 'From healthy ducklings to safe delivery and advice afterwards — all from one farm.'
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 110} className="h-full">
              <div className="h-full bg-white border border-zinc-200 p-6 rounded-xs text-left group hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/60 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#1a3a2a] text-amber-300 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <f.icon size={22} />
                </div>
                <h3 className="font-extrabold text-lg text-zinc-950 leading-snug">{f.title}</h3>
                <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* HOW ORDERING WORKS                                                  */
/* ------------------------------------------------------------------ */
export const HowItWorks: React.FC = () => {
  const { lang } = useLang();
  const ne = lang === 'ne';

  const steps = [
    {
      icon: ShoppingCart,
      title: ne ? 'उत्पादन छान्नुहोस्' : 'Choose Products',
      text: ne ? 'क्याटलगबाट जात र संख्या छानेर कार्टमा थप्नुहोस्।' : 'Pick breeds and quantities from the catalogue and add them to your cart.'
    },
    {
      icon: CreditCard,
      title: ne ? 'सुरक्षित भुक्तानी' : 'Pay Securely',
      text: ne ? 'eSewa, Khalti वा बैंक ट्रान्सफरबाट भुक्तानी गर्नुहोस्।' : 'Pay with eSewa, Khalti or bank transfer.'
    },
    {
      icon: PackageCheck,
      title: ne ? 'प्याकिङ र चलानी' : 'We Pack & Dispatch',
      text: ne
        ? 'तपाईंको अर्डर प्याक गरी नजिकको काउन्टरतर्फ जाने रात्रि बसमा लोड गरिन्छ।'
        : 'Your order is packed and loaded onto the night bus to your nearest counter.'
    },
    {
      icon: MapPin,
      title: ne ? 'काउन्टरबाट बुझ्नुहोस्' : 'Collect at the Counter',
      text: ne ? 'बस काउन्टरमा बिल्टी नम्बर देखाएर आफ्नो सामान बुझ्नुहोस्।' : 'Show your bilty number at the bus counter and collect your order.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="max-w-site mx-auto">
        <SectionHeading
          eyebrow={ne ? 'अर्डर प्रक्रिया' : 'How It Works'}
          title={ne ? '४ सजिलो चरणमा अर्डर' : 'Order in 4 Simple Steps'}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {/* connecting line behind the step numbers (desktop) */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/60 to-amber-500/0" />

          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 150} className="relative text-center">
              <div className="relative mx-auto w-14 h-14 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg ring-8 ring-white dark:ring-[#121a16]">
                <s.icon size={22} />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1a3a2a] text-amber-300 text-[11px] font-mono font-black flex items-center justify-center border-2 border-amber-400">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-extrabold text-base sm:text-lg text-zinc-950">{s.title}</h3>
              <p className="text-sm text-zinc-700 mt-1.5 leading-relaxed max-w-[16rem] mx-auto">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
export const FaqSection: React.FC<{ onOpenVisitModal: () => void }> = ({ onOpenVisitModal }) => {
  const { lang } = useLang();
  const ne = lang === 'ne';
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: ne ? 'न्यूनतम अर्डर कति हो?' : 'What is the minimum order?',
      a: ne
        ? 'उत्पादन अनुसार फरक पर्छ — जस्तै १ दिनका खाकी क्याम्पबेल चल्ला कम्तिमा २५, अण्डा कम्तिमा १ क्यारेट। हरेक उत्पादन कार्डमा न्यूनतम संख्या लेखिएको हुन्छ।'
        : 'It depends on the product — e.g. at least 25 day-old Khaki Campbell ducklings, or 1 crate of eggs. Each product card shows its minimum.'
    },
    {
      q: ne ? 'कुन-कुन ठाउँमा ढुवानी हुन्छ?' : 'Where do you deliver?',
      a: ne
        ? 'नेपालका ७ वटै प्रदेशमा। अर्डर गर्दा तपाईंले छान्नुभएको बस काउन्टरसम्म रात्रि बसबाट पठाइन्छ।'
        : 'All 7 provinces of Nepal. Orders travel by night bus to the bus counter you choose at checkout.'
    },
    {
      q: ne ? 'भुक्तानी कसरी गर्ने?' : 'How can I pay?',
      a: ne
        ? 'eSewa, Khalti वा बैंक जम्मा (RBB) मार्फत। भुक्तानीपछि ट्रान्ज्याक्सन कोड अर्डर फारममा राख्नुहोस्।'
        : 'Through eSewa, Khalti or a bank deposit (RBB). Enter your transaction code in the order form after paying.'
    },
    {
      q: ne ? 'चल्लाहरूलाई भ्याक्सिन लगाइएको हुन्छ?' : 'Are the ducklings vaccinated?',
      a: ne
        ? 'हो। हाम्रो बथान भ्याक्सिनेटेड छ र हरेक ब्याच पठाउनुअघि स्वास्थ्य जाँच गरिन्छ।'
        : 'Yes. Our flock is vaccinated and every batch is health-checked before dispatch.'
    },
    {
      q: ne ? 'के म फार्म हेर्न आउन सक्छु?' : 'Can I visit the farm?',
      a: ne
        ? 'अवश्य। तलको बटन थिचेर फार्म भ्रमणको मिति बुक गर्नुहोस्।'
        : 'Of course. Use the button below to book a date for a farm visit.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow={ne ? 'प्रायः सोधिने प्रश्न' : 'FAQ'}
          title={ne ? 'तपाईंका प्रश्नहरू' : 'Questions Farmers Ask'}
        />

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 80}>
                <div className={`bg-white border rounded-xs transition-colors ${isOpen ? 'border-amber-500/70 shadow-md' : 'border-zinc-200'}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                  >
                    <span className="font-bold text-zinc-950 text-sm sm:text-base">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-amber-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {/* grid-rows trick animates height smoothly */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-zinc-700 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="text-center mt-8">
          <button
            type="button"
            onClick={onOpenVisitModal}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-amber-700 underline underline-offset-4 cursor-pointer"
          >
            <CalendarDays size={16} />
            {ne ? 'फार्म भ्रमण बुक गर्नुहोस्' : 'Book a Farm Visit'}
          </button>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* CALL TO ACTION BAND                                                 */
/* ------------------------------------------------------------------ */
export const CtaBand: React.FC<{ onOpenVisitModal: () => void }> = ({ onOpenVisitModal }) => {
  const { lang } = useLang();
  const ne = lang === 'ne';

  return (
    <section className="py-20 px-4 sm:px-8">
      <Reveal variant="zoom" className="max-w-site mx-auto">
        <div className="relative overflow-hidden bg-[#1a3a2a] text-white rounded-xs border-b-4 border-amber-500 px-6 sm:px-12 py-12 sm:py-14 shadow-2xl">
          {/* decorative rings */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border-[28px] border-amber-400/10 animate-float" />
          <div className="absolute -bottom-28 -left-16 w-60 h-60 rounded-full border-[20px] border-emerald-400/10" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 items-center text-left">
            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black leading-tight">
                {ne ? 'आफ्नै हाँस फार्म सुरु गर्न तयार हुनुहुन्छ?' : 'Ready to Start Your Duck Farm?'}
              </h2>
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed max-w-xl">
                {ne
                  ? 'आजै अर्डर गर्नुहोस् वा कुनै प्रश्न भए सिधै फोन/ह्वाट्सएपमा सम्पर्क गर्नुहोस्।'
                  : 'Place your order today, or call / WhatsApp us directly if you have any questions.'}
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-xs shadow-lg transition active:scale-[0.98]"
              >
                {ne ? 'अहिले अर्डर गर्नुहोस्' : 'Order Now'}
                <ArrowRight size={16} />
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-110 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xs transition"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onOpenVisitModal}
                  className="inline-flex items-center justify-center gap-2 bg-black/30 border border-white/25 hover:border-amber-400 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xs transition cursor-pointer"
                >
                  <CalendarDays size={16} />
                  {ne ? 'फार्म भ्रमण' : 'Farm Visit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

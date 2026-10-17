import React from 'react';
import { Link } from 'react-router-dom';
import { Egg, MapPin, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useLang } from './LanguageContext';
import { LegalDocs } from './LegalDocs';
import { DeliveryProcess } from './DeliveryProcess';

export const AboutPage: React.FC = () => {
  const { lang } = useLang();
  const ne = lang === 'ne';

  const highlights = [
    {
      icon: <Egg size={22} className="text-amber-700" />,
      value: '300+',
      labelEn: 'Eggs per layer, every year',
      labelNe: 'प्रति हाँस वार्षिक अण्डा'
    },
    {
      icon: <Truck size={22} className="text-amber-700" />,
      value: '7',
      labelEn: 'Provinces delivered by night bus',
      labelNe: 'प्रदेशमा रात्री बसबाट ढुवानी'
    },
    {
      icon: <ShieldCheck size={22} className="text-amber-700" />,
      value: '100%',
      labelEn: 'Vaccinated, health-inspected stock',
      labelNe: 'खोप लगाइएका, स्वास्थ्य परीक्षण गरिएका'
    },
    {
      icon: <MapPin size={22} className="text-amber-700" />,
      value: 'Siraha',
      labelEn: 'Our farm & hatchery, Madhesh Province',
      labelNe: 'हाम्रो फार्म तथा ह्याचरी, मधेश प्रदेश'
    }
  ];

  return (
    <div className="font-sans text-zinc-900">
      {/* STORY */}
      <section className="max-w-site mx-auto px-4 sm:px-6 pt-10 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 font-bold">
              <span className="w-6 h-px bg-amber-600"></span>
              <span>{ne ? 'हाम्रो बारेमा' : 'About Us'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-zinc-950 leading-tight">
              {ne
                ? 'सिराहाबाट देशभर, भरपर्दो हाँस तथा चल्ला'
                : 'Healthy ducks and ducklings, raised in Siraha and sent across Nepal'}
            </h1>
            <p className="text-base text-zinc-700 leading-relaxed">
              {ne
                ? 'हजारीदेवी बहुउद्देश्यीय कृषि फार्म सिराहा, मधेश प्रदेशमा रहेको नेपाल सरकारमा दर्ता भएको व्यावसायिक हाँस प्रजनन तथा चल्ला उत्पादन केन्द्र हो। हामी खाकी क्याम्पबेल तथा अन्य उन्नत जातका हाँसका चल्ला, भुरा हाँस, अण्डा र ताजा माछा किसानहरूलाई उपलब्ध गराउँछौँ।'
                : 'Hazaridevi Multipurpose Agriculture Farm is a government-registered commercial duck breeding and hatchery farm in Siraha, Madhesh Province. We supply farmers with Khaki Campbell and other improved-breed ducklings, grown ducks, eggs for eating and hatching, and fresh pond fish.'}
            </p>
            <p className="text-base text-zinc-700 leading-relaxed">
              {ne
                ? 'हाम्रो चल्ला आधुनिक मेसिनमा कोरलिन्छन्, पूरा खोप लगाइन्छ, र हरेक अर्डर हावा छिर्ने बलिया बाकसमा प्याक गरेर दैनिक रात्री बसमार्फत तपाईंको नजिकको बस काउन्टरसम्म पठाइन्छ। बस नम्बर र बिल्टी पठाएपछि सिधै तपाईंलाई जानकारी गराइन्छ।'
                : 'Our chicks are hatched in modern machines and fully vaccinated. Every order is packed in strong, ventilated boxes and sent by daily night bus to the counter nearest you, and we share the bus number and bilty as soon as it leaves the farm.'}
            </p>
            <p className="text-base text-zinc-700 leading-relaxed">
              {ne
                ? 'हाम्रो लक्ष्य सरल छ: किसानले राम्रो जातको स्वस्थ चल्ला पाऊन्, सही मूल्यमा, र सुरक्षित रूपमा।'
                : 'Our aim is simple: farmers get healthy, true-to-breed stock at a fair price, delivered safely.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-xs shadow-md transition"
              >
                <span>{ne ? 'उत्पादन हेर्नुहोस्' : 'View Products'}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-zinc-900 text-zinc-900 hover:bg-[#1a3a2a] hover:border-[#1a3a2a] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-xs transition"
              >
                {ne ? 'सम्पर्क गर्नुहोस्' : 'Contact Us'}
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="/gallery-2.jpeg"
              alt={ne ? 'हाम्रो फार्मका हाँसहरू' : 'Ducks at our farm'}
              loading="lazy"
              className="w-full h-72 sm:h-96 lg:h-[26rem] object-cover rounded-xs border border-emerald-900/20 shadow-lg"
            />
            <img
              src="/gallery-1.jpeg"
              alt={ne ? 'हाँसका चल्ला' : 'Ducklings'}
              loading="lazy"
              className="hidden sm:block absolute -bottom-8 -left-6 w-44 md:w-56 h-32 md:h-40 object-cover rounded-xs border-4 border-white shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mt-24 bg-[#1a3a2a] border-y-2 border-amber-500">
        <div className="max-w-site mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {highlights.map((h) => (
            <div key={h.value} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">{h.icon}</div>
              <div className="min-w-0">
                <p className="text-2xl font-serif font-black text-amber-300 leading-none">{h.value}</p>
                <p className="text-xs text-zinc-100 mt-1 leading-snug">{ne ? h.labelNe : h.labelEn}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LegalDocs />
      <DeliveryProcess />
    </div>
  );
};

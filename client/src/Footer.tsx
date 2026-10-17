import React from 'react';
import { WHATSAPP_URL, WHATSAPP_NUMBER } from './config';
import { useLang } from './LanguageContext';
import { Phone, Mail, MapPin, CheckCircle2, ExternalLink, MessageCircle } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal?: () => void;
  onOpenVisitModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal, onOpenVisitModal }) => {
  const { lang, t } = useLang();
  const PRIMARY_PHONE = '9807760832';
  const SECONDARY_PHONE = '9805980832';
  const OFFICIAL_EMAIL = 'hazarideviduckfarm@gmail.com';
  const MAPS_LOCATION_URL = 'https://share.google/95QFw9EsFJTicZMGW';
  const YOUTUBE_URL = 'https://youtube.com/@duckfarmnepal?si=gFA9yz8f1naqcyG5';

  return (
    <footer className="bg-[#1a3a2a] text-white pt-16 pb-8 border-t-2 border-amber-500 font-sans">
      <div className="max-w-site mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-emerald-800/80">
        
        {/* Column 1: Farm Info & Direct Contact Details */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white p-0.5 shadow-md shrink-0">
              <img 
                src="/logo.png" 
                alt="Hazaridevi Duck Farm Emblem" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="text-xl font-serif font-black text-white leading-tight">
                {t?.brandName || (lang === 'ne' ? 'हजारीदेवी बहुउद्देश्यीय कृषि फार्म' : 'Hazaridevi Multipurpose Agriculture Farm')}
              </h3>
              <p className="text-xs text-amber-300 font-mono tracking-wider uppercase font-bold mt-0.5">
                {t?.brandSub || (lang === 'ne' ? 'व्यावसायिक हाँस प्रजनन तथा चल्ला उत्पादन केन्द्र' : 'Commercial Duck Breeding & Hatchery')}
              </p>
            </div>
          </div>

          <p className="text-[15px] text-white leading-relaxed font-normal">
            {lang === 'ne'
              ? 'नेपाल सरकारमा दर्ता भएको व्यावसायिक ह्याचरी। उच्च गुणस्तरका खाकी क्याम्पबेल चल्ला, अण्डा तथा मासु नेपालभर रात्रि डिलक्स बसबाट सुरक्षित ढुवानी।'
              : 'Government-registered commercial waterfowl farm providing Khaki Campbell ducklings, organic eggs, live/fresh duck meat, and farm visit training across Nepal.'}
          </p>

          <div className="space-y-3 pt-2 text-[15px] font-bold text-white">
            {/* Phones */}
            <div className="flex items-center gap-2.5 text-white">
              <Phone size={16} className="text-amber-400 shrink-0" />
              <a href={`tel:+977${PRIMARY_PHONE}`} className="font-mono hover:text-amber-300 transition">
                +977 {PRIMARY_PHONE}
              </a>
              <span className="text-emerald-500 font-bold">/</span>
              <a href={`tel:+977${SECONDARY_PHONE}`} className="font-mono hover:text-amber-300 transition">
                {SECONDARY_PHONE}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-2.5 text-[#4ade80]">
              <MessageCircle size={16} className="shrink-0 text-[#25D366]" />
              <a 
                href={WHATSAPP_URL} 
                target="_blank" 
                rel="noreferrer"
                className="hover:underline font-mono"
              >
                WhatsApp: +977 {WHATSAPP_NUMBER}
              </a>
            </div>

            {/* Official Gmail */}
            <div className="flex items-center gap-2.5 text-white">
              <Mail size={16} className="text-amber-400 shrink-0" />
              <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-amber-300 transition font-mono">
                {OFFICIAL_EMAIL}
              </a>
            </div>

            {/* Clickable Live Google Maps Location */}
            <div className="flex items-center gap-2.5 text-white pt-1">
              <MapPin size={16} className="text-amber-400 shrink-0" />
              <a
                href={MAPS_LOCATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 text-white font-bold transition inline-flex items-center gap-1.5 underline underline-offset-4 decoration-amber-400"
                title="Open Farm Location on Google Maps"
              >
                <span>{lang === 'ne' ? 'फार्म लोकेसन (गुगल म्यापमा हेर्नुहोस्)' : 'Farm Location (Open Google Maps)'}</span>
                <ExternalLink size={13} className="text-amber-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Products & Services */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-mono font-black text-amber-300 uppercase tracking-widest">
            {lang === 'ne' ? 'हाम्रा उत्पादन तथा सेवाहरू' : 'Our Products & Services'}
          </h4>

          <ul className="space-y-3.5 text-[15px] font-medium text-white">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne' 
                  ? 'खाकी क्याम्पबेल चल्लाहरू (वार्षिक ३००+ अण्डा दिने)' 
                  : 'Khaki Campbell Ducklings (300+ Eggs/yr)'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne' 
                  ? 'तयारी मासु हाँस तथा ताजा हाँसको मासु' 
                  : 'Live & Fresh Cleaned Duck Meat'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne' 
                  ? 'ह्याचिङका लागि निषेचित र दैनिक उपभोग्य ताजा अण्डा' 
                  : 'Fertile Hatching & Fresh Table Eggs'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne' 
                  ? 'अजोला कल्चर तथा हाँस दाना स्टार्टर प्याक' 
                  : 'Azolla Culture & Duck Feed Starter Pack'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'ne' 
                  ? 'नेपालका सबै ७ प्रदेशमा सुरक्षित रात्रि डिलक्स बस ढुवानी' 
                  : 'Guaranteed Night-Bus Delivery to All 7 Provinces'}
              </span>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links & Official Channel */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-mono font-black text-amber-300 uppercase tracking-widest">
            {lang === 'ne' ? 'द्रुत पहुँच' : 'Quick Access'}
          </h4>

          <div className="space-y-3.5 text-[15px] font-semibold text-white">
            <a href="#products" className="block text-white hover:text-amber-300 transition">
              → {lang === 'ne' ? 'उत्पादन तथा जातहरू हेर्नुहोस्' : 'Products & Breeds'}
            </a>

            <a href="#order-section" className="block text-white hover:text-amber-300 transition">
              → {lang === 'ne' ? 'अनलाइन अर्डर फारम' : 'Online Order Form'}
            </a>

            {onOpenLegalModal && (
              <button
                type="button"
                onClick={onOpenLegalModal}
                className="block text-white hover:text-amber-300 transition text-left cursor-pointer"
              >
                → 📜 {lang === 'ne' ? 'फार्म दर्ता प्रमाणपत्रहरू' : 'Farm Legal Certificates'}
              </button>
            )}

            {onOpenVisitModal && (
              <button
                type="button"
                onClick={onOpenVisitModal}
                className="block text-white hover:text-amber-300 transition text-left cursor-pointer"
              >
                → 🗓️ {lang === 'ne' ? 'फार्म भिजिट बुक गर्नुहोस्' : 'Book Farm Visit'}
              </button>
            )}

            {/* Official YouTube Channel Button With Pure Embedded Red Badge */}
            <div className="pt-2">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 text-white hover:text-amber-300 font-bold text-sm transition bg-[#12271c] hover:bg-[#0e2017] border border-emerald-700 px-4 py-2.5 rounded-xs shadow-xs"
              >
                {/* Official YouTube Red Rounded Badge with White Play Arrow */}
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <rect width="28" height="20" rx="5" fill="#FF0000" />
                  <polygon points="11,5 19,10 11,15" fill="#FFFFFF" />
                </svg>
                <span className="font-mono">YouTube @duckfarmnepal</span>
                <ExternalLink size={14} className="text-zinc-400" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-site mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white">
        <p>
          Copyright © {new Date().getFullYear()}{' '}
          <span className="text-amber-300 font-bold font-serif">
            {t?.brandName || (lang === 'ne' ? 'हजारीदेवी बहुउद्देश्यीय कृषि फार्म' : 'Hazaridevi Multipurpose Agriculture Farm')}
          </span>
          . All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-white font-bold">
          <span>Govt. Regd: No. 11332-077/078</span>
          <span className="text-emerald-500">•</span>
          <span>Siraha, Madhesh Province, Nepal</span>
          <span className="text-emerald-500">•</span>
          <span className="text-amber-300">All 7 Provinces Live Transit</span>
        </div>
      </div>
    </footer>
  );
};
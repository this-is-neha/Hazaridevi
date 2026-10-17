import React, { useState, useEffect } from 'react';
import { useLang } from './LanguageContext';
import { ShieldCheck, PhoneCall, ShoppingBag, Award, Stethoscope, Navigation } from 'lucide-react';

export const Hero: React.FC = () => {
  const { lang } = useLang();
  const [clickedBtn, setClickedBtn] = useState<string | null>(null);

  // Dynamic Hero Image from Admin Settings
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('hz_hero_banner_image') || '/duck-hero.png';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedImg = localStorage.getItem('hz_hero_banner_image');
      if (savedImg) setHeroImage(savedImg);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const triggerAnim = (btnName: string, callback?: () => void) => {
    setClickedBtn(btnName);
    setTimeout(() => setClickedBtn(null), 300);
    if (callback) callback();
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-emerald-950 text-white overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 to-emerald-950/95 pointer-events-none" />

      {/* Main Hero Banner */}
      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>{lang === 'ne' ? 'नेपाल सरकार दर्ता तथा प्रमाणित फार्म' : 'Government Registered & Certified Farm'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          {lang === 'ne' ? (
            <>
              उच्च गुणस्तरका <span className="text-amber-400">खाकी क्याम्पबेल</span> हाँस र अण्डा
            </>
          ) : (
            <>
              High-Quality <span className="text-amber-400">Khaki Campbell</span> Ducks & Eggs
            </>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-emerald-100/90 text-sm md:text-lg leading-relaxed font-normal">
          {lang === 'ne'
            ? 'प्रमाणित फार्म गुणस्तर: भ्याक्सिन लगाइएका स्वस्थ चल्ला र ताजा अण्डा नेपालभर सुरक्षित डेलिभरी।'
            : 'Certified Farm Quality: Vaccinated healthy chicks and fresh eggs delivered safely across Nepal.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => triggerAnim('order', () => scrollToSection('order-section'))}
            className={`flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3 rounded-xl shadow-lg transition-transform duration-200 ease-in-out cursor-pointer select-none ${
              clickedBtn === 'order' ? 'scale-90 rotate-3 translate-y-1' : 'hover:scale-105'
            }`}
          >
            <ShoppingBag size={18} />
            <span>{lang === 'ne' ? 'अर्डर गर्नुहोस्' : 'Book Order'}</span>
          </button>

          <a
            href="tel:+9779807760832"
            onClick={() => triggerAnim('call')}
            className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-transform duration-200 ease-in-out cursor-pointer select-none ${
              clickedBtn === 'call' ? 'scale-90 -rotate-3 translate-y-1' : 'hover:scale-105'
            }`}
          >
            <PhoneCall size={18} />
            <span>{lang === 'ne' ? 'सिधा सम्पर्क' : 'Direct Call'}</span>
          </a>
        </div>
      </div>

      {/* Hero Featured Duck Image Showcase - Dynamically synced with Admin */}
      <div className="relative max-w-4xl mx-auto px-4 pb-10">
        <div className="rounded-2xl overflow-hidden border border-emerald-600/30 shadow-2xl bg-emerald-900/40">
          <img 
            src={heroImage} 
            alt="Certified Khaki Campbell Duck Specimen" 
            className="w-full h-64 sm:h-80 md:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="bg-emerald-950/90 px-4 py-2 border-t border-emerald-800/60 text-center">
            <span className="text-xs text-amber-400 font-mono tracking-wider">FIG. 1.0 — CERTIFIED KHAKI CAMPBELL DUCK SPECIMEN</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Container */}
      <div className="relative max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-left">
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-stone-200/80 flex items-start gap-4 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-200 shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {lang === 'ne' ? 'उच्च अण्डा उत्पादन' : 'High Egg Yield'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {lang === 'ne' ? 'वार्षिक ३००+ अण्डा दिने खाकी क्याम्पबेल' : 'Original Khaki Campbell lineage'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xl border border-stone-200/80 flex items-start gap-4 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-200 shrink-0">
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {lang === 'ne' ? 'खोप लगाइएका चल्ला' : 'Vaccinated Chicks'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {lang === 'ne' ? 'रोग प्रतिरोधी क्षमता र स्वस्थ प्रमाणित' : 'Disease-resistant certified breeds'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xl border border-stone-200/80 flex items-start gap-4 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-200 shrink-0">
              <Navigation size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {lang === 'ne' ? 'GPS डेलिभरी ट्र्याकिङ' : 'GPS Delivery Tracking'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {lang === 'ne' ? 'तपाईंको फार्ममै सिधा डेलिभरी' : 'Direct dispatch to your doorstep'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
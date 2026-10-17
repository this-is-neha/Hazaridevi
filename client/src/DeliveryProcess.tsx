import React from 'react';
import { useLang } from './LanguageContext';
import { ShieldCheck, Truck, PhoneCall } from 'lucide-react';

export const DeliveryProcess: React.FC = () => {
  const { lang } = useLang();

  const steps = [
    {
      step: '01',
      icon: <ShieldCheck className="text-emerald-700" size={24} />,
      titleEn: 'Safe, Airy & Warm Boxes',
      titleNe: 'हावा छिर्ने न्यानो र सुरक्षित बाकस',
      descEn:
        'Chicks are packed in strong boxes with air holes and dry wood shavings inside. The partitions keep them from getting squeezed during mountain road turns and keep them warm.',
      descNe:
        'चल्लाहरूलाई हावा छिर्ने प्वाल भएका र भुइँमा काठको सुख्खा भुस राखिएका बलिया बाकसमा प्याक गरिन्छ। घुम्ती बाटोहरूमा पनि चल्ला नच्यापिएर न्यानो र सुरक्षित रहन्छन्।'
    },
    {
      step: '02',
      icon: <Truck className="text-emerald-700" size={24} />,
      titleEn: 'Daily Night Bus to All 7 Provinces',
      titleNe: '७ वटै प्रदेशमा दैनिक रात्री बस सेवा',
      descEn:
        'Boxes are sent every evening from our Siraha farm inside direct passenger night buses. Under the driver and conductor’s care, they reach your nearest bus counter early morning.',
      descNe:
        'हाम्रो सिराहा फार्मबाट दैनिक साँझ डिलक्स रात्री बसमार्फत सुरक्षित पठाइन्छ। चालक र कन्डक्टरको विशेष रेखदेखमा भोलिपल्ट बिहानै तपाईंको पायक पर्ने बस काउन्टरमा पुग्छ।'
    },
    {
      step: '03',
      icon: <PhoneCall className="text-emerald-700" size={24} />,
      titleEn: 'Bus Bill on WhatsApp & Care Guide',
      titleNe: 'ह्वाट्सएपमा बिल्टी र चल्ला बुझ्ने सल्लाह',
      descEn:
        'As soon as the bus leaves, we send the bus number, driver contact, and bill photo on WhatsApp. We also guide you on phone on how to feed them right after arrival.',
      descNe:
        'गाडी छुट्नासाथ गाडी नम्बर, चालकको फोन नम्बर र बिल्टीको फोटो WhatsApp मा पठाइन्छ। चल्ला बुझेपछि सुरुमा पानी र दाना कसरी खुवाउने भनेर हामी फोनबाटै सिकाउँछौं।'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-zinc-200 font-sans">
      <div className="max-w-site mx-auto px-4 space-y-10">
        
        {/* Main Heading & Clear Subtitle */}
        <div className="max-w-3xl text-left space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {lang === 'ne'
              ? 'नेपालभर हाँसका चल्ला र अण्डा सुरक्षित पुर्‍याउने तरिका'
              : 'How We Deliver Ducks & Eggs Safely Across Nepal'}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-zinc-700 leading-relaxed">
            {lang === 'ne'
              ? 'साना चल्ला र अण्डालाई बाटोमा विशेष हेरचाह चाहिन्छ। हामी कसरी सुरक्षित प्याकिङ गरेर रात्री बसबाट तपाईंको सहरसम्म सकुशल पुर्‍याउँछौं, यहाँ हेर्नुहोस्:'
              : 'Small ducklings and eggs need gentle care on the road. Here is how we pack and deliver them safely to your city by night bus with a 100% safe arrival guarantee:'}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-zinc-50 rounded-3xl p-6 sm:p-7 border border-zinc-200 hover:border-zinc-400 hover:shadow-lg transition flex flex-col justify-between space-y-6 text-left"
            >
              <div className="space-y-4">
                {/* Step Chip and Icon */}
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-xl">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-300 flex items-center justify-center shadow-xs">
                    {item.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 leading-snug">
                  {lang === 'ne' ? item.titleNe : item.titleEn}
                </h3>

                {/* Step Description */}
                <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                  {lang === 'ne' ? item.descNe : item.descEn}
                </p>
              </div>

              {/* Bottom Guarantee indicator */}
              <div className="pt-4 border-t border-zinc-200 flex items-center gap-2 text-xs font-bold text-emerald-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>{lang === 'ne' ? '१००% सुरक्षित आगमन ग्यारेन्टी' : '100% Safe Arrival Guarantee'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
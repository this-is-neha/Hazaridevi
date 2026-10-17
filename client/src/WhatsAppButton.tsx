import React from 'react';
import { WHATSAPP_URL } from './config';
import { MessageCircle } from 'lucide-react';
import { useLang } from './LanguageContext';

export const WhatsAppButton: React.FC = () => {
  const { lang } = useLang();
  const MESSAGE = encodeURIComponent(
    lang === 'ne'
      ? 'नमस्ते, म हजारीदेवी फार्मबाट हाँसको चल्ला/अण्डा अर्डर गर्न चाहन्छु।'
      : 'Hello, I want to inquire/order ducklings and farm products from Hazaridevi Duck Farm.'
  );

  return (
    <aside aria-label="Quick WhatsApp order contact">
      <a
        href={`${WHATSAPP_URL}?text=${MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-4 right-4 z-40 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 rounded-full p-3 sm:px-4 sm:py-2.5 cursor-pointer border-2 border-white/80"
      >
        <MessageCircle size={22} className="fill-white stroke-none shrink-0" />
        {/* Mobile par sirf icon dikhega taaki content na chhipe, desktop par pura text */}
        <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider font-sans">
          {lang === 'ne' ? 'ह्वाट्सएप अर्डर' : 'WhatsApp Order'}
        </span>
      </a>
    </aside>
  );
};
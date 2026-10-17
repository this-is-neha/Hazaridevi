import React, { useState } from 'react';
import { useLang } from './LanguageContext';
import { X, Search, Truck, CheckCircle2 } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<null | {
    orderId: string;
    customer: string;
    busNo: string;
    route: string;
    status: string;
    eta: string;
  }>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    
    // Mock simulation
    setTimeout(() => {
      setSearching(false);
      setResult({
        orderId: query.toUpperCase(),
        customer: 'Registered Customer',
        busNo: 'बा प्र ०३-००१ ख ८४९२',
        route: 'Siraha → Narayanghat → Pokhara',
        status: lang === 'ne' ? 'डिलक्स बसमा प्रस्थान भइसकेको' : 'In Transit via Deluxe Bus',
        eta: '6:00 AM Tomorrow'
      });
    }, 600);
  };

  const handleClose = () => {
    setResult(null);
    setQuery('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-md border border-emerald-900/40 shadow-2xl overflow-hidden my-auto text-left relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER - MATCHED DEEP FOREST GREEN */}
        <div className="bg-[#1a3a2a] px-6 py-5 text-white border-b-2 border-amber-500 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#12271c] border border-emerald-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1.5 rounded-xs">
            <Truck size={13} className="text-amber-400 shrink-0" />
            <span>{lang === 'ne' ? 'लाइभ बस काउन्टर ट्र्याकिङ' : 'LIVE BUS COUNTER TRACKING'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
            {lang === 'ne' ? 'तपाईंको डेलिभरी ट्र्याक गर्नुहोस्' : 'Track Your Delivery'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-100 font-normal mt-1 leading-relaxed">
            {lang === 'ne'
              ? 'आफ्नो मोबाइल नम्बर वा अर्डर नम्बर हालेर प्रत्यक्ष बस ढुवानी स्थिति हेर्नुहोस्।'
              : 'Enter your phone number or Order ID to view real-time deluxe bus transit status.'}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8 space-y-6 bg-white font-sans">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
              {lang === 'ne' ? 'मोबाइल नम्बर वा अर्डर आईडी *' : 'Phone Number or Order ID *'}
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'ne' ? 'उदा. ९८XXXXXXXX वा HZ-1042' : 'e.g. 9841234567 or HZ-1042'}
                  className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={searching}
                className="px-7 py-3 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xs shadow-md transition cursor-pointer shrink-0"
              >
                {searching ? (lang === 'ne' ? 'खोज्दै...' : 'TRACKING...') : (lang === 'ne' ? 'ट्र्याक गर्नुहोस्' : 'TRACK')}
              </button>
            </div>
          </form>

          {/* SEARCH RESULT CARD */}
          {result && (
            <div className="p-5 bg-emerald-50/40 border border-emerald-900/20 space-y-3 rounded-xs animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-950 uppercase tracking-wider">
                  {lang === 'ne' ? 'अर्डर आईडी' : 'ORDER REF'}: <span className="text-amber-700 font-black">{result.orderId}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-xs">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>{result.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans pt-1">
                <div>
                  <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-wider">{lang === 'ne' ? 'बस नम्बर' : 'Bus Number'}</p>
                  <p className="font-black text-zinc-900 font-mono text-base mt-0.5">{result.busNo}</p>
                </div>
                <div>
                  <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-wider">{lang === 'ne' ? 'रुट' : 'Transit Route'}</p>
                  <p className="font-bold text-zinc-900 text-sm mt-0.5">{result.route}</p>
                </div>
                <div>
                  <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-wider">{lang === 'ne' ? 'अनुमानित आगमन' : 'Estimated Arrival'}</p>
                  <p className="font-bold text-amber-700 text-sm mt-0.5">{result.eta}</p>
                </div>
                <div>
                  <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-wider">{lang === 'ne' ? 'ग्राहक' : 'Customer'}</p>
                  <p className="font-medium text-zinc-800 text-sm mt-0.5">{result.customer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
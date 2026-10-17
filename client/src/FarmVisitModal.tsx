import React, { useState } from 'react';
import { useLang } from './LanguageContext';
import { API_BASE_URL, WHATSAPP_URL } from './config';
import { X, Send, Calendar, Users, Phone, User, MessageSquare, CheckCircle2, Mail } from 'lucide-react';

interface FarmVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmVisitModal: React.FC<FarmVisitModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLang();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitType, setVisitType] = useState('training');
  const [visitorCount, setVisitorCount] = useState('1');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation check
    if (!customerEmail || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      alert(lang === 'ne' ? 'कृपया मान्य इमेल ठेगाना (Email Address) लेख्नुहोस्।' : 'Please enter a valid email address.');
      return;
    }

    const typeLabel = 
      visitType === 'training' ? 'व्यावसायिक तालिम (Commercial Training)' :
      visitType === 'flock-inspection' ? 'चल्ला/माउ हाँस छनोट (Inspection)' : 
      'सामान्य अवलोकन (Farm Tour)';

    let numericCount = 1;
    if (visitorCount === '2') numericCount = 2;
    else if (visitorCount === '3-5') numericCount = 4;
    else if (visitorCount === '5+') numericCount = 6;

    const newVisitItem = {
      id: Date.now(),
      fullName: fullName.trim(),
      phone: phoneNumber.trim(),
      email: customerEmail.trim(),
      visitDate: visitDate,
      visitorCount: numericCount,
      purpose: `${typeLabel}${notes ? ` - Note: ${notes.trim()}` : ''}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const existingVisits = JSON.parse(localStorage.getItem('hz_farm_visits') || '[]');
      const updatedVisits = [newVisitItem, ...existingVisits];
      localStorage.setItem('hz_farm_visits', JSON.stringify(updatedVisits));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error saving visit to localStorage:', err);
    }

    try {
      await fetch(`${API_BASE_URL}/api/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVisitItem)
      });
    } catch (err) {
      console.warn('Backend API offline, visit saved to synchronized local store.');
    }

    const message = `🗓️ *नयाँ फार्म भिजिट अनुरोध (Farm Visit Booking)* 🗓️%0A%0A` +
      `👤 *आगन्तुकको नाम:* ${encodeURIComponent(fullName)}%0A` +
      `📞 *सम्पर्क फोन:* ${encodeURIComponent(phoneNumber)}%0A` +
      `📧 *इमेल:* ${encodeURIComponent(customerEmail)}%0A` +
      `📅 *भिजिट मिति:* ${encodeURIComponent(visitDate)}%0A` +
      `🎯 *भिजिट उद्देश्य:* ${encodeURIComponent(typeLabel)}%0A` +
      `👥 *मानिस संख्या:* ${encodeURIComponent(visitorCount)}%0A` +
      `📝 *थप विवरण/नोट:* ${encodeURIComponent(notes || 'कुनै छैन')}`;

    setSubmitted(true);
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank');

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-md border border-emerald-900/40 shadow-2xl overflow-hidden my-auto text-left relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER - DEEP FOREST GREEN */}
        <div className="bg-[#1a3a2a] px-6 py-5 text-white border-b-2 border-amber-500 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#12271c] border border-emerald-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1.5 rounded-xs">
            <span>OFFICIAL FARM VISIT PROTOCOL</span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
            {lang === 'ne' ? 'फार्म भिजिट तथा स्थलगत तालिम दर्ता' : 'Book Farm Visit & Training'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-100 font-normal mt-1 leading-relaxed">
            {lang === 'ne'
              ? 'आफ्नो अनुकूल मिति छान्नुहोस् र सिराहास्थित फार्म प्रत्यक्ष अवलोकनका लागि समय सुरक्षित गर्नुहोस्।'
              : 'Select your preferred date and book an in-person commercial farm tour & incubation training session.'}
          </p>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 text-zinc-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={38} />
            </div>
            <h4 className="text-2xl font-black text-zinc-950">
              {lang === 'ne' ? 'भिजिट अनुरोध प्राप्त भयो!' : 'Visit Request Registered!'}
            </h4>
            <p className="text-sm font-medium text-zinc-700 max-w-md mx-auto leading-relaxed">
              {lang === 'ne'
                ? 'तपाईंको अनुरोध दर्ता भई इमेल र ह्वाट्सएपमा पठाइएको छ। हाम्रो प्रतिनिधिले छिट्टै समय कन्फर्म गर्नुहुनेछ।'
                : 'Your booking has been registered and forwarded. Our farm representative will confirm your scheduled slot shortly.'}
            </p>
          </div>
        ) : (
          /* FORM BODY */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-white font-sans">
            
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ne' ? 'उदा. कृष्ण बहादुर कार्की' : 'e.g. Ramesh Thapa'}
                  className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* PHONE & EMAIL ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'ne' ? 'मोबाइल नम्बर *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'ne' ? 'इमेल ठेगाना *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="visitor@gmail.com"
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-mono text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* VISIT DATE & VISIT TYPE ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'ne' ? 'भिजिट मिति *' : 'Visit Date *'}
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'ne' ? 'भिजिटको उद्देश्य *' : 'Visit Type *'}
                </label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer"
                >
                  <option value="training">{lang === 'ne' ? 'व्यावसायिक तालिम (Training)' : 'Commercial Training'}</option>
                  <option value="flock-inspection">{lang === 'ne' ? 'चल्ला/माउ हाँस छनोट (Inspection)' : 'Flock Inspection'}</option>
                  <option value="general-tour">{lang === 'ne' ? 'सामान्य अवलोकन (Farm Tour)' : 'General Farm Tour'}</option>
                </select>
              </div>
            </div>

            {/* VISITORS COUNT */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'आउने मानिस संख्या *' : 'Visitors Count *'}
              </label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <select
                  value={visitorCount}
                  onChange={(e) => setVisitorCount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition cursor-pointer"
                >
                  <option value="1">{lang === 'ne' ? '१ जना (1 Person)' : '1 Person'}</option>
                  <option value="2">{lang === 'ne' ? '२ जना (2 Persons)' : '2 Persons'}</option>
                  <option value="3-5">{lang === 'ne' ? '३ - ५ जना (Small Group)' : '3 - 5 Persons'}</option>
                  <option value="5+">{lang === 'ne' ? '५ जना भन्दा बढी (Team/Group)' : '5+ Persons'}</option>
                </select>
              </div>
            </div>

            {/* NOTES / SPECIAL REQUESTS */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-800">
                {lang === 'ne' ? 'थप विवरण वा विशेष अनुरोध (ऐच्छिक)' : 'Notes / Special Requests (Optional)'}
              </label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'ne' ? 'कुन समयमा आउँदा राम्रो होला वा के तालिम लिन चाहनुहुन्छ...' : 'Any specific focus or timing preference...'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-xs focus:border-emerald-700 focus:bg-white focus:outline-none transition resize-none"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider rounded-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} className="shrink-0" />
                <span>{lang === 'ne' ? 'भिजिट सुरक्षित गर्नुहोस् (Confirm & Register)' : 'Confirm & Register Visit'}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useLang } from './LanguageContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, ExternalLink, X, Loader2, MapPin, ArrowRight } from 'lucide-react';

interface CertificateItem {
  id: string;
  titleEn: string;
  titleNe: string;
  regTypeEn: string;
  regTypeNe: string;
  regNumberEn: string;
  regNumberNe: string;
  holderEn: string;
  holderNe: string;
  addressEn: string;
  addressNe: string;
  // Cards without a scanned certificate (e.g. the farm location card) leave this empty
  docUrl?: string;
}

export const LEGAL_DOCS: CertificateItem[] = [
  {
    id: 'pan',
    titleEn: 'Permanent Account Number (PAN) Registration',
    titleNe: 'स्थायी लेखा नम्बर (PAN) दर्ता प्रमाणपत्र',
    regTypeEn: 'Inland Revenue Department / Lahan Tax Office',
    regTypeNe: 'आन्तरिक राजस्व विभाग / आन्तरिक राजस्व कार्यालय लहान',
    regNumberEn: 'PAN No: 614090000',
    regNumberNe: 'PAN No: ६१४०९००००',
    holderEn: 'Sharan Dev Yadav (Hazaridevi Multipurpose Agriculture Farm)',
    holderNe: 'शरण देव यादव (हजारी देवी बहुउद्देश्य कृषि फार्म)',
    addressEn: 'Siraha, Madhesh Province, Nepal',
    addressNe: 'सिराहा, मधेश प्रदेश, नेपाल',
    docUrl: '/574f9949-2af4-4cd8-a80a-461ef21c8013.jpeg'
  },
  {
    id: 'industry',
    titleEn: 'Cottage & Small Industries Office Registration',
    titleNe: 'घरेलु तथा साना उद्योग कार्यालय दर्ता प्रमाणपत्र',
    regTypeEn: 'Cottage & Small Industries Office, Lahan (Siraha)',
    regTypeNe: 'घरेलु तथा साना उद्योग कार्यालय, लहान (सिरहा)',
    regNumberEn: 'Govt. Registration No: 11332-077/078',
    regNumberNe: 'उद्योग दर्ता नं: ११३३२-०७७/०७८',
    holderEn: 'Hazaridevi Multipurpose Agriculture Farm (Sharan Dev Yadav)',
    holderNe: 'हजारी देवी बहुउद्देश्य कृषि फार्म (शरण देव यादव)',
    addressEn: 'Bariyarpatti, Siraha, Madhesh Province, Nepal',
    addressNe: 'बरियारपट्टी, सिराहा, मधेश प्रदेश, नेपाल',
    docUrl: '/fd632b40-adc1-4341-ab75-342d1a23a06e.jpeg'
  },
  {
    id: 'location',
    titleEn: 'Farm Location & Visits',
    titleNe: 'फार्मको ठेगाना तथा अवलोकन',
    regTypeEn: 'Open for farm visits by appointment',
    regTypeNe: 'पूर्व जानकारीसहित फार्म अवलोकन खुला',
    regNumberEn: 'Phone / WhatsApp: 9807760832',
    regNumberNe: 'फोन / ह्वाट्सएप: ९८०७७६०८३२',
    holderEn: 'Hazaridevi Multipurpose Agriculture Farm',
    holderNe: 'हजारी देवी बहुउद्देश्य कृषि फार्म',
    addressEn: 'Bariyarpatti, Siraha, Madhesh Province, Nepal',
    addressNe: 'बरियारपट्टी, सिराहा, मधेश प्रदेश, नेपाल'
  }
];

export const LegalDocs: React.FC = () => {
  const { lang } = useLang();
  const [selectedDoc, setSelectedDoc] = useState<CertificateItem | null>(null);
  const [isImgLoading, setIsImgLoading] = useState(true);

  useEffect(() => {
    LEGAL_DOCS.forEach((doc) => {
      if (!doc.docUrl) return;
      const img = new Image();
      img.src = doc.docUrl;
    });
  }, []);

  const handleOpenDoc = (doc: CertificateItem) => {
    setIsImgLoading(true);
    setSelectedDoc(doc);
  };

  return (
    <section className="py-14 bg-white text-zinc-900 font-sans" id="legal-section">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-zinc-800 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest shadow-2xs">
            <ShieldCheck size={13} className="text-amber-500 shrink-0" />
            <span>{lang === 'ne' ? 'प्रमाणित आधिकारिक कानुनी दस्तावेज' : 'OFFICIAL COMPLIANCE & LEGAL RECORDS'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {lang === 'ne' ? 'फार्म दर्ता तथा कानुनी प्रमाणपत्रहरू' : 'Official Legal Registrations & Compliance'}
          </h2>

          <p className="text-sm sm:text-base font-semibold text-zinc-800 leading-relaxed">
            {lang === 'ne'
              ? 'हाम्रो फार्म वैधानिक रूपमा दर्ता भई नेपाल सरकारका सम्पूर्ण कृषि तथा स्वास्थ्य मापदण्ड अनुसार सञ्चालित छ।'
              : 'Hazaridevi Duck Farm operates under full commercial regulatory compliance registered with Nepal Government authorities.'}
          </p>

          <div className="w-12 h-1 bg-amber-500 mx-auto mt-2" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {LEGAL_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="border-2 border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between text-left space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                    {doc.docUrl ? <FileText className="text-amber-600" size={24} /> : <MapPin className="text-amber-600" size={24} />}
                  </div>
                  {doc.docUrl && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-sm">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>{lang === 'ne' ? 'प्रमाणित (Verified)' : 'Verified Document'}</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 leading-snug">
                    {lang === 'ne' ? doc.titleNe : doc.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-600 mt-1">
                    {lang === 'ne' ? doc.regTypeNe : doc.regTypeEn}
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5 font-sans">
                  <p className="text-sm sm:text-base font-extrabold text-amber-900 font-mono">
                    {lang === 'ne' ? doc.regNumberNe : doc.regNumberEn}
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    {lang === 'ne' ? doc.holderNe : doc.holderEn}
                  </p>
                  <p className="text-xs font-semibold text-zinc-600">
                    {lang === 'ne' ? doc.addressNe : doc.addressEn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                {doc.docUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenDoc(doc)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider transition cursor-pointer"
                    >
                      <span>{lang === 'ne' ? 'प्रमाणपत्र हेर्नुहोस् (Inspect)' : 'Inspect Document'}</span>
                      <ExternalLink size={14} />
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase">SECURE VERIFIED</span>
                  </>
                ) : (
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider transition"
                  >
                    <span>{lang === 'ne' ? 'सम्पर्क गर्नुहोस्' : 'Get in touch'}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Document Preview Modal */}
      {selectedDoc && selectedDoc.docUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white max-w-2xl w-full border-2 border-zinc-200 overflow-hidden shadow-2xl cursor-default text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#18181b] p-4 text-white flex items-center justify-between border-b-2 border-amber-600/80">
              <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider truncate mr-2">
                {lang === 'ne' ? selectedDoc.titleNe : selectedDoc.titleEn}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer transition shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Image Display with Instant Loading Spinner */}
            <div className="p-4 bg-zinc-900 flex items-center justify-center min-h-[300px] max-h-[78vh] overflow-auto relative">
              {isImgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 text-amber-400 gap-2 z-10">
                  <Loader2 className="animate-spin" size={32} />
                  <span className="text-xs font-mono font-bold tracking-wider">
                    {lang === 'ne' ? 'दस्तावेज लोड हुँदैछ...' : 'Loading official certificate...'}
                  </span>
                </div>
              )}
              <img
                src={selectedDoc.docUrl}
                alt={selectedDoc.titleEn}
                loading="eager"
                decoding="async"
                onLoad={() => setIsImgLoading(false)}
                className={`max-h-[74vh] w-auto object-contain rounded-xs shadow-lg bg-white transition-opacity duration-300 ${
                  isImgLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900 font-mono">
                  {lang === 'ne' ? selectedDoc.regNumberNe : selectedDoc.regNumberEn}
                </p>
                <p className="text-[11px] font-semibold text-zinc-600 truncate max-w-[200px] sm:max-w-md">
                  {lang === 'ne' ? selectedDoc.holderNe : selectedDoc.holderEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-800 cursor-pointer shrink-0"
              >
                {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};